// Convex validates Clerk-issued JWTs against this issuer. The domain comes from
// your Clerk instance's "convex" JWT template and is set as a Convex env var
// (npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-instance>.clerk.accounts.dev).
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
