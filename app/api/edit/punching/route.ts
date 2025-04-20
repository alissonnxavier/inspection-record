import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { id, prefix, item, version, thickness, odf, amount, qtd, result, cnc, machine } = body;
    const product = prefix + item;
    const punching = await db.punching.update({
      where: {
        id,
      },
      data: {
        item: product,
        version,
        thickness,
        odf,
        amount,
        qtd,
        result,
        cnc,
        machine,
      }
    });
    return NextResponse.json(punching);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const res = await db.punching.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}