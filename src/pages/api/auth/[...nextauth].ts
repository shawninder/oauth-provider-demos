import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

import { env } from "../../../env/server.mjs";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
// export async function refreshAccessToken (token: JWT) {
//   try {
//     const searchParams: Record<string, string> = {
//       client_id: process.env.GOOGLE_CLIENT_ID || '',
//       client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
//       grant_type: 'refresh_token',
//       refresh_token: ''
//     }
//     const url = `https://oauth2.googleapis.com/token?${
//       (new URLSearchParams(searchParams)).toString()}`

//     const response = await fetch(url, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       method: 'POST'
//     })

//     const refreshedTokens: unknown = await response.json()

//     console.log('response', response)
//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token as string,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: 'RefreshAccessTokenError'
//     }
//   }
// }

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    // signIn ({ user, account, profile, email, credentials }): boolean {
    //   console.log({
    //     from: 'signIn callback',
    //     user,
    //     account,
    //     profile,
    //     email,
    //     credentials
    //   })
    //   return true
    // },
    jwt ({ token, user, account, profile, isNewUser }): JWT {
      // console.log({
      //   from: 'JWT callback arguments',
      //   token,
      //   user,
      //   account,
      //   profile,
      //   isNewUser
      // })
      if (account) {
        token.accessToken = account.access_token as string
      }
      return token
    //   if (account && user) {
    //     const expiresIn: number = account.expires_in as number
    //     return {
    //       accessToken: account.access_token,
    //       accessTokenExpires: Date.now() + expiresIn * 1000,
    //       refreshToken: account.refresh_token,
    //       user
    //     }
    //   }
    //   if (Date.now() < (token.accessTokenExpires || Infinity)) {
    //     return token
    //   }
    //   return refreshAccessToken(token)
    },
    session ({ session, user, token }): Session {
      // console.log({
      //   from: 'session callback',
      //   session,
      //   user,
      //   token
      // })
      session.accessToken = token.accessToken
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/adwords'
        }
      }
    })
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
