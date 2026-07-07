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
};

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "O ID do módulo é obrigatório." }, { status: 400 });
    }

    // Exclui o documento no MongoDB usando o campo nativo do Prisma
    await db.eurocardMeasurement.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}