import { redirect } from "next/navigation";

export async function GET() {
  // 1. Grab your Google Client ID from the .env file
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not set in your .env file!");
  }
  
  // 2. Define exactly where Google should send the user back to
  // This must match the "Authorized redirect URIs" in your Google Cloud Console
  const redirectUri = "http://localhost:3000/api/auth/google/callback";

  // 3. Construct the official Google Authorization URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.append("client_id", clientId);
  googleAuthUrl.searchParams.append("redirect_uri", redirectUri);
  
  // 4. Google explicitly requires us to say we want a "code" back
  googleAuthUrl.searchParams.append("response_type", "code");
  
  // 5. Scope tells Google what data we are asking for permission to see
  // "email profile" specifically asks for their primary email and basic name/picture
  googleAuthUrl.searchParams.append("scope", "email profile");

  // 6. Instantly redirect the user's browser away from your app and over to Google!
  redirect(googleAuthUrl.toString());
}
