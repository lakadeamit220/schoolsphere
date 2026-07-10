import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request) {
  console.log("=== GOOGLE CALLBACK STARTED ===");
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  console.log("Code received:", !!code);

  if (!code) {
    return NextResponse.json({ error: "No code provided by Google" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/api/auth/google/callback";

  try {
    console.log("Exchanging token...");
    // 1. Token Exchange (Phase 3)
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.log("Token exchange error:", tokenData.error);
      return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }

    const accessToken = tokenData.access_token;
    console.log("Access token received!");

    // --- PHASE 4 BEGINS HERE --- //

    // 2. Fetch User Profile from Google API using the VIP Pass
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const googleUser = await userResponse.json();
    console.log("Google User Data:", googleUser.email, googleUser.name);

    const email = googleUser.email;
    const name = googleUser.name || "Google User";

    // 3. Database Integration
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log("Creating new user...");
      const role = email === "lakadeamit220@gmail.com" ? "ADMIN" : "STUDENT";
      const dummyPassword = crypto.randomBytes(32).toString("hex");

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: dummyPassword,
          role,
        },
      });
    }
    console.log("User in DB:", user.id, user.role);

    // 4. Generate the exact same JWT your manual login uses
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 5. Store the token securely in the cookie
    const cookieStore = await cookies();
    cookieStore.set("schoolsphere_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });
    console.log("Cookie set! Redirecting to /dashboard");

    // 6. Finally, redirect the user into the app!
    return NextResponse.redirect(new URL("/dashboard", request.url));

  } catch (error) {
    console.error("OAuth Flow failed:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
