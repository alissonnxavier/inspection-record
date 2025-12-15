import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";



export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {

    let data = [];

    const pressChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    const punchingChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    const threaderChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    const foldChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    const soldierChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    const finishingChartData = [
        { month: "Janeiro", aprovado: 0, reprovado: 0 },
        { month: "Fevereiro", aprovado: 0, reprovado: 0 },
        { month: "Março", aprovado: 0, reprovado: 0 },
        { month: "Abril", aprovado: 0, reprovado: 0 },
        { month: "Maio", aprovado: 0, reprovado: 0 },
        { month: "Junho", aprovado: 0, reprovado: 0 },
        { month: "Julho", aprovado: 0, reprovado: 0 },
        { month: "Agosto", aprovado: 0, reprovado: 0 },
        { month: "Setembro", aprovado: 0, reprovado: 0 },
        { month: "Outubro", aprovado: 0, reprovado: 0 },
        { month: "novembro", aprovado: 0, reprovado: 0 },
        { month: "Dezembro", aprovado: 0, reprovado: 0 },
    ];

    try {
        const press = await db.press.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        const punching = await db.punching.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        const trheader = await db.threader.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        const fold = await db.fold.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        const soldier = await db.soldier.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        const finishing = await db.finishing.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        for (let i = 0; i < 12; i++) {
            press.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        pressChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        pressChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        for (let i = 0; i < 12; i++) {
            punching.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        punchingChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        punchingChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        for (let i = 0; i < 12; i++) {
            trheader.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        threaderChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        threaderChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        for (let i = 0; i < 12; i++) {
            fold.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        foldChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        foldChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        for (let i = 0; i < 12; i++) {
            soldier.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        soldierChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        soldierChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        for (let i = 0; i < 12; i++) {
            finishing.forEach(item => {
                if (item.createdAt.toISOString().slice(5, 7) === String(i + 1)) {
                    if (item.result === 'Aprovado') {
                        finishingChartData[i].aprovado += parseFloat(item.amount);
                    } else {
                        finishingChartData[i].reprovado += parseFloat(item.amount);
                    }
                }
            });
        };

        data = [
            { press: pressChartData },
            { punching: punchingChartData },
            { threader: threaderChartData },
            { fold: foldChartData },
            { soldier: soldierChartData },
            { finishing: finishingChartData },
        ];

        return NextResponse.json(data);
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }

};