import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
     try {
    const body = await req.json();
    const measurement = await db.$transaction(async (tx) => {
      const totalModulos = await tx.eurocardMeasurement.count();
      const proximoModuloNum = totalModulos + 1;

      return await tx.eurocardMeasurement.create({
        data: {
          moduloNum: proximoModuloNum,
          spl01_out1: body.spl01_out1,
          spl01_out2: body.spl01_out2,
          spl02_out1: body.spl02_out1,
          spl02_out2: body.spl02_out2,
          spl03_out1: body.spl03_out1,
          spl03_out2: body.spl03_out2,
          spl04_out1: body.spl04_out1,
          spl04_out2: body.spl04_out2,
          spl05_out1: body.spl05_out1,
          spl05_out2: body.spl05_out2,
          spl06_out1: body.spl06_out1,
          spl06_out2: body.spl06_out2,
        },
      });
    });

    return NextResponse.json(measurement, { status: 201 });
  }  catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET() {
  try {
    const totalModulos = await db.eurocardMeasurement.count();
    return NextResponse.json({ proximoNumero: totalModulos + 1 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar contagem." }, { status: 500 });
  }
}