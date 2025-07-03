import NextAuth from "next-auth";
import { authOptions } from "@/lib/next-auth/auth";

console.log(
  ">>>>>>>>>>>",
  process.env.NEXT_URL,
  process.env.NEXT_PUBLIC_URL,
  process.env.PRO_CONNECT_BASE_URL
);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
