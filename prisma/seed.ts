import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função auxiliar para gerar um número decimal fictício realista (ex: entre 3.20 e 3.70)
function gerarDbFicticio(min = 3.2, max = 3.7): number {
    const valor = Math.random() * (max - min) + min;
    return parseFloat(valor.toFixed(2)); // Garante duas casas decimais
}

async function main() {
    console.log('--- Iniciando a geração de 450 módulos fictícios ---');

    const totalModulos = 450;
    const promessas = [];

    for (let i = 1; i <= totalModulos; i++) {
        promessas.push(
            prisma.eurocardMeasurement.create({
                data: {
                    moduloNum: i, // Define sequencialmente de 1 até 390
                    spl01_out1: gerarDbFicticio(),
                    spl01_out2: gerarDbFicticio(),
                    spl02_out1: gerarDbFicticio(),
                    spl02_out2: gerarDbFicticio(),
                    spl03_out1: gerarDbFicticio(),
                    spl03_out2: gerarDbFicticio(),
                    spl04_out1: gerarDbFicticio(),
                    spl04_out2: gerarDbFicticio(),
                    spl05_out1: gerarDbFicticio(),
                    spl05_out2: gerarDbFicticio(),
                    spl06_out1: gerarDbFicticio(),
                    spl06_out2: gerarDbFicticio(),
                },
            })
        );
    }

    // Executa todas as criações no banco de dados
    await Promise.all(promessas);

    console.log(`✅ Sucesso! ${totalModulos} módulos inseridos com dados fictícios.`);
}

main()
    .catch((e) => {
        console.error('Erro ao rodar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });