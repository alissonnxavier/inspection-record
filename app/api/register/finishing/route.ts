import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const {
      prefix,
      item,
      version,
      odf,
      amount,
      qtd,
      result,
      inspector,
      newfield
    } = body;
    const product = prefix + item;
    const press = await db.finishing.create({
      data: {
        item: product,
        inspector,
        version,
        odf,
        amount,
        qtd,
        result,
        process: "Acabamento"
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
    const res = await db.finishing.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}