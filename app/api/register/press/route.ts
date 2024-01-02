import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, odf, amount, qtd, result } = body;
    const product = prefix + item;
    const date = new Date();
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    const dataHoraBrasil = `${day}/${month + 1}/${year} - ${hour}:${minutes}`;

    const press = await db.press.create({
      data: {
        item: product,
        version,
        odf,
        amount,
        qtd,
        result,
        createdAt: dataHoraBrasil,
      }
    });

    return NextResponse.json(press);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const res = await db.press.findMany();

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}