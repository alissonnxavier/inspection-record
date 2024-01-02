import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, thickness, odf, amount, qtd, result } = body;
    const product = prefix + item;


    const punching = await db.punching.create({
      data: {
        item: product,
        version,
        thickness,
        odf,
        amount,
        qtd,
        result
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
    
    const res = await db.punching.findMany();

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

}