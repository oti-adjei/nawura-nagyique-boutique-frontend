// import NextAuth from "next-auth"

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string
//       email: string
//       name?: string | null
//       image?: string | null
//       firstName?: string | null
//       lastName?: string | null
//     }
//   }

//   interface User {
//     id: string
//     email: string
//     name?: string | null
//     firstName?: string | null
//     lastName?: string | null
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string
//     firstName?: string | null
//     lastName?: string | null
//   }
// }
// src/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the built-in session.user type
   */
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
    };
  }

  /**
   * Extend the built-in user type
   */
  interface User extends DefaultUser {
    firstName?: string | null;
    lastName?: string | null;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in token type
   */
  interface JWT extends DefaultJWT {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  }
}
