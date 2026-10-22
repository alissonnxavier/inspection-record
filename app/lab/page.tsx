'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    FileText, FileDown, Loader2, ArrowLeft, Layers, CheckCircle2, XCircle, UploadCloud, Printer
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { toPng } from 'html-to-image';

interface FanoutData {
    channel: string;
    length: number;
    il850: number;
    il1300: number;
    rl850: number;
    rl1300: number;
    status: 'PASS' | 'FAIL';
}

export default function Page() {
    const router = useRouter();
    const reportRef = useRef<HTMLDivElement>(null);

    const [fileName, setFileName] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [fanoutData, setFanoutData] = useState<FanoutData[]>([]);

    const [codigoText, setCodigoText] = useState('');
    const [loteText, setLoteText] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) return;

                const lines = text.split(/\r?\n/);
                const parsedData: FanoutData[] = [];

                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine || trimmedLine.startsWith('RL=') || trimmedLine.startsWith('Optical Path')) {
                        return;
                    }

                    if (trimmedLine.startsWith('Ch.')) {
                        const cols = trimmedLine.split(',');
                        if (cols.length >= 7) {
                            const channel = cols[0].trim();
                            const length = parseFloat(cols[1]);
                            const il850 = parseFloat(cols[2]);
                            const il1300 = parseFloat(cols[3]);
                            const rl850 = parseFloat(cols[4]);
                            const rl1300 = parseFloat(cols[5]);
                            const status = cols[6].trim() as 'PASS' | 'FAIL';

                            parsedData.push({
                                channel,
                                length: isNaN(length) ? 0 : length,
                                il850: isNaN(il850) ? 0 : il850,
                                il1300: isNaN(il1300) ? 0 : il1300,
                                rl850: isNaN(rl850) ? 0 : rl850,
                                rl1300: isNaN(rl1300) ? 0 : rl1300,
                                status: status || 'PASS'
                            });
                        }
                    }
                });

                setFanoutData(parsedData);
            };

            reader.readAsText(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'] },
        maxFiles: 1,
    });

    const formatVal = (val: number) => {
        if (isNaN(val)) return '0.00';
        return val.toFixed(2);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportImage = async () => {
        if (reportRef.current) {
            try {
                setIsExporting(true);
                const dataUrl = await toPng(reportRef.current, { cacheBust: true, backgroundColor: 'transparent' });
                const link = document.createElement('a');
                link.download = `etiqueta-patch-cord.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error('Erro ao gerar imagem:', err);
            } finally {
                setIsExporting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col items-center transition-colors">

            {/* Estilos CSS específicos para Impressão */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-section, #print-section * {
            visibility: visible;
          }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

            {/* Cabeçalho da Página (Oculto na Impressão) */}
            <div className="w-full max-w-6xl flex items-center justify-between mb-6 print:hidden">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Button>
                <h1 className="text-xl md:text-2xl font-bold">
                    Etiqueta de cordão óptico
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handlePrint}
                        disabled={fanoutData.length === 0}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                        <Printer className="w-4 h-4" /> Imprimir Etiqueta
                    </Button>
                    <Button
                        onClick={handleExportImage}
                        disabled={isExporting || fanoutData.length === 0}
                        className="flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                        Exportar Imagem
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">

                {/* Painel Esquerdo: Upload e Inputs de Código/Lote */}
                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col gap-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" /> Configurar Etiqueta
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="codigo">Texto / Código da Etiqueta</Label>
                            <Input
                                id="codigo"
                                value={codigoText}
                                onChange={(e) => setCodigoText(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="lote">Lote / Informação Adicional</Label>
                            <Input
                                id="lote"
                                value={loteText}
                                onChange={(e) => setLoteText(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <hr className="border-border" />

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UploadCloud className="w-10 h-10 mb-2 text-primary" />
                            <p className="text-sm font-medium text-foreground">Arraste seu arquivo `.txt` aqui</p>
                            <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar</p>
                        </div>
                    </div>

                    {fileName && (
                        <div className="flex items-center justify-between bg-muted/50 p-2.5 rounded-md border border-border text-xs">
                            <span className="flex items-center gap-1.5 truncate font-medium">
                                <FileText className="w-4 h-4 text-primary" /> {fileName}
                            </span>
                            <span className="text-emerald-500 font-semibold">{fanoutData.length} canais lidos</span>
                        </div>
                    )}
                </div>

                {/* Painel Direito: Tabela de Visualização */}
                <div className="lg:col-span-2 bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col">
                    <div ref={reportRef} className="bg-card text-card-foreground p-6 rounded-lg flex-1 border border-border">

                        <div className="border-b border-border pb-4 mb-4 flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                                    Prévia dos Dados
                                </span>
                                <h3 className="text-xl font-bold mt-1">{codigoText}</h3>
                                <p className="text-sm text-muted-foreground">Lote: {loteText} | Canais: {fanoutData.length}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                                    <tr>
                                        <th className="p-2.5 rounded-l-md font-bold">Canal (NO.)</th>
                                        <th className="p-2.5 font-bold">A IL / RL</th>
                                        <th className="p-2.5 font-bold">B IL / RL</th>
                                        <th className="p-2.5 rounded-r-md font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {fanoutData.length > 0 ? (
                                        fanoutData.map((item, index) => (
                                            <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-2.5 font-bold">{item.channel}</td>
                                                <td className="p-2.5 font-semibold text-muted-foreground">{formatVal(item.il1300)} / {formatVal(item.rl1300)}</td>
                                                <td className="p-2.5 font-semibold text-muted-foreground">{formatVal(item.il850)} / {formatVal(item.rl850)}</td>
                                                <td className="p-2.5">
                                                    {item.status === 'PASS' ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs font-bold">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full text-xs font-bold">
                                                            <XCircle className="w-3.5 h-3.5" /> FAIL
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12 text-muted-foreground font-medium">
                                                Nenhum arquivo carregado. Faça o upload do arquivo `.txt` ao lado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>

            {/* Seção de Impressão (Sem padding/espaçamentos internos e com fonte 2xl em tudo) */}
            <div id="print-section" className="hidden print:block w-full bg-white text-black font-black">
                <div className="border-4 border-black p-0 max-w-xl mx-auto">

                    {/* Título Principal */}
                    <div className="text-center text-2xl font-black border-b-4 border-black pb-0 mb-0 tracking-wider uppercase leading-none p-0">
                        Fiber Optic Patch Cord
                    </div>

                    {/* Segunda faixa grande com o Código / Descrição informada */}
                    <div className="text-center text-xl font-black border-b-4 border-black pb-0 mb-0 px-0 uppercase tracking-tight leading-none p-0">
                        {codigoText} {loteText ? `- ${loteText}` : ''}
                    </div>

                    {/* Tabela sem padding e fontes 2xl */}
                    <table className="w-full border-collapse border-2 border-black font-black m-0">
                        <thead>
                            <tr className="border-b-4 border-black text-center font-black bg-slate-100 m-0 p-0">
                                <th className="border-2 border-black p-0 m-0 text-2xl leading-none">NO.</th>
                                <th className="border-2 border-black p-0 m-0 text-2xl leading-none" colSpan={2}>A IL/RL(dB)</th>
                                <th className="border-2 border-black p-0 m-0 text-2xl leading-none" colSpan={2}>B IL/RL(dB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fanoutData.map((item, idx) => {
                                const channelNum = item.channel.replace('Ch.', '');
                                return (
                                    <tr key={idx} className="border-b-2 border-black text-center font-black m-0 p-0">
                                        <td className="border-2 border-black p-0 m-0 font-black text-2xl leading-none">{channelNum}</td>
                                        <td className="border-2 border-black p-0 m-0 text-2xl font-black leading-none">{formatVal(item.il1300)}</td>
                                        <td className="border-2 border-black p-0 m-0 text-2xl font-black leading-none">{formatVal(item.rl1300)}</td>
                                        <td className="border-2 border-black p-0 m-0 text-2xl font-black leading-none">{formatVal(item.il850)}</td>
                                        <td className="border-2 border-black p-0 m-0 text-2xl font-black leading-none">{formatVal(item.rl850)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>
    );
}