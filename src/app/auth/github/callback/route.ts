import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";
import { SESSION_COOKIE } from "@/lib/auth";

function baseUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_BASE_URL ?? new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(
      new URL("/?authError=invalid_state", request.url)
    );
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/?authError=missing_env", request.url)
    );
  }

  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${baseUrl(request)}/auth/github/callback`,
      }),
    }
  );
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error(
      "[auth/github/callback] token exchange failed:",
      tokenData
    );
    return NextResponse.redirect(
      new URL(
        `/?authError=token_exchange_failed&reason=${encodeURIComponent(
          tokenData.error ?? "unknown"
        )}`,
        request.url
      )
    );
  }

  const ghUserRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "todo-app",
    },
  });
  const ghUser = await ghUserRes.json();

  if (!ghUser.id) {
    return NextResponse.redirect(
      new URL("/?authError=github_user_fetch_failed", request.url)
    );
  }

  await connectDB();
  const user = await User.findOneAndUpdate(
    { githubId: String(ghUser.id) },
    {
      githubId: String(ghUser.id),
      username: ghUser.login,
      avatarUrl: ghUser.avatar_url,
    },
    { upsert: true, new: true }
  );

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await Session.create({ token, userId: user._id, expiresAt });

  const res = NextResponse.redirect(new URL("/", request.url));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    expires: expiresAt,
    path: "/",
    sameSite: "lax",
  });
  res.cookies.delete("oauth_state");
  return res;
}
