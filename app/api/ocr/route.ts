import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { image } = await request.json(); // Recebe a imagem em base64

        if (!image) {
            return NextResponse.json({ error: "Imagem não fornecida" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_VISION_API_KEY;
        const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

        // Monta o payload no padrão que o Google Vision exige
        const payload = {
            requests: [
                {
                    image: {
                        content: image.replace(/^data:image\/\w+;base64,/, ""), // Limpa o cabeçalho do base64
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION", // Tipo de análise: Reconhecimento de texto
                        },
                    ],
                },
            ],
        };

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // Extrai o bloco de texto completo detectado pelo Google
        const fullText = data.responses?.[0]?.fullTextAnnotation?.text || "";

        return NextResponse.json({ text: fullText });
    } catch (error) {
        console.error("Erro na API do Google Vision:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}