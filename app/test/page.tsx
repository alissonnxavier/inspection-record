'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    FileText, FileDown, Loader2, ArrowLeft, Layers, CheckCircle2, XCircle, Filter, UploadCloud, Printer
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toPng } from 'html-to-image';

interface FiberData {
    fiber: string;
    direction: string;
    wavelength: number;
    status: 'Pass' | 'Fail';
    attenuation: number;
    length: number;
}

export default function Page() {
    const router = useRouter();
    const reportRef = useRef<HTMLDivElement>(null);

    const [cableId, setCableId] = useState('Não informado');
    const [operator, setOperator] = useState('Não informado');
    const [enteredLength, setEnteredLength] = useState('0');
    const [fileName, setFileName] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [wavelengthFilter, setWavelengthFilter] = useState<string>('1550');
    const [fiberData, setFiberData] = useState<FiberData[]>([]);

    const parseCSVLine = (text: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (!text) return;

                const lines = text.split(/\r?\n/);
                const parsedData: FiberData[] = [];

                lines.forEach(line => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return;

                    if (trimmedLine.startsWith('CABO,')) {
                        const parts = parseCSVLine(trimmedLine);
                        if (parts[1]) setCableId(parts[1]);
                    }
                    if (trimmedLine.startsWith('Operator Name,')) {
                        const parts = parseCSVLine(trimmedLine);
                        if (parts[1]) setOperator(parts[1]);
                    }
                    if (trimmedLine.startsWith('Entered Length (m),')) {
                        const parts = parseCSVLine(trimmedLine);
                        if (parts[1]) setEnteredLength(parts[1]);
                    }

                    if (trimmedLine.startsWith('"')) {
                        const cols = parseCSVLine(trimmedLine);
                        if (cols.length >= 8) {
                            const fiberName = cols[0].replace(/"/g, '');
                            const direction = cols[1];
                            const wavelength = parseInt(cols[2], 10);
                            const status = cols[5] as 'Pass' | 'Fail';
                            const attenuation = parseFloat(cols[6]);
                            const length = parseFloat(cols[7]);

                            if (!isNaN(wavelength) && !isNaN(attenuation)) {
                                parsedData.push({
                                    fiber: fiberName,
                                    direction,
                                    wavelength,
                                    status: status || 'Pass',
                                    attenuation,
                                    length: isNaN(length) ? 0 : length
                                });
                            }
                        }
                    }
                });

                setFiberData(parsedData);
            };

            reader.readAsText(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'], 'text/csv': ['.csv'] },
        maxFiles: 1,
    });

    const filteredData = fiberData.filter(item => {
        if (wavelengthFilter === 'all') return true;
        return item.wavelength.toString() === wavelengthFilter;
    });

    const fibers1550 = fiberData.filter(item => item.wavelength === 1550);

    const minLength1550 = fibers1550.length > 0
        ? Math.min(...fibers1550.map(f => f.length))
        : 0;

    const column1 = fibers1550.slice(0, 12);
    const column2 = fibers1550.slice(12, 24);
    const column3 = fibers1550.slice(24, 36);

    const formatFiberName = (fullName: string) => {
        if (!fullName) return '';
        return fullName.replace(/BRANCO\s*,\s*/gi, '').trim().toUpperCase();
    };

    const formatAttenuation = (val: number) => {
        if (isNaN(val)) return '';
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
                link.download = `relatorio-cabo-${cableId}-${wavelengthFilter}nm.png`;
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
                    Analisador de Relatório Óptico (OTDR)
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handlePrint}
                        disabled={fibers1550.length === 0}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Printer className="w-4 h-4" /> Imprimir Etiqueta
                    </Button>
                    <Button
                        onClick={handleExportImage}
                        disabled={isExporting || fiberData.length === 0}
                        className="flex items-center gap-2"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                        Exportar Imagem
                    </Button>
                </div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">

                {/* Painel Esquerdo: Upload e Filtros */}
                <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col gap-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" /> Carregar Relatório
                    </h2>

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
                            <span className="text-emerald-500 font-semibold">{fiberData.length} fibras lidas</span>
                        </div>
                    )}

                    <hr className="border-border" />

                    <div className="space-y-3">
                        <Label className="font-semibold flex items-center gap-1.5">
                            <Filter className="w-4 h-4 text-primary" /> Filtrar por Comprimento de Onda
                        </Label>
                        <RadioGroup
                            value={wavelengthFilter}
                            onValueChange={setWavelengthFilter}
                            className="flex flex-col gap-2 pt-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1550" id="w1550" />
                                <Label htmlFor="w1550" className="cursor-pointer text-sm">Ondas de 1550 nm (Atenuação e Metragem)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1310" id="w1310" />
                                <Label htmlFor="w1310" className="cursor-pointer text-sm">Ondas de 1310 nm</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="wAll" />
                                <Label htmlFor="wAll" className="cursor-pointer text-sm">Exibir Ambas (1310 e 1550 nm)</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg border border-border text-xs space-y-1.5 text-muted-foreground">
                        <p><strong className="text-foreground">Cabo ID:</strong> {cableId}</p>
                        <p><strong className="text-foreground">Operador:</strong> {operator}</p>
                        <p><strong className="text-foreground">Comprimento Informado:</strong> {enteredLength}m</p>
                    </div>
                </div>

                {/* Painel Direito: Relatório Formatado e Tabela */}
                <div className="lg:col-span-2 bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col">
                    <div ref={reportRef} className="bg-card text-card-foreground p-6 rounded-lg flex-1 border border-border">

                        <div className="border-b border-border pb-4 mb-4 flex justify-between items-start">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                                    Filtro Ativo: {wavelengthFilter === 'all' ? 'Todas as Frequências' : `${wavelengthFilter} nm`}
                                </span>
                                <h3 className="text-xl font-bold mt-1">Cabo: {cableId}</h3>
                                <p className="text-sm text-muted-foreground">Operador: {operator} | Fibras Listadas: {filteredData.length}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                                Data: {new Date().toLocaleDateString()}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted text-muted-foreground uppercase text-xs">
                                    <tr>
                                        <th className="p-2.5 rounded-l-md">Fibra (Cores)</th>
                                        <th className="p-2.5">Direção</th>
                                        <th className="p-2.5">Onda (nm)</th>
                                        <th className="p-2.5 font-semibold text-primary">Atenuação (dB/km)</th>
                                        <th className="p-2.5 font-semibold text-primary">Comprimento (m)</th>
                                        <th className="p-2.5 rounded-r-md">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => (
                                            <tr key={index} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-2.5 font-medium">{item.fiber}</td>
                                                <td className="p-2.5 text-muted-foreground">{item.direction}</td>
                                                <td className="p-2.5 text-muted-foreground">{item.wavelength} nm</td>
                                                <td className="p-2.5 font-semibold text-primary">{item.attenuation}</td>
                                                <td className="p-2.5 font-semibold text-primary">{item.length}</td>
                                                <td className="p-2.5">
                                                    {item.status === 'Pass' ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs font-medium">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full text-xs font-medium">
                                                            <XCircle className="w-3.5 h-3.5" /> Fail
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                Nenhum arquivo carregado ou nenhum dado correspondente ao filtro. Faça o upload do arquivo `.txt` ao lado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>

            {/* Seção de Impressão com Letras Maiores e Mais Legíveis */}
            <div id="print-section" className="hidden print:block w-full p-4 bg-white text-black">
                <div className="border-2 border-black rounded-lg p-4 max-w-4xl mx-auto">

                    <div className="grid grid-cols-4 border-b-2 border-black pb-3 mb-3 text-sm font-bold text-center">
                        <div className="border-r border-black pr-2">MENOR M: {minLength1550 !== Infinity ? `${minLength1550}m` : ''}</div>
                        <div className="border-r border-black pr-2">DATA: {new Date().toLocaleDateString()}</div>
                        <div className="border-r border-black pr-2">LOTE: {cableId}</div>
                        <div>LANCE: {enteredLength}m</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">

                        {/* Coluna 1 */}
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-slate-200 text-black border-b border-black text-xs font-bold">
                                    <th className="border border-black p-1.5">FIBRA</th>
                                    <th className="border border-black p-1.5">METRAGEM</th>
                                    <th className="border border-black p-1.5">ATENUAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 12 }).map((_, idx) => {
                                    const item = column1[idx];
                                    return (
                                        <tr key={idx} className="border-b border-black h-8">
                                            <td className="border border-black p-1.5 font-bold text-xs text-center">
                                                {item ? formatFiberName(item.fiber) : ''}
                                            </td>
                                            <td className="border border-black p-1.5 text-center text-xs font-semibold">{item ? item.length : ''}</td>
                                            <td className="border border-black p-1.5 text-center text-xs font-bold">
                                                {item ? formatAttenuation(item.attenuation) : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Coluna 2 */}
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-slate-200 text-black border-b border-black text-xs font-bold">
                                    <th className="border border-black p-1.5">FIBRA</th>
                                    <th className="border border-black p-1.5">METRAGEM</th>
                                    <th className="border border-black p-1.5">ATENUAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 12 }).map((_, idx) => {
                                    const item = column2[idx];
                                    return (
                                        <tr key={idx} className="border-b border-black h-8">
                                            <td className="border border-black p-1.5 font-bold text-xs text-center">
                                                {item ? formatFiberName(item.fiber) : ''}
                                            </td>
                                            <td className="border border-black p-1.5 text-center text-xs font-semibold">{item ? item.length : ''}</td>
                                            <td className="border border-black p-1.5 text-center text-xs font-bold">
                                                {item ? formatAttenuation(item.attenuation) : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Coluna 3 */}
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-slate-200 text-black border-b border-black text-xs font-bold">
                                    <th className="border border-black p-1.5">FIBRA</th>
                                    <th className="border border-black p-1.5">METRAGEM</th>
                                    <th className="border border-black p-1.5">ATENUAÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 12 }).map((_, idx) => {
                                    const item = column3[idx];
                                    return (
                                        <tr key={idx} className="border-b border-black h-8">
                                            <td className="border border-black p-1.5 font-bold text-xs text-center">
                                                {item ? formatFiberName(item.fiber) : ''}
                                            </td>
                                            <td className="border border-black p-1.5 text-center text-xs font-semibold">{item ? item.length : ''}</td>
                                            <td className="border border-black p-1.5 text-center text-xs font-bold">
                                                {item ? formatAttenuation(item.attenuation) : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>

                    <div className="text-right text-xs font-bold mt-2 tracking-widest">
                        FIBRACEM
                    </div>

                </div>
            </div>

        </div>
    );
}