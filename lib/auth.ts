import { NextAuthOptions, User, getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { getToken } from "next-auth/jwt";
import { db } from "./prismadb";
const bcrypt = require('bcrypt');

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            //@ts-ignore
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password)

                    return null;

                const dbUser = await db.users.findFirst({
                    where: {
                        email: credentials.email
                    },
                })
                const saltRounds = 10;
                const salt = await bcrypt.genSalt(saltRounds);
                const isPasswordMath = await bcrypt.compare(credentials.password, dbUser?.password);
                if (dbUser && isPasswordMath) {
                    return dbUser
                }
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/error",
        signOut: "/",

    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_JWT_SECRET,
    callbacks: {
        async jwt({ token, user, profile, trigger, session, account }) {
            return {
                ...token,
            }
        },
        async session({ session, token, user }) {
            if (session) {
                const admin = await db.users.findFirst({
                    where: {
                        email: user?.email,
                    }
                })
                session = Object.assign({}, session, { admin: {}})
                 
            }
            return {
                ...session,
            }
        },
    },
};

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("https://properly-whole-crab.ngrok-free.app/");
}

