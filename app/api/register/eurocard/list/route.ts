import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server"


export async function GET(request: Request) {
try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // Calcula quantos registros pular
    const skip = (page - 1) * limit;

    // Busca os dados paginados e o total ao mesmo tempo
    const [modulos, totalRegistros] = await db.$transaction([
      db.eurocardMeasurement.findMany({
        skip,
        take: limit,
        orderBy: { moduloNum: 'desc' },
      }),
      db.eurocardMeasurement.count()
    ]);

    const totalPaginas = Math.ceil(totalRegistros / limit);

    return NextResponse.json({
      modulos,
      meta: {
        paginaAtual: page,
        totalPaginas,
        totalRegistros
      }
    });
  } catch (error) {
    console.error("Erro ao listar módulos paginados:", error);
    return NextResponse.json({ error: "Erro ao buscar a lista." }, { status: 500 });
  }
}