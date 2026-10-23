import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export const SESSION_COOKIE = "session_token";

export type AuthUser = {
  _id: string;
  githubId: string;
  username: string;
  avatarUrl?: string;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectDB();
  const session = await Session.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;

  const user = await User.findById(session.userId);
  if (!user) return null;

  return {
    _id: String(user._id),
    githubId: user.githubId,
    username: user.username,
    avatarUrl: user.avatarUrl,
  };
}
