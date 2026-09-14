'use client'

import { Input } from '@/components/ui/input';
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DoorOpen, ImagePlus, Trash2, ChevronRight, Ruler as RulerIcon, FileSpreadsheet, FileDown, Loader2, Move, ArrowLeft, Plus, Layers } from 'lucide-react';
import { Tip } from '@/components/ui/tip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Importações para captura e geração de Word
import { toPng } from 'html-to-image';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType, ImageRun, TextRun } from 'docx';
import { saveAs } from 'file-saver';

type Measurement = {
    points: { x: number; y: number }[];
    measure: { inputValue: number }[];
    color: string;
    labelPos?: { x: number; y: number };
};

type CanvasItem = {
    id: string;
    title: string;
    base64: string[];
    baseScale: number[];
    basePos: { x: number; y: number };
    refImage: string | null;
    refScale: number[];
    refPos: { x: number; y: number };
    measurements: Measurement[];
    angleMeasurements: Measurement[];
    activeMeasurementIndex: number;
    activeAngleIndex: number;
};

const Ruler = () => {

    const [partData, setPartData] = useState({
        code: '',
        description: '',
        revision: '',
        status: 'APROVADO' as 'APROVADO' | 'REPROVADO',
    });

    const router = useRouter();

    // Estado principal contendo múltiplos canvas em fila
    const [canvases, setCanvases] = useState<CanvasItem[]>([
        {
            id: 'medidor-1',
            title: 'Medidor 1',
            base64: [],
            baseScale: [100],
            basePos: { x: 360, y: 50 },
            refImage: null,
            refScale: [100],
            refPos: { x: 1020, y: 50 },
            measurements: [],
            angleMeasurements: [],
            activeMeasurementIndex: -1,
            activeAngleIndex: -1,
        }
    ]);

    const [activeCanvasIndex, setActiveCanvasIndex] = useState(0);

    // Mapeamento de referências para os SVGs de cada Canvas para exportação
    const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});

    // Canvas atualmente ativo nas configurações da Sidebar
    const currentCanvas = canvases[activeCanvasIndex] || canvases[0];

    // Estados Globais de Arraste e Visualização
    const [isDraggingBase, setIsDraggingBase] = useState(false);
    const [dragBaseOffset, setDragBaseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [isDraggingRef, setIsDraggingRef] = useState(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const [markWidth, setMarkWidth] = useState<number[]>([5]);
    const [lineWidth, setLineWidth] = useState<number[]>([1]);
    const [fontSize, setFontSize] = useState<number[]>([30]);

    const [draggingIndex, setDraggingIndex] = useState<{ type: 'line' | 'angle', index: number } | null>(null);
    const [draggingPoint, setDraggingPoint] = useState<{ type: 'line' | 'angle', mIndex: number, pIndex: number } | null>(null);

    // Funções utilitárias para atualizar um Canvas específico por índice
    const updateCanvasAtIndex = (index: number, updatedFields: Partial<CanvasItem>) => {
        setCanvases(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], ...updatedFields };
            return copy;
        });
    };

    // Manipulador de mudanças dos inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPartData((prev) => ({ ...prev, [name]: value }));
    };

    const updateCurrentCanvas = (updatedFields: Partial<CanvasItem>) => {
        updateCanvasAtIndex(activeCanvasIndex, updatedFields);
    };

    // Adicionar novo Canvas na vertical
    const handleAddCanvas = () => {
        const newId = `canvas-${Date.now()}`;
        const newCanvas: CanvasItem = {
            id: newId,
            title: `Medidor ${canvases.length + 1}`,
            base64: [],
            baseScale: [100],
            basePos: { x: 360, y: 50 },
            refImage: null,
            refScale: [100],
            refPos: { x: 1020, y: 50 },
            measurements: [],
            angleMeasurements: [],
            activeMeasurementIndex: -1,
            activeAngleIndex: -1,
        };
        setCanvases(prev => [...prev, newCanvas]);
        setActiveCanvasIndex(canvases.length);
    };

    // Remover Canvas
    const handleRemoveCanvas = (indexToRemove: number) => {
        if (canvases.length <= 1) return;
        setCanvases(prev => prev.filter((_, idx) => idx !== indexToRemove));
        if (activeCanvasIndex >= indexToRemove && activeCanvasIndex > 0) {
            setActiveCanvasIndex(activeCanvasIndex - 1);
        }
    };

    // Dropzone - Imagem Principal
    const handleDrop = useCallback(async (files: any) => {
        let array = [] as any;
        try {
            for (let i = 0; i < files.length; i++) {
                const readerPreview = new FileReader();
                readerPreview.readAsDataURL(files[i]);
                readerPreview.onload = (e) => {
                    array.push(e?.target?.result);
                    updateCurrentCanvas({ base64: [...array] });
                };
            }
        } catch (error) {
            console.log(error);
        }
    }, [activeCanvasIndex]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        disabled: isLoading,
        accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [] },
        maxFiles: 1,
    });

    // Dropzone - Imagem de Referência
    const handleDropRef = useCallback((files: any) => {
        if (files && files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => {
                updateCurrentCanvas({ refImage: e?.target?.result as string });
            };
        }
    }, [activeCanvasIndex]);

    const { getRootProps: getRefRootProps, getInputProps: getRefInputProps } = useDropzone({
        onDrop: handleDropRef,
        accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [] },
        maxFiles: 1,
    });

    const handleAddMeasurement = () => {
        if (currentCanvas.base64.length < 1) return;
        const newMeasurements: Measurement[] = [
            ...currentCanvas.measurements,
            { points: [], measure: [], color: '#060cbd' }
        ];
        updateCurrentCanvas({
            measurements: newMeasurements,
            activeMeasurementIndex: newMeasurements.length - 1,
            activeAngleIndex: -1
        });
    };

    const handleAddAngle = () => {
        if (currentCanvas.base64.length < 1) return;
        const newAngles: Measurement[] = [
            ...currentCanvas.angleMeasurements,
            { points: [], measure: [], color: '#eab308' }
        ];
        updateCurrentCanvas({
            angleMeasurements: newAngles,
            activeAngleIndex: newAngles.length - 1,
            activeMeasurementIndex: -1
        });
    };

    const handleDeleteMeasurement = (index: number) => {
        const newArr = [...currentCanvas.measurements];
        newArr.splice(index, 1);
        updateCurrentCanvas({ measurements: newArr, activeMeasurementIndex: -1 });
    };

    const handleDeleteAngle = (index: number) => {
        const newArr = [...currentCanvas.angleMeasurements];
        newArr.splice(index, 1);
        updateCurrentCanvas({ angleMeasurements: newArr, activeAngleIndex: -1 });
    };

    const handleSvgClick = (canvasIdx: number, event: React.MouseEvent<SVGSVGElement>) => {
        if (draggingIndex !== null || draggingPoint !== null || isDraggingRef || isDraggingBase) return;
        const svgEl = svgRefs.current[canvases[canvasIdx].id];
        if (!svgEl) return;
        const svgRect = svgEl.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        const canvasObj = canvases[canvasIdx];

        if (canvasObj.activeMeasurementIndex !== -1) {
            const newMeasures = [...canvasObj.measurements];
            const active = newMeasures[canvasObj.activeMeasurementIndex];
            if (active.points.length < 2) {
                active.points.push({ x, y });
                if (active.points.length === 2) {
                    active.labelPos = { x: (active.points[0].x + active.points[1].x) / 2, y: (active.points[0].y + active.points[1].y) / 2 - 40 };
                    updateCanvasAtIndex(canvasIdx, { measurements: newMeasures, activeMeasurementIndex: -1 });
                } else {
                    updateCanvasAtIndex(canvasIdx, { measurements: newMeasures });
                }
            }
        } else if (canvasObj.activeAngleIndex !== -1) {
            const newAngles = [...canvasObj.angleMeasurements];
            const active = newAngles[canvasObj.activeAngleIndex];
            if (active.points.length < 3) {
                active.points.push({ x, y });
                if (active.points.length === 3) {
                    active.labelPos = { x: active.points[1].x + 30, y: active.points[1].y - 40 };
                    updateCanvasAtIndex(canvasIdx, { angleMeasurements: newAngles, activeAngleIndex: -1 });
                } else {
                    updateCanvasAtIndex(canvasIdx, { angleMeasurements: newAngles });
                }
            }
        }
    };

    const handleMouseMove = (canvasIdx: number, e: React.MouseEvent) => {
        const svgEl = svgRefs.current[canvases[canvasIdx].id];
        if (!svgEl) return;
        const svgRect = svgEl.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        const canvasObj = canvases[canvasIdx];

        if (isDraggingBase && activeCanvasIndex === canvasIdx) {
            updateCanvasAtIndex(canvasIdx, {
                basePos: { x: x - dragBaseOffset.x, y: y - dragBaseOffset.y }
            });
            return;
        }

        if (isDraggingRef && activeCanvasIndex === canvasIdx) {
            updateCanvasAtIndex(canvasIdx, {
                refPos: { x: x - dragOffset.x, y: y - dragOffset.y }
            });
            return;
        }

        if (draggingIndex && activeCanvasIndex === canvasIdx) {
            if (draggingIndex.type === 'line') {
                const newMeasures = [...canvasObj.measurements];
                newMeasures[draggingIndex.index].labelPos = { x, y };
                updateCanvasAtIndex(canvasIdx, { measurements: newMeasures });
            } else {
                const newAngles = [...canvasObj.angleMeasurements];
                newAngles[draggingIndex.index].labelPos = { x, y };
                updateCanvasAtIndex(canvasIdx, { angleMeasurements: newAngles });
            }
        } else if (draggingPoint && activeCanvasIndex === canvasIdx) {
            if (draggingPoint.type === 'line') {
                const newMeasures = [...canvasObj.measurements];
                newMeasures[draggingPoint.mIndex].points[draggingPoint.pIndex] = { x, y };
                updateCanvasAtIndex(canvasIdx, { measurements: newMeasures });
            } else {
                const newAngles = [...canvasObj.angleMeasurements];
                newAngles[draggingPoint.mIndex].points[draggingPoint.pIndex] = { x, y };
                updateCanvasAtIndex(canvasIdx, { angleMeasurements: newAngles });
            }
        }
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
        setDraggingPoint(null);
        setIsDraggingRef(false);
        setIsDraggingBase(false);
    };

    const handleBaseMouseDown = (canvasIdx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const svgEl = svgRefs.current[canvases[canvasIdx].id];
        if (!svgEl) return;
        const svgRect = svgEl.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        setActiveCanvasIndex(canvasIdx);
        setIsDraggingBase(true);
        setDragBaseOffset({
            x: mouseX - canvases[canvasIdx].basePos.x,
            y: mouseY - canvases[canvasIdx].basePos.y
        });
    };

    const handleRefMouseDown = (canvasIdx: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const svgEl = svgRefs.current[canvases[canvasIdx].id];
        if (!svgEl) return;
        const svgRect = svgEl.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        setActiveCanvasIndex(canvasIdx);
        setIsDraggingRef(true);
        setDragOffset({
            x: mouseX - canvases[canvasIdx].refPos.x,
            y: mouseY - canvases[canvasIdx].refPos.y
        });
    };

    // Exportação de todos os Canvas em sequência para o mesmo documento Word
    const handleExportDocx = async () => {
        setIsExporting(true);

        try {
            const isApproved = partData.status === 'APROVADO';

            const docSectionsChildren: any[] = [
                new Paragraph({
                    text: `RELATÓRIO DE INSPEÇÃO DE MEDIÇÕES`,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: "" }),

                // TABELA DE CABEÇALHO COM DADOS DO FORMULÁRIO
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: "Código da Peça:", bold: true })] }),
                                new TableCell({ children: [new Paragraph(partData.code || "N/A")] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: "Descrição da Peça:", bold: true })] }),
                                new TableCell({ children: [new Paragraph(partData.description || "N/A")] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: "Revisão:", bold: true })] }),
                                new TableCell({ children: [new Paragraph(partData.revision || "N/A")] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: "Data / Hora:", bold: true })] }),
                                new TableCell({ children: [new Paragraph(`${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`)] }),
                            ],
                        }),
                        new TableRow({
                            children: [
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: "Status de Aprovação:", bold: true })] }),
                                //@ts-ignore
                                new TableCell({ children: [new Paragraph({ text: partData.status, bold: true })] }),
                            ],
                        }),
                    ],
                }),

                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),
            ];

            // --- RENDERIZAÇÃO DOS CANVASES E MEDIÇÕES ---
            for (let idx = 0; idx < canvases.length; idx++) {
                const c = canvases[idx];
                const svgEl = svgRefs.current[c.id];

                docSectionsChildren.push(
                    new Paragraph({
                        text: `${idx + 1}. Medição`,
                        heading: HeadingLevel.HEADING_2,
                    })
                );

                if (svgEl) {
                    //@ts-ignore
                    const dataUrl = await toPng(svgEl, { backgroundColor: '#ffffff' });
                    const imageBytes = Uint8Array.from(
                        atob(dataUrl.split(',')[1]),
                        char => char.charCodeAt(0)
                    );

                    docSectionsChildren.push(
                        new Paragraph({
                            children: [
                                //@ts-ignore
                                new ImageRun({
                                    data: imageBytes,
                                    transformation: { width: 600, height: 375 },
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })
                    );
                }

                docSectionsChildren.push(new Paragraph({ text: "" }));

                const tableRows = [
                    new TableRow({
                        children: [
                            //@ts-ignore
                            new TableCell({ children: [new Paragraph({ text: "Identificação", bold: true })], width: { size: 30, type: WidthType.PERCENTAGE } }),
                            //@ts-ignore
                            new TableCell({ children: [new Paragraph({ text: "Valor Registrado", bold: true })], width: { size: 40, type: WidthType.PERCENTAGE } }),
                        ],
                    }),
                ];

                c.measurements.forEach((m, mIdx) => {
                    tableRows.push(
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(`Medição ${mIdx + 1}`)] }),
                                new TableCell({ children: [new Paragraph(`${m.measure[0]?.inputValue || 0} mm`)] }),
                            ],
                        })
                    );
                });

                c.angleMeasurements.forEach((a, aIdx) => {
                    tableRows.push(
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(`Ângulo ${aIdx + 1}`)] }),
                                new TableCell({ children: [new Paragraph(`${a.measure[0]?.inputValue || 0}°`)] }),
                            ],
                        })
                    );
                });

                docSectionsChildren.push(
                    new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    })
                );

                docSectionsChildren.push(new Paragraph({ text: "" }));
                docSectionsChildren.push(new Paragraph({ text: "----------------------------------------------------------------------------------------------------" }));
                docSectionsChildren.push(new Paragraph({ text: "" }));
            }

            const doc = new Document({
                sections: [{ properties: {}, children: docSectionsChildren }],
            });

            const buffer = await Packer.toBlob(doc);
            saveAs(buffer, `Relatorio_${partData.code || 'Medicao'}_${Date.now()}.docx`);

        } catch (error) {
            console.error("Erro ao gerar o documento Word:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const renderAngleArc = (
        points: { x: number; y: number }[],
        color: string,
        strokeWidth: number
    ) => {
        if (points.length !== 3) return null;

        const vertex = points[1];
        const start = points[0];
        const end = points[2];
        const startAngle = Math.atan2(start.y - vertex.y, start.x - vertex.x);
        const endAngle = Math.atan2(end.y - vertex.y, end.x - vertex.x);
        const radius = Math.min(
            35,
            Math.hypot(start.x - vertex.x, start.y - vertex.y) / 3,
            Math.hypot(end.x - vertex.x, end.y - vertex.y) / 3
        );
        const startPoint = {
            x: vertex.x + radius * Math.cos(startAngle),
            y: vertex.y + radius * Math.sin(startAngle),
        };
        const endPoint = {
            x: vertex.x + radius * Math.cos(endAngle),
            y: vertex.y + radius * Math.sin(endAngle),
        };
        const sweep = ((endAngle - startAngle + Math.PI * 2) % (Math.PI * 2)) <= Math.PI ? 1 : 0;

        return (
            <path
                d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 ${sweep} ${endPoint.x} ${endPoint.y}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
            />
        );
    };

    return (
        <SidebarProvider>
            <div className='flex min-h-screen w-full bg-background' style={{ userSelect: 'none' }}>

                <Sidebar>
                    <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/')}
                            title="Voltar para a Tela Inicial"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <h3 className='w-full flex justify-center items-center text-lg font-medium'>
                            Medidor
                        </h3>
                    </SidebarHeader>

                    <SidebarContent className="p-4 space-y-6">
                        {/* SELETOR DE CANVAS */}
                        <SidebarGroup>
                            <SidebarGroupLabel className="flex justify-between items-center">
                                <span>Lista de medidores</span>
                                <Button size="sm" variant="ghost" onClick={handleAddCanvas} className="h-6 px-2 text-xs flex gap-1 text-blue-600 hover:text-blue-700">
                                    <Plus size={14} /> Novo
                                </Button>
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="space-y-1 pt-2">
                                {canvases.map((c, idx) => (
                                    <div
                                        key={c.id}
                                        onClick={() => setActiveCanvasIndex(idx)}
                                        className={`flex justify-between items-center p-2 rounded-md cursor-pointer text-sm border transition-all ${activeCanvasIndex === idx
                                            ? 'bg-red-900 border-red-500 font-semibold text-red-300'
                                            : 'hover:bg-accent border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Layers size={16} />
                                            <span>{c.title}</span>
                                        </div>
                                        {canvases.length > 1 && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCanvas(idx);
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE CONFIGURAÇÕES DE ESTILO */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Ajustes de Exibição</SidebarGroupLabel>
                            <SidebarGroupContent className="space-y-4 pt-2">
                                <div className='flex flex-col'>
                                    <span className="text-sm font-medium mb-1">Marca</span>
                                    <Slider value={markWidth} onValueChange={setMarkWidth} min={1} max={10} step={0.1} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-sm font-medium mb-1">Linha</span>
                                    <Slider value={lineWidth} onValueChange={setLineWidth} min={1} max={10} step={0.1} />
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-sm font-medium mb-1">Font</span>
                                    <Slider value={fontSize} onValueChange={setFontSize} min={1} max={100} step={1} />
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE REDIMENSIONAMENTO DE IMAGENS */}
                        {(currentCanvas.base64.length > 0 || currentCanvas.refImage) && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Redimensionamento ({currentCanvas.title})</SidebarGroupLabel>
                                <SidebarGroupContent className="space-y-4 pt-2">
                                    {currentCanvas.base64.length > 0 && (
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-medium mb-1 text-red-600">Resize Medição ({currentCanvas.baseScale[0]}%)</span>
                                            <Slider
                                                value={currentCanvas.baseScale}
                                                onValueChange={(val) => updateCurrentCanvas({ baseScale: val })}
                                                min={10} max={200} step={1}
                                            />
                                        </div>
                                    )}
                                    {currentCanvas.refImage && (
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-medium mb-1 text-blue-600">Resize Ref. ({currentCanvas.refScale[0]}%)</span>
                                            <Slider
                                                value={currentCanvas.refScale}
                                                onValueChange={(val) => updateCurrentCanvas({ refScale: val })}
                                                min={10} max={200} step={1}
                                            />
                                        </div>
                                    )}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}

                        {/* GRUPO DE FERRAMENTAS E AÇÕES */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Ferramentas ({currentCanvas.title})</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-2 pt-2">
                                <Button onClick={handleAddMeasurement} variant="outline" className={`w-full flex gap-2 border-blue-500 text-blue-500 ${currentCanvas.activeMeasurementIndex !== -1 ? 'bg-blue-50' : ''}`}>
                                    <RulerIcon size={20} /> + Medição
                                </Button>

                                <Button onClick={handleAddAngle} variant="outline" className={`w-full flex gap-2 border-red-500 text-red-500 ${currentCanvas.activeAngleIndex !== -1 ? 'bg-red-50' : ''}`}>
                                    <ChevronRight className="rotate-45" size={20} /> + Ângulo
                                </Button>

                                <Button
                                    onClick={handleExportDocx}
                                    disabled={isExporting}
                                    className="w-full flex gap-2 bg-blue-700 hover:bg-green-700 text-white"
                                >
                                    {isExporting ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
                                    Exportar Relatório Geral
                                </Button>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE UPLOADS */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Uploads ({currentCanvas.title})</SidebarGroupLabel>
                            <SidebarGroupContent className="space-y-3 pt-2">
                                <div className='w-full'>
                                    <section className="flex justify-around border-dashed border-2 p-3 border-red-500 rounded-lg shadow-sm hover:shadow-md transition-all">
                                        <div {...getRootProps({ className: 'dropzone' })}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center align-middle items-center cursor-pointer'>
                                                <Tip message='Carregar imagem para medição' content={<ImagePlus size={36} />} />
                                            </div>
                                        </div>
                                        <aside>
                                            <ul className='flex justify-center align-middle items-center'>
                                                {currentCanvas.base64.map((img, index) => (
                                                    <Image className='m-1 aspect-square object-cover rounded hover:scale-150 transition' key={index} src={img} height={38} width={38} alt='uploaded image' />
                                                ))}
                                            </ul>
                                        </aside>
                                    </section>
                                </div>

                                <div className='w-full'>
                                    <section className="flex justify-around border-dashed border-2 p-3 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all">
                                        <div {...getRefRootProps({ className: 'dropzone' })}>
                                            <input {...getRefInputProps()} />
                                            <div className='flex justify-center align-middle items-center cursor-pointer'>
                                                <Tip message='Carregar imagem de referência' content={<FileSpreadsheet size={36} className='text-blue-500' />} />
                                            </div>
                                        </div>
                                        {currentCanvas.refImage && (
                                            <aside>
                                                <Image className='m-1 aspect-square object-cover rounded' src={currentCanvas.refImage} height={38} width={38} alt='reference image' />
                                            </aside>
                                        )}
                                    </section>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE ELEMENTOS ATIVOS */}
                        {(currentCanvas.measurements.length > 0 || currentCanvas.angleMeasurements.length > 0) && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Itens Medidos ({currentCanvas.title})</SidebarGroupLabel>
                                <SidebarGroupContent className="space-y-2 pt-2">
                                    {currentCanvas.measurements.map((m, i) => (
                                        <div key={`l-m-${i}`} className={`flex gap-1 justify-between items-center p-2 border rounded-md ${currentCanvas.activeMeasurementIndex === i ? 'border-blue-500' : 'border-border'}`}>
                                            <span className='text-xs font-bold whitespace-nowrap'>Med {i + 1}:</span>
                                            <input type="color" value={m.color} onChange={(e) => {
                                                const next = [...currentCanvas.measurements];
                                                next[i].color = e.target.value;
                                                updateCurrentCanvas({ measurements: next });
                                            }} className="w-5 h-5 cursor-pointer border-none bg-transparent" />
                                            <Input className='w-16 border h-7 text-xs p-1' type="number" value={m.measure[0]?.inputValue || ''} onChange={(e) => {
                                                const next = [...currentCanvas.measurements];
                                                next[i].measure = [{ inputValue: Number(e.target.value) }];
                                                updateCurrentCanvas({ measurements: next });
                                            }} />
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteMeasurement(i)}><Trash2 size={14} /></Button>
                                        </div>
                                    ))}

                                    {currentCanvas.angleMeasurements.map((a, i) => (
                                        <div key={`l-a-${i}`} className={`flex gap-1 justify-between items-center p-2 border rounded-md ${currentCanvas.activeAngleIndex === i ? 'border-yellow-600' : 'border-yellow-500'}`}>
                                            <span className='text-xs font-bold whitespace-nowrap'>Âng {i + 1}:</span>
                                            <input type="color" value={a.color} onChange={(e) => {
                                                const next = [...currentCanvas.angleMeasurements];
                                                next[i].color = e.target.value;
                                                updateCurrentCanvas({ angleMeasurements: next });
                                            }} className="w-5 h-5 cursor-pointer border-none bg-transparent" />
                                            <Input className='w-16 border h-7 text-xs p-1' type="number" value={a.measure[0]?.inputValue || ''} onChange={(e) => {
                                                const next = [...currentCanvas.angleMeasurements];
                                                next[i].measure = [{ inputValue: Number(e.target.value) }];
                                                updateCurrentCanvas({ angleMeasurements: next });
                                            }} />
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteAngle(i)}><Trash2 size={14} /></Button>
                                        </div>
                                    ))}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>
                </Sidebar>



                {/* ÁREA DE TRABALHO COM CANVAS EM FILA NA VERTICAL */}
                <main className="flex-1 p-6 relative overflow-auto bg-gray-50 flex flex-col items-center gap-8">
                    <div className="w-full flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Informações da Peça
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                {/* Código da Peça */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Código da Peça
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={partData.code}
                                        onChange={handleInputChange}
                                        placeholder="Ex: XX.00000"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Descrição da Peça */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descrição da Peça
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={partData.description}
                                        onChange={handleInputChange}
                                        placeholder="Ex: Suporte forntal"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Revisão */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Revisão
                                    </label>
                                    <input
                                        type="text"
                                        name="revision"
                                        value={partData.revision}
                                        onChange={handleInputChange}
                                        placeholder="Ex: 00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Radio Group - Status de Aprovação */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4 mt-2">
                                <div>
                                    <span className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-0">
                                        Status de Inspeção:
                                    </span>
                                    <div className="flex items-center space-x-6">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="APROVADO"
                                                checked={partData.status === 'APROVADO'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm font-medium text-green-700">Aprovado</span>
                                        </label>

                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="REPROVADO"
                                                checked={partData.status === 'REPROVADO'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm font-medium text-red-700">Reprovado</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {canvases.map((canvasItem, canvasIdx) => {
                        const baseWidth = 600 * (canvasItem.baseScale[0] / 100);
                        const baseHeight = 600 * (canvasItem.baseScale[0] / 100);
                        const refWidth = 600 * (canvasItem.refScale[0] / 100);
                        const refHeight = 600 * (canvasItem.refScale[0] / 100);

                        return (
                            <div
                                key={canvasItem.id}
                                onClick={() => setActiveCanvasIndex(canvasIdx)}
                                className={`w-full flex flex-col gap-2 p-2 rounded-lg transition-all ${activeCanvasIndex === canvasIdx ? 'ring-2 ring-red-500 bg-red-50/20' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center px-2">
                                    <span className="font-semibold text-sm text-gray-700">{canvasItem.title}</span>
                                    {canvases.length > 1 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 flex gap-1 h-7"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveCanvas(canvasIdx);
                                            }}
                                        >
                                            <Trash2 size={14} /> Remover Canvas
                                        </Button>
                                    )}
                                </div>

                                <div className="w-full h-[800px] border bg-white rounded-lg shadow-sm relative overflow-hidden">
                                    <svg
                                        ref={(el) => { svgRefs.current[canvasItem.id] = el; }}
                                        className="w-full h-full cursor-crosshair"
                                        onClick={(e) => handleSvgClick(canvasIdx, e)}
                                        onMouseMove={(e) => handleMouseMove(canvasIdx, e)}
                                        onMouseUp={handleMouseUp}
                                    >
                                        {/* Renderização da Imagem Principal */}
                                        {canvasItem.base64.length > 0 && (
                                            <g>
                                                <image
                                                    href={canvasItem.base64[0]}
                                                    x={canvasItem.basePos.x}
                                                    y={canvasItem.basePos.y}
                                                    width={baseWidth}
                                                    height={baseHeight}
                                                    preserveAspectRatio="none"
                                                />
                                                <rect
                                                    x={canvasItem.basePos.x}
                                                    y={canvasItem.basePos.y}
                                                    width={baseWidth}
                                                    height={baseHeight}
                                                    fill="transparent"
                                                    stroke="rgba(0,0,255,0.2)"
                                                    strokeDasharray="4"
                                                    onMouseDown={(e) => handleBaseMouseDown(canvasIdx, e)}
                                                    className="cursor-move"
                                                />
                                            </g>
                                        )}

                                        {/* Renderização da Imagem de Referência */}
                                        {canvasItem.refImage && (
                                            <g>
                                                <image
                                                    href={canvasItem.refImage}
                                                    x={canvasItem.refPos.x}
                                                    y={canvasItem.refPos.y}
                                                    width={refWidth}
                                                    height={refHeight}
                                                    preserveAspectRatio="none"
                                                />
                                                <rect
                                                    x={canvasItem.refPos.x}
                                                    y={canvasItem.refPos.y}
                                                    width={refWidth}
                                                    height={refHeight}
                                                    fill="transparent"
                                                    stroke="rgba(255,0,0,0.2)"
                                                    strokeDasharray="4"
                                                    onMouseDown={(e) => handleRefMouseDown(canvasIdx, e)}
                                                    className="cursor-move"
                                                />
                                            </g>
                                        )}

                                        {/* Renderização das Medições de Linha */}
                                        {canvasItem.measurements.map((m, mIndex) => (
                                            <g key={`line-${mIndex}`}>
                                                {/* Pontos de controle da linha */}
                                                {m.points.map((p, pIndex) => (
                                                    <circle
                                                        key={`p-${pIndex}`}
                                                        cx={p.x}
                                                        cy={p.y}
                                                        r={markWidth[0]}
                                                        fill="red"
                                                        className="cursor-pointer"
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            setActiveCanvasIndex(canvasIdx);
                                                            setDraggingPoint({ type: 'line', mIndex, pIndex });
                                                        }}
                                                    />
                                                ))}

                                                {m.points.length === 2 && (
                                                    <>
                                                        {/* Linha principal */}
                                                        <line
                                                            x1={m.points[0].x}
                                                            y1={m.points[0].y}
                                                            x2={m.points[1].x}
                                                            y2={m.points[1].y}
                                                            stroke={m.color}
                                                            strokeWidth={lineWidth[0]}
                                                        />

                                                        {m.labelPos && (
                                                            <>
                                                                {/* Linha tracejada indicadora do rótulo */}
                                                                <line
                                                                    x1={(m.points[0].x + m.points[1].x) / 2}
                                                                    y1={(m.points[0].y + m.points[1].y) / 2}
                                                                    x2={m.labelPos.x + 20}
                                                                    y2={m.labelPos.y}
                                                                    stroke={m.color}
                                                                    strokeWidth="4"
                                                                    strokeDasharray="5"
                                                                />

                                                                {/* Grupo do rótulo arrastável com fundo e textos */}
                                                                <g
                                                                    className="cursor-move"
                                                                    onMouseDown={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveCanvasIndex(canvasIdx);
                                                                        setDraggingIndex({ type: 'line', index: mIndex });
                                                                    }}
                                                                >
                                                                    <rect
                                                                        x={m.labelPos.x}
                                                                        y={m.labelPos.y - fontSize[0]}
                                                                        width={fontSize[0] * 5.5}
                                                                        height={fontSize[0] * 1.2}
                                                                        fill="white"
                                                                        rx="4"
                                                                    />
                                                                    <text
                                                                        x={m.labelPos.x - 55}
                                                                        y={m.labelPos.y}
                                                                        fontSize={15}
                                                                        fill="black"
                                                                        fontWeight="bold"
                                                                    >
                                                                        Med {mIndex + 1}
                                                                    </text>
                                                                    <text
                                                                        x={m.labelPos.x}
                                                                        y={m.labelPos.y}
                                                                        fontSize={fontSize[0]}
                                                                        fill={m.color}
                                                                        fontWeight="bold"
                                                                    >
                                                                        : {m.measure[0]?.inputValue || 0} mm
                                                                    </text>
                                                                </g>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </g>
                                        ))}

                                        {/* Renderização das Medições de Ângulo */}
                                        {canvasItem.angleMeasurements.map((a, aIndex) => (
                                            <g key={`angle-${aIndex}`}>
                                                {/* Polyline e arco do ângulo */}
                                                {a.points.length >= 2 && (
                                                    <>
                                                        <polyline
                                                            points={a.points.map((p) => `${p.x},${p.y}`).join(' ')}
                                                            fill="none"
                                                            opacity={0.9}
                                                            stroke={a.color}
                                                            strokeWidth={lineWidth[0]}
                                                        />

                                                        {typeof renderAngleArc === 'function' && renderAngleArc(a.points, a.color, lineWidth[0])}
                                                    </>
                                                )}

                                                {/* Linha tracejada e rótulo quando o ângulo está completo */}
                                                {a.points.length === 3 && a.labelPos && (
                                                    <>
                                                        <line
                                                            x1={a.points[1].x}
                                                            y1={a.points[1].y}
                                                            x2={a.labelPos.x + 10}
                                                            y2={a.labelPos.y - 10}
                                                            stroke={a.color}
                                                            strokeWidth="4"
                                                            strokeDasharray="5,5"
                                                        />
                                                        <g
                                                            className="cursor-move"
                                                            onMouseDown={(e) => {
                                                                e.stopPropagation();
                                                                setActiveCanvasIndex(canvasIdx);
                                                                setDraggingIndex({ type: 'angle', index: aIndex });
                                                            }}
                                                        >
                                                            <rect
                                                                x={a.labelPos.x}
                                                                y={a.labelPos.y - fontSize[0]}
                                                                width={fontSize[0] * 3}
                                                                height={fontSize[0] * 1.2}
                                                                fill="white"
                                                                rx="4"
                                                                stroke={a.color}
                                                            />
                                                            <text
                                                                x={a.labelPos.x - 55}
                                                                y={a.labelPos.y}
                                                                fontSize={15}
                                                                fill="black"
                                                                fontWeight="bold"
                                                            >
                                                                Âng {aIndex + 1}
                                                            </text>
                                                            <text
                                                                x={a.labelPos.x + 5}
                                                                y={a.labelPos.y}
                                                                fontSize={fontSize[0]}
                                                                fill={a.color}
                                                                fontWeight="bold"
                                                            >
                                                                {a.measure[0]?.inputValue || 0}°
                                                            </text>
                                                        </g>
                                                    </>
                                                )}

                                                {/* Pontos de controle do ângulo */}
                                                {a.points.map((p, pIndex) => (
                                                    <circle
                                                        key={`ap-${pIndex}`}
                                                        cx={p.x}
                                                        cy={p.y}
                                                        r={markWidth[0]}
                                                        fill={pIndex === 1 ? 'white' : 'red'}
                                                        stroke={a.color}
                                                        className="cursor-pointer"
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            setActiveCanvasIndex(canvasIdx);
                                                            setDraggingPoint({ type: 'angle', mIndex: aIndex, pIndex });
                                                        }}
                                                    />
                                                ))}
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </main>
            </div>
        </SidebarProvider>
    );
};

export default Ruler;