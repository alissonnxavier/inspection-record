import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import { db } from "./prismadb";

export const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                name: {
                    label: "Name",
                    type: "name",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.name || !credentials.password)
                    return null;

                const dbUser = await db.users.findFirst({
                    where: {
                        name: credentials.name
                    },
                });

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
    session: { strategy: 'jwt' },
};

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("https://properly-whole-crab.ngrok-free.app/");
}


