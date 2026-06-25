import { NextResponse } from "next/server";

export async function GET(request) {
  // 1. Extract the "code" from the URL that GitHub sent back to us
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided by GitHub" }, { status: 400 });
  }

  // 2. Prepare our highly classified secrets for the handshake
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    // 3. Make a secure, server-to-server POST request to GitHub to exchange the code
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // We strictly tell GitHub to reply in JSON format
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

    // 4. We successfully got the VIP Pass!
    const accessToken = tokenData.access_token;

    // FOR PHASE 3: We will just print the token to your browser screen so you can see it worked!
    // In Phase 4, we will delete this return statement and actually use the token to fetch your profile.
    return NextResponse.json({ 
      message: "Secret Handshake Complete! We got the VIP pass.", 
      access_token: accessToken 
    });

  } catch (error) {
    console.error("Token exchange failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
