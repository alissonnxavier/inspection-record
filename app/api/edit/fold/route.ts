import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, odf, amount, qtd, result, machine, id } = body;
    const product = prefix + item;
    const res = await db.fold.update({
      where: {
        id,
      },
      data: {
        item: product,
        version,
        odf,
        amount,
        qtd,
        result,
        machine,
      }
    });
    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
