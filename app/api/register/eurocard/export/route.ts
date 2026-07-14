import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Workbook from 'exceljs';

// FORÇA O NEXT.JS A NÃO CACHEAR ESTA ROTA (Busca sempre dados em tempo real)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Busca todos os módulos ordenados pelo número de forma sempre atualizada
    const modulos = await db.eurocardMeasurement.findMany({
      orderBy: { moduloNum: 'asc' },
    });

    // Cria o arquivo Excel
    const workbook = new Workbook.Workbook();
    const worksheet = workbook.addWorksheet('Medições Eurocard');

    // Configura a largura das colunas para ficar proporcional
    worksheet.columns = [
      { width: 18 }, // Coluna A: Eurocard
      { width: 18 }, // Coluna B: Módulo
      { width: 15 }, // Coluna C: dB
    ];

    let currentRow = 2; // Começa na linha 2 para dar uma margem do topo

    const eurocardRows = [
      { id: 'spl01', label: 'SPL 01' },
      { id: 'spl02', label: 'SPL 02' },
      { id: 'spl03', label: 'SPL 03' },
      { id: 'spl04', label: 'SPL 04' },
      { id: 'spl05', label: 'SPL 05' },
      { id: 'spl06', label: 'SPL 06' },
    ];

    // Estilos reutilizáveis (Bordas pretas grossas/médias)
    const thBorders = {
      top: { style: 'medium' as const, color: { argb: '000000' } },
      bottom: { style: 'medium' as const, color: { argb: '000000' } },
      left: { style: 'medium' as const, color: { argb: '000000' } },
      right: { style: 'medium' as const, color: { argb: '000000' } },
    };

    const tdBorders = {
      top: { style: 'thin' as const, color: { argb: '000000' } },
      bottom: { style: 'thin' as const, color: { argb: '000000' } },
      left: { style: 'thin' as const, color: { argb: '000000' } },
      right: { style: 'thin' as const, color: { argb: '000000' } },
    };

    // Varre cada módulo gerando uma tabela dedicada
    for (const modulo of modulos) {

      // 1. CRIA O CABEÇALHO DA TABELA DO MÓDULO
      const headerRow = worksheet.getRow(currentRow);
      headerRow.values = ['Eurocard', `MÓDULO ${modulo.moduloNum}`, 'dB'];
      headerRow.font = { bold: true, name: 'Arial', size: 11 };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };

      // Aplica fundo cinza claro e bordas no cabeçalho
      ['A', 'B', 'C'].forEach(col => {
        const cell = headerRow.getCell(col);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
        cell.border = thBorders;
      });

      headerRow.height = 25;
      currentRow++;

      // 2. PREENCHE OS DADOS (SPL01 até SPL06)
      for (const rowSpec of eurocardRows) {
        const startRow = currentRow;
        const endRow = currentRow + 1;

        // Garante que o valor venha como número ou caia para zero se nulo
        const valOut1 = (modulo[`${rowSpec.id}_out1` as keyof typeof modulo] as number) ?? 0;
        const valOut2 = (modulo[`${rowSpec.id}_out2` as keyof typeof modulo] as number) ?? 0;

        // Linha OUT 1
        const r1 = worksheet.getRow(currentRow);
        r1.getCell('A').value = rowSpec.label;
        r1.getCell('B').value = 'OUT 1';
        r1.getCell('C').value = valOut1;
        r1.height = 20;
        currentRow++;

        // Linha OUT 2
        const r2 = worksheet.getRow(currentRow);
        r2.getCell('A').value = rowSpec.label;
        r2.getCell('B').value = 'OUT 2';
        r2.getCell('C').value = valOut2;
        r2.height = 20;
        currentRow++;

        // Mescla a coluna "Eurocard" verticalmente para unir o OUT 1 e OUT 2
        worksheet.mergeCells(`A${startRow}:A${endRow}`);

        // Estiliza as células de dados e aplica o alinhamento centralizado
        for (let r = startRow; r <= endRow; r++) {
          const rowObj = worksheet.getRow(r);
          ['A', 'B', 'C'].forEach(col => {
            const cell = rowObj.getCell(col);
            cell.font = { name: 'Arial', size: 10, bold: col === 'A' || col === 'B' };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = tdBorders;

            // Força a formatação numérica com duas casas decimais na coluna C (dB)
            if (col === 'C') {
              cell.numFmt = '0.00';
              cell.font = { name: 'Arial', size: 10, bold: true };
            }
          });
        }
      }

      // Adiciona uma borda mais grossa no contorno final da tabela
      const lastRowOfBlock = worksheet.getRow(currentRow - 1);
      ['A', 'B', 'C'].forEach(col => {
        const cell = lastRowOfBlock.getCell(col);
        cell.border = {
          ...cell.border,
          bottom: { style: 'medium', color: { argb: '000000' } }
        };
      });

      // Pula 3 linhas em branco para separar a tabela do próximo Módulo
      currentRow += 3;
    }

    // Gera o buffer do arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Medicoes_Eurocard_Modulos.xlsx"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("Erro ao exportar planilhas:", error);
    return NextResponse.json({ error: "Erro interno ao gerar o Excel." }, { status: 500 });
  }
}