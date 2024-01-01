
import { db } from "@/lib/prismadb";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { name, password } = credentials;

                try {
                    
                    const user = await db.users.findFirst({ 
                        where: {
                            name: name
                        }
                     });

                     console.log('este e o meu user',user);

                    if (!user) {
                        return null;
                    }                   

                    return user;
                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: 'dlsfçjasdjçfjçsdajçklf',
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };