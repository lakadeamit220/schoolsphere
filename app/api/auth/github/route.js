import { redirect } from "next/navigation";

export async function GET() {
  // 1. Grab your Client ID from the .env file
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    throw new Error("GITHUB_CLIENT_ID is not set in your .env file!");
  }
  
  // 2. Define exactly where GitHub should send the user back to
  // This must match the "Authorization callback URL" in your GitHub app settings
  const redirectUri = "http://localhost:3000/api/auth/github/callback";

  // 3. Construct the official GitHub Authorization URL
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.append("client_id", clientId);
  githubAuthUrl.searchParams.append("redirect_uri", redirectUri);
  
  // 4. Scope tells GitHub what data we are asking for permission to see
  // "user:email" specifically asks for their primary email address
  githubAuthUrl.searchParams.append("scope", "user:email");

  // 5. Instantly redirect the user's browser away from your app and over to GitHub!
  redirect(githubAuthUrl.toString());
}
