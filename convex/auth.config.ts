import { defineAuth } from "@convex-dev/auth/server";
import { clerk } from "@convex-dev/auth/clerk";

// Configure Convex to accept Clerk-issued JWTs.
// The Clerk JWT template "convex" should be enabled in production.
export default defineAuth({
  providers: [clerk()],
});
