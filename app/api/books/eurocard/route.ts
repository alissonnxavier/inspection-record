import { NextResponse } from 'next/server';
import { db } from '@/lib/prismadb';

// GET: Lista todos os Books com a quantidade de medições/módulos
export async function GET() {
  try {
    const books = await db.book.findMany({
      include: {
        _count: {
          select: { modulos: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const booksFormatted = books.map((book) => ({
      id: book.id,
      ordemFabricacao: book.ordemFabricacao,
      createdAt: book.createdAt,
      modulosCount: book._count.modulos,
    }));

    return NextResponse.json(booksFormatted);
  } catch (error) {
    console.error("Erro ao buscar books:", error);
    return NextResponse.json({ error: "Erro ao buscar books" }, { status: 500 });
  }
}

// POST: Cria um novo Book por OF
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ordemFabricacao } = body;

    if (!ordemFabricacao) {
      return NextResponse.json({ error: "Ordem de Fabricação é obrigatória." }, { status: 400 });
    }

    const ofFormatada = ordemFabricacao.trim().toUpperCase();

    const bookExistente = await db.book.findUnique({
      where: { ordemFabricacao: ofFormatada }
    });

    if (bookExistente) {
      return NextResponse.json({ error: "Já existe um Book com esta Ordem de Fabricação." }, { status: 400 });
    }

    const newBook = await db.book.create({
      data: {
        ordemFabricacao: ofFormatada,
      }
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar book:", error);
    return NextResponse.json({ error: "Erro ao criar o Book" }, { status: 500 });
  }
}

// DELETE: Exclui o Book e, devido ao 'onDelete: Cascade', exclui também todos os EurocardMeasurement vinculados
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "O ID do Book é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    await db.book.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Book e suas medições foram excluídos com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir book:", error);
    return NextResponse.json(
      { error: "Erro interno ao tentar excluir o Book." },
      { status: 500 }
    );
  }
}