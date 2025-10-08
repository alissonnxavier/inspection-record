import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, odf, amount, qtd, result, inspector } = body;
    const product = prefix + item;
    const press = await db.press.create({
      data: {
        item: product,
        inspector,
        version,
        odf,
        amount,
        qtd,
        result,
        process: "Prensa",
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
    const res = await db.press.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

};