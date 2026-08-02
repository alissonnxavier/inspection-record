import { NextResponse } from 'next/server';
import { db } from '@/lib/prismadb';

// GET: Retorna o próximo número sequencial do módulo dentro de uma OF específica
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ofParam = searchParams.get('of') || searchParams.get('ordemFabricacao');

    let whereClause = {};

    if (ofParam) {
      const ofFormatada = ofParam.trim().toUpperCase();
      // Filtra os módulos relacionados à OF enviada (pela relação com Book ou pela chave de OF)
      whereClause = {
        book: {
          ordemFabricacao: ofFormatada
        }
      };
    }

    const ultimoModulo = await db.eurocardMeasurement.findFirst({
      where: whereClause,
      orderBy: { moduloNum: 'desc' },
      select: { moduloNum: true }
    });

    // Se não houver módulo cadastrado nessa OF ainda, começa do 1
    const proximoNumero = (ultimoModulo?.moduloNum || 0) + 1;

    return NextResponse.json({ proximoNumero });
  } catch (error) {
    console.error("Erro ao buscar próximo número do módulo:", error);
    return NextResponse.json({ error: "Erro ao obter próximo número" }, { status: 500 });
  }
}

// POST: Salva o módulo recebendo o moduloNum e amarra à OF
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ordemFabricacao, moduloNum, ...medicoes } = body;

    if (!ordemFabricacao) {
      return NextResponse.json({ error: "Ordem de Fabricação não informada." }, { status: 400 });
    }

    const ofFormatada = ordemFabricacao.trim().toUpperCase();

    let numeroDoModulo = Number(moduloNum);

    // Caso o número venha inválido, calcula o próximo número especificamente para esta OF
    if (isNaN(numeroDoModulo) || !numeroDoModulo) {
      const ultimoModulo = await db.eurocardMeasurement.findFirst({
        where: {
          book: {
            ordemFabricacao: ofFormatada
          }
        },
        orderBy: { moduloNum: 'desc' },
        select: { moduloNum: true }
      });
      numeroDoModulo = (ultimoModulo?.moduloNum || 0) + 1;
    }

    const novoModulo = await db.eurocardMeasurement.create({
      data: {
        moduloNum: numeroDoModulo,
        ...medicoes,
        book: {
          connectOrCreate: {
            where: { ordemFabricacao: ofFormatada },
            create: { ordemFabricacao: ofFormatada }
          }
        }
      }
    });

    return NextResponse.json(novoModulo, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar módulo:", error);
    return NextResponse.json({ error: "Erro ao salvar o módulo no banco" }, { status: 500 });
  }
}