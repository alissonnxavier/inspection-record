"use server";

import { db } from "@/lib/prismadb"

export const verifyAdmin = async (email: any) => {

    const user = await db.users.findFirst({
        where: {
            email,
        },
    });
    return user?.admin;
}