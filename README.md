# OAuth integration demos!

This app demonstrates how to allow users to log in with various providers and make API requests on their behalf to aggregate Advertizement data from various platforms onto a single dashboard.

## Integrations

### Google
You will need to add the following values to your environment variables via .env and .env.local, all of which you can get / set up in the Google Developer Console:
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - GOOGLE_DEV_TOKEN (see https://developers.google.com/google-ads/api/docs/first-call/dev-token)
  - GOOGLE_AUTH_REDIRECT (this should be http://localhost:3000/api/auth/callback/google when using an unmodified next-auth, as it is set it `.env.example`)

Depending on which API endpoints you reach, you may need to add additional scopes in the provider settings in `[...nextauth].ts`

Notice that I've installed `google-ads-api` from npm to help with making authenticated OAuth2 requests.

#### Note
When the user signs in, I store the access token in the session, allowing for subsequent authenticated requests to be made. This should likely instead be stored in your user database if you have one.

#### Links
- [NextAuth - Google Authentications for Nextjs](https://refine.dev/blog/nextauth-google-github-authentication-nextjs/)
- [Obtain your Developer Token](https://developers.google.com/google-ads/api/docs/first-call/dev-token)