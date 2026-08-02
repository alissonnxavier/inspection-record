import { NextResponse } from 'next/server';
import { db } from '@/lib/prismadb';

// GET: Lista todos os Books e traz a quantidade exata de módulos de cada um
export async function GET() {
  try {
    const books = await db.book.findMany({
      include: {
        _count: {
          select: { modulos: true } // Conta quantos registros existem na relação 'modulos'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mapeia para entregar o valor no campo modulosCount no JSON de resposta
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