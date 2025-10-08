import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, odf, amount, qtd, result, inspector, machine } = body;
    const product = prefix + item;
    const res = await db.fold.create({
      data: {
        item: product,
        version,
        odf,
        amount,
        qtd,
        result,
        inspector,
        machine,
        process: "Dobra"
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
    const res = await db.fold.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}