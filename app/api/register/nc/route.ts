import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { prefix, item, version, thickness, odf, amount, cnc, inspector, machine, amountNc, report } = body;
    const product = prefix + item;
    const nc = await db.nc.create({
      data: {
        item: product,
        version,
        thickness,
        odf,
        amount,
        amountNc: amountNc,
        cnc,
        inspector,
        machine,
        report,
      }
    });
    return NextResponse.json(nc);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const res = await db.nc.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
};