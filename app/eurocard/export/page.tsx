'use client'

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportarEurocard() {
    const [exporting, setExporting] = useState(false);

    const handleExportExcel = async () => {
        setExporting(true);
        try {
            // Faz a requisição esperando um arquivo binário (blob)
            const response = await axios.get('/api/register/eurocard/export', {
                responseType: 'blob',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            });

            // Cria um link temporário oculto no DOM para disparar o download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Medicoes_Eurocard_Modulos.xlsx');
            document.body.appendChild(link);
            link.click();

            // Limpa os elementos residuais
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Planilha Excel exportada com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Falha ao gerar o arquivo Excel.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4 md:p-12">
            <Card className="border border-zinc-200 shadow-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-50 text-green-600 p-3 rounded-full w-fit mb-3">
                        <FileSpreadsheet className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-zinc-900">
                        Exportar Dados para Excel
                    </CardTitle>

                </CardHeader>

                <CardContent className="space-y-4 pt-2">


                    <Button
                        onClick={handleExportExcel}
                        disabled={exporting}
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-medium py-6 gap-2 text-base transition-all"
                    >
                        {exporting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Processando Planilha...
                            </>
                        ) : (
                            <>
                                <Download className="h-5 w-5" />
                                Baixar Planilha (.xlsx)
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}