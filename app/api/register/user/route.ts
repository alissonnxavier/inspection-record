import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";
const bcrypt = require('bcrypt');

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password
    } = body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userExists = await db.users.findFirst({
      where: {
        email: email,
      }
    })
    if (userExists) {
      throw new Error("Este email ja esta em uso!!!")
    }
    const users = await db.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        admin: "false"
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
};
