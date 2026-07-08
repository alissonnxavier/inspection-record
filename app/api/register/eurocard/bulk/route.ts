import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// POST: Cria uma quantidade X de módulos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quantidade } = body;

    if (!quantidade || quantidade <= 0) {
      return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
    }

    // Busca o último número de módulo para continuar a sequência numérica corretamente
    const ultimoModulo = await db.eurocardMeasurement.findFirst({
      orderBy: { moduloNum: 'desc' },
      select: { moduloNum: true }
    });

    let proximoNumero = (ultimoModulo?.moduloNum || 0) + 1;
    const novosModulos = [];

    // Gera os dados mockados para o loop
    for (let i = 0; i < quantidade; i++) {
      novosModulos.push({
        moduloNum: proximoNumero++,
        // Valores mockados entre 0.0 e 15.0 para os SPLs
        spl01_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl01_out2: parseFloat((Math.random() * 3).toFixed(2)),
        spl02_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl02_out2: parseFloat((Math.random() * 3).toFixed(2)),
        spl03_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl03_out2: parseFloat((Math.random() * 3).toFixed(2)),
        spl04_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl04_out2: parseFloat((Math.random() * 3).toFixed(2)),
        spl05_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl05_out2: parseFloat((Math.random() * 3).toFixed(2)),
        spl06_out1: parseFloat((Math.random() * 3).toFixed(2)),
        spl06_out2: parseFloat((Math.random() * 3).toFixed(2)),
      });
    }

    // Insere tudo de uma vez no banco de dados (Alta performance)
    await db.eurocardMeasurement.createMany({
      data: novosModulos,
    });

    return NextResponse.json({ success: true, message: `${quantidade} módulos gerados!` });
  } catch (error) {
    console.error("Erro ao gerar módulos em massa:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}

// DELETE: Apaga TODOS os registros da tabela
export async function DELETE() {
  try {
    // Deleta absolutamente tudo da tabela de medições
    await db.eurocardMeasurement.deleteMany({});

    return NextResponse.json({ success: true, message: "Todos os módulos foram apagados." });
  } catch (error) {
    console.error("Erro ao limpar banco de dados:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}