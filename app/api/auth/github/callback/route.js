import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided by GitHub" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // 1. Token Exchange (Phase 3)
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // --- PHASE 4 BEGINS HERE --- //

    // 2. Fetch User Profile from GitHub API using the VIP Pass
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser = await userResponse.json();

    // Sometimes users hide their public email on GitHub, so we have to explicitly fetch their emails array
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubEmails = await emailsResponse.json();
    
    // Grab the primary email address
    const primaryEmailObj = githubEmails.find((e) => e.primary) || githubEmails[0];
    const email = primaryEmailObj.email;
    const name = githubUser.name || githubUser.login || "GitHub User";

    // 3. Database Integration
    // Does this user already exist in our database?
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // If not, we create them!
      // Admin Promotion Logic: If the email matches your admin email, automatically grant the ADMIN role.
      const role = email === "lakadeamit220@gmail.com" ? "ADMIN" : "STUDENT";
      
      // Since your schema.prisma requires a password, but OAuth doesn't use one, 
      // we generate a massive random string that no one will ever know or use.
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

    // 6. Finally, redirect the user into the app!
    return NextResponse.redirect(new URL("/dashboard", request.url));

  } catch (error) {
    console.error("OAuth Flow failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
