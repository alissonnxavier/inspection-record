import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, odf, amount, qtd, result, process } = body;
    const product = prefix + item;
    const res = await db.soldier.create({
      data: {
        item: product,
        version,
        odf,
        amount,
        qtd,
        result,
        process,
      }
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    
    const res = await db.soldier.findMany();

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}