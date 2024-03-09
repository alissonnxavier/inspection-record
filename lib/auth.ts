import { NextAuthOptions, User, getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { setCookie } from "nookies";
import { getToken } from "next-auth/jwt";
//@ts-ignore
import jsonwebtoken  from 'jsonwebtoken'

import { db } from "./prismadb";
import { randomBytes, randomUUID } from "crypto";

const callbacks = {}

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                name: {
                    label: "Name",
                    type: "name",
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            //@ts-ignore
            async authorize(credentials) {
                if (!credentials || !credentials.name || !credentials.password)
                    return null;

                const dbUser = await db.users.findFirst({
                    where: {
                        name: credentials.name
                    },
                })


                //Verify Password here
                //We are going to use a simple === operator
                //In production DB, passwords should be encrypted using something like bcrypt...
                if (dbUser && dbUser.password === credentials.password) {
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
        signOut: "https://properly-whole-crab.ngrok-free.app/",
    },
    session: { 
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_JWT_SECRET,
    callbacks: {

    },
    
};

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("https://properly-whole-crab.ngrok-free.app/");
}


