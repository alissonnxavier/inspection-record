'use client'

import { Input } from '@/components/ui/input';
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { DoorOpen, ImagePlus, Trash2, ChevronRight, Ruler as RulerIcon, FileSpreadsheet, FileDown, Loader2, Move } from 'lucide-react';
import { Tip } from '@/components/ui/tip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

// Importações para captura e geração de Word
import { toPng } from 'html-to-image';
import { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const Ruler = ({ }) => {

    type Measurement = {
        points: { x: number; y: number }[];
        measure: { inputValue: number }[];
        color: string;
        labelPos?: { x: number; y: number };
    };

    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [angleMeasurements, setAngleMeasurements] = useState<Measurement[]>([]);

    const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
    const [activeAngleIndex, setActiveAngleIndex] = useState(-1);

    const [base64, setBase64] = useState<any[]>([]);
    const [baseScale, setBaseScale] = useState<number[]>([100]);

    // Posição e Drag da imagem principal (medidores)
    const [basePos, setBasePos] = useState<{ x: number; y: number }>({ x: 360, y: 50 });
    const [isDraggingBase, setIsDraggingBase] = useState(false);
    const [dragBaseOffset, setDragBaseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [refImage, setRefImage] = useState<string | null>(null);
    const [refScale, setRefScale] = useState<number[]>([100]);

    const [refPos, setRefPos] = useState<{ x: number; y: number }>({ x: 1020, y: 50 });
    const [isDraggingRef, setIsDraggingRef] = useState(false);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const [markWidth, setMarkWidth] = useState<any>([5]);
    const [lineWidth, setLineWidth] = useState<any>([1]);
    const [fontSize, setFontSize] = useState<any>([30]);

    const [draggingIndex, setDraggingIndex] = useState<{ type: 'line' | 'angle', index: number } | null>(null);
    const [draggingPoint, setDraggingPoint] = useState<{ type: 'line' | 'angle', mIndex: number, pIndex: number } | null>(null);

    const baseWidth = 600 * (baseScale[0] / 100);
    const baseHeight = 600 * (baseScale[0] / 100);
    const baseTopRight = { x: basePos.x + baseWidth, y: basePos.y };

    const handleDrop = useCallback(async (files: any) => {
        let array = [] as any;
        try {
            for (let i = 0; i < files.length; i++) {
                const readerPreviwe = new FileReader();
                readerPreviwe.readAsDataURL(files[i]);
                readerPreviwe.onload = (e) => {
                    array.push(e?.target?.result)
                    setBase64([...array]);
                }
            };
        } catch (error) {
            console.log(error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        disabled: isLoading,
        accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [] },
        maxFiles: 1,
    });

    const handleDropRef = useCallback((files: any) => {
        if (files && files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (e) => {
                setRefImage(e?.target?.result as string);
            };
        }
    }, []);

    const { getRootProps: getRefRootProps, getInputProps: getRefInputProps } = useDropzone({
        onDrop: handleDropRef,
        accept: { 'image/jpeg': [], 'image/jpg': [], 'image/png': [] },
        maxFiles: 1,
    });

    const handleAddMeasurement = () => {
        if (base64.length < 1) return;
        const newMeasurements: Measurement[] = [...measurements, { points: [], measure: [], color: '#060cbd' }];
        setMeasurements(newMeasurements);
        setActiveMeasurementIndex(newMeasurements.length - 1);
        setActiveAngleIndex(-1);
    };

    const handleAddAngle = () => {
        if (base64.length < 1) return;
        const newAngles: Measurement[] = [...angleMeasurements, { points: [], measure: [], color: '#eab308' }];
        setAngleMeasurements(newAngles);
        setActiveAngleIndex(newAngles.length - 1);
        setActiveMeasurementIndex(-1);
    };

    const updateAngleByInput = (index: number, val: number) => {
        const newAngles = [...angleMeasurements];
        const item = newAngles[index];

        if (item.points.length === 3) {
            const p1 = item.points[0];
            const p2 = item.points[1];
            const p3 = item.points[2];

            const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
            const diffRad = (val * Math.PI) / 180;
            const angle2 = angle1 + diffRad;

            const dist = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

            item.points[2] = {
                x: p2.x + dist * Math.cos(angle2),
                y: p2.y + dist * Math.sin(angle2)
            };
        }
        item.measure = [{ inputValue: val }];
        setAngleMeasurements(newAngles);
    };

    const renderAngleArc = (points: { x: number; y: number }[], color: string, strokeWidth: any) => {
        if (points.length < 3) return null;
        const p1 = points[0];
        const p2 = points[1];
        const p3 = points[2];
        const radius = 35;

        const ang1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
        const ang2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);

        const startX = p2.x + radius * Math.cos(ang1);
        const startY = p2.y + radius * Math.sin(ang1);
        const endX = p2.x + radius * Math.cos(ang2);
        const endY = p2.y + radius * Math.sin(ang2);

        let diff = ang2 - ang1;
        while (diff < 0) diff += Math.PI * 2;
        const largeArcFlag = diff > Math.PI ? 1 : 0;

        return (
            <path
                d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                fill="red"
                stroke={color}
                strokeWidth={strokeWidth}
                fillOpacity={0.3}
            />
        );
    };

    const handleDeleteMeasurement = (index: number) => {
        const newArr = [...measurements];
        newArr.splice(index, 1);
        setMeasurements(newArr);
        setActiveMeasurementIndex(-1);
    };

    const handleDeleteAngle = (index: number) => {
        const newArr = [...angleMeasurements];
        newArr.splice(index, 1);
        setAngleMeasurements(newArr);
        setActiveAngleIndex(-1);
    };

    const handleSvgClick = (event: any) => {
        if (draggingIndex !== null || draggingPoint !== null || isDraggingRef || isDraggingBase) return;
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        if (activeMeasurementIndex !== -1) {
            const newMeasures = [...measurements];
            const active = newMeasures[activeMeasurementIndex];
            if (active.points.length < 2) {
                active.points.push({ x, y });
                if (active.points.length === 2) {
                    active.labelPos = { x: (active.points[0].x + active.points[1].x) / 2, y: (active.points[0].y + active.points[1].y) / 2 - 40 };
                    setActiveMeasurementIndex(-1);
                }
                setMeasurements(newMeasures);
            }
        }
        else if (activeAngleIndex !== -1) {
            const newAngles = [...angleMeasurements];
            const active = newAngles[activeAngleIndex];
            if (active.points.length < 3) {
                active.points.push({ x, y });
                if (active.points.length === 3) {
                    active.labelPos = { x: active.points[1].x + 30, y: active.points[1].y - 40 };
                    setActiveAngleIndex(-1);
                }
                setAngleMeasurements(newAngles);
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - svgRect.left;
        const y = e.clientY - svgRect.top;

        if (isDraggingBase) {
            setBasePos({
                x: x - dragBaseOffset.x,
                y: y - dragBaseOffset.y
            });
            return;
        }

        if (isDraggingRef) {
            setRefPos({
                x: x - dragOffset.x,
                y: y - dragOffset.y
            });
            return;
        }

        if (draggingIndex) {
            if (draggingIndex.type === 'line') {
                const newMeasures = [...measurements];
                newMeasures[draggingIndex.index].labelPos = { x, y };
                setMeasurements(newMeasures);
            } else {
                const newAngles = [...angleMeasurements];
                newAngles[draggingIndex.index].labelPos = { x, y };
                setAngleMeasurements(newAngles);
            }
        } else if (draggingPoint) {
            if (draggingPoint.type === 'line') {
                const newMeasures = [...measurements];
                newMeasures[draggingPoint.mIndex].points[draggingPoint.pIndex] = { x, y };
                setMeasurements(newMeasures);
            } else {
                const newAngles = [...angleMeasurements];
                newAngles[draggingPoint.mIndex].points[draggingPoint.pIndex] = { x, y };
                setAngleMeasurements(newAngles);
            }
        }
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
        setDraggingPoint(null);
        setIsDraggingRef(false);
        setIsDraggingBase(false);
    };

    const handleBaseMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        setIsDraggingBase(true);
        setDragBaseOffset({
            x: mouseX - basePos.x,
            y: mouseY - basePos.y
        });
    };

    const handleRefMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!svgRef.current) return;
        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        setIsDraggingRef(true);
        setDragOffset({
            x: mouseX - refPos.x,
            y: mouseY - refPos.y
        });
    };

    // FUNÇÃO DE EXPORTAÇÃO PARA WORD (.DOCX)
    const handleExportDocx = async () => {
        if (!svgRef.current) return;
        setIsExporting(true);

        try {
            //@ts-ignore
            const dataUrl = await toPng(svgRef.current, { backgroundColor: '#ffffff' });

            const imageBytes = Uint8Array.from(
                atob(dataUrl.split(',')[1]),
                c => c.charCodeAt(0)
            );

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

            measurements.forEach((m, idx) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(`Medição ${idx + 1}`)] }),
                            new TableCell({ children: [new Paragraph(`${m.measure[0]?.inputValue || 0} mm`)] }),
                        ],
                    })
                );
            });

            angleMeasurements.forEach((a, idx) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(`Ângulo ${idx + 1}`)] }),
                            new TableCell({ children: [new Paragraph(`${a.measure[0]?.inputValue || 0}°`)] }),
                        ],
                    })
                );
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "Relatório de Medição",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                            text: `Data: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: "" }),

                        new Paragraph({
                            text: "1. Visual da Medição",
                            heading: HeadingLevel.HEADING_2,
                        }),
                        //@ts-ignore
                        new Paragraph({
                            children: [
                                //@ts-ignore
                                new ImageRun({
                                    data: imageBytes,
                                    transformation: {
                                        width: 600,
                                        height: 375,
                                    },
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: "" }),

                        new Paragraph({
                            text: "2. Tabela de Valores Medidos",
                            heading: HeadingLevel.HEADING_2,
                        }),
                        new Table({
                            rows: tableRows,
                            width: { size: 100, type: WidthType.PERCENTAGE },
                        }),
                    ],
                }],
            });

            const buffer = await Packer.toBlob(doc);
            saveAs(buffer, `Relatorio_Medicao_${Date.now()}.docx`);

        } catch (error) {
            console.error("Erro ao gerar o documento Word:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const refWidth = 600 * (refScale[0] / 100);
    const refHeight = 600 * (refScale[0] / 100);

    return (
        <SidebarProvider>
            <div className='flex min-h-screen w-full bg-background' style={{ userSelect: 'none' }}>
                <Sidebar>
                    <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b">
                        <Link href='/'>
                            <DoorOpen size={40} />
                        </Link>
                        <h3 className='text-lg font-medium'>
                            Medidor
                        </h3>
                    </SidebarHeader>

                    <SidebarContent className="p-4 space-y-6">
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
                        {(base64.length > 0 || refImage) && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Redimensionamento</SidebarGroupLabel>
                                <SidebarGroupContent className="space-y-4 pt-2">
                                    {base64.length > 0 && (
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-medium mb-1 text-red-600">Resize Medição ({baseScale[0]}%)</span>
                                            <Slider value={baseScale} onValueChange={setBaseScale} min={10} max={200} step={1} />
                                        </div>
                                    )}
                                    {refImage && (
                                        <div className='flex flex-col'>
                                            <span className="text-sm font-medium mb-1 text-blue-600">Resize Ref. ({refScale[0]}%)</span>
                                            <Slider value={refScale} onValueChange={setRefScale} min={10} max={200} step={1} />
                                        </div>
                                    )}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}

                        {/* GRUPO DE FERRAMENTAS E AÇÕES */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
                            <SidebarGroupContent className="flex flex-col gap-2 pt-2">
                                <Button onClick={handleAddMeasurement} variant="outline" className={`w-full flex gap-2 border-blue-500 text-blue-500 ${activeMeasurementIndex !== -1 ? 'bg-blue-50' : ''}`}>
                                    <RulerIcon size={20} /> + Medição
                                </Button>

                                <Button onClick={handleAddAngle} variant="outline" className={`w-full flex gap-2 border-red-500 text-red-500 ${activeAngleIndex !== -1 ? 'bg-red-50' : ''}`}>
                                    <ChevronRight className="rotate-45" size={20} /> + Ângulo
                                </Button>

                                <Button
                                    onClick={handleExportDocx}
                                    disabled={isExporting || base64.length === 0}
                                    className="w-full flex gap-2 bg-blue-700 hover:bg-green-700 text-white"
                                >
                                    {isExporting ? <Loader2 className="animate-spin" size={20} /> : <FileDown size={20} />}
                                    Exportar Relatório
                                </Button>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE UPLOADS */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Uploads</SidebarGroupLabel>
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
                                                {base64.map((img, index) => (
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
                                        {refImage && (
                                            <aside>
                                                <Image className='m-1 aspect-square object-cover rounded' src={refImage} height={38} width={38} alt='reference image' />
                                            </aside>
                                        )}
                                    </section>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* GRUPO DE ELEMENTOS ATIVOS (MEDIÇÕES E ÂNGULOS) */}
                        {(measurements.length > 0 || angleMeasurements.length > 0) && (
                            <SidebarGroup>
                                <SidebarGroupLabel>Itens Medidos</SidebarGroupLabel>
                                <SidebarGroupContent className="space-y-2 pt-2">
                                    {measurements.map((m, i) => (
                                        <div key={`l-m-${i}`} className={`flex gap-1 justify-between items-center p-2 border rounded-md ${activeMeasurementIndex === i ? 'border-blue-500' : 'border-border'}`}>
                                            <span className='text-xs font-bold whitespace-nowrap'>Med {i + 1}:</span>
                                            <input type="color" value={m.color} onChange={(e) => {
                                                const next = [...measurements];
                                                next[i].color = e.target.value;
                                                setMeasurements(next);
                                            }} className="w-5 h-5 cursor-pointer border-none bg-transparent" />
                                            <Input className='w-16 border h-7 text-xs p-1' type="number" value={m.measure[0]?.inputValue || ''} onChange={(e) => {
                                                const next = [...measurements];
                                                next[i].measure = [{ inputValue: Number(e.target.value) }];
                                                setMeasurements(next);
                                            }} />
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteMeasurement(i)}><Trash2 size={14} /></Button>
                                        </div>
                                    ))}

                                    {angleMeasurements.map((a, i) => (
                                        <div key={`l-a-${i}`} className={`flex gap-1 justify-between items-center p-2 border rounded-md ${activeAngleIndex === i ? 'border-yellow-600' : 'border-yellow-500'}`}>
                                            <span className='text-xs font-bold whitespace-nowrap'>Âng {i + 1}:</span>
                                            <input type="color" value={a.color} onChange={(e) => {
                                                const next = [...angleMeasurements];
                                                next[i].color = e.target.value;
                                                setAngleMeasurements(next);
                                            }} className="w-5 h-5 cursor-pointer border-none bg-transparent" />
                                            <Input
                                                className='w-16 border h-7 text-xs p-1 border-yellow-300'
                                                type="number"
                                                placeholder="°"
                                                value={a.measure[0]?.inputValue || ''}
                                                onChange={(e) => updateAngleByInput(i, Number(e.target.value))}
                                            />
                                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleDeleteAngle(i)}><Trash2 size={14} /></Button>
                                        </div>
                                    ))}
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}
                    </SidebarContent>

                    <SidebarFooter className="p-4 border-t text-xs text-muted-foreground text-center">
                        Controles do Medidor
                    </SidebarFooter>
                </Sidebar>

                <main className='flex-1 flex flex-col items-center justify-start overflow-hidden relative'>
                    <div className="absolute top-4 left-4 z-10">
                        <SidebarTrigger />
                    </div>

                    <div className='w-full overflow-auto flex-grow flex justify-center p-4'>
                        <svg ref={svgRef} width="1920" height="1200" style={{ minWidth: '1280px', cursor: (activeMeasurementIndex !== -1 || activeAngleIndex !== -1) ? 'crosshair' : 'default' }} onClick={handleSvgClick} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                            <defs>
                                {[...measurements, ...angleMeasurements].map((m, i) => (
                                    <marker key={`arr-${i}`} id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                                        <polygon points="0 0, 4 3.5, 0 7" fill={m.color} />
                                    </marker>
                                ))}
                            </defs>

                            {/* IMAGEM A SER MEDIDA */}
                            {base64.length > 0 && (
                                <g>
                                    {!isExporting && (
                                        <>
                                            <rect
                                                x={basePos.x - 2}
                                                y={basePos.y - 2}
                                                width={baseWidth + 4}
                                                height={baseHeight + 4}
                                                fill="none"
                                                stroke="#dc2626"
                                                strokeWidth="2"
                                                strokeDasharray="4"
                                                rx="4"
                                                pointerEvents="none"
                                            />
                                            <g
                                                transform={`translate(${basePos.x + baseWidth / 2 - 12}, ${basePos.y - 28})`}
                                                onMouseDown={handleBaseMouseDown}
                                                style={{ cursor: 'grab' }}
                                            >
                                                <rect width="24" height="24" rx="12" fill="#dc2626" />
                                                <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" />
                                            </g>
                                        </>
                                    )}

                                    {base64.map((img, index) => (
                                        <image
                                            key={index}
                                            href={img}
                                            x={basePos.x}
                                            y={basePos.y}
                                            width={baseWidth}
                                            height={baseHeight}
                                        />
                                    ))}
                                </g>
                            )}

                            {/* CONEXÃO E IMAGEM DE REFERÊNCIA MOVEL */}
                            {refImage && (
                                <g>
                                    {!isExporting && (
                                        <>
                                            <line
                                                x1={baseTopRight.x}
                                                y1={baseTopRight.y}
                                                x2={refPos.x}
                                                y2={refPos.y}
                                                stroke="#2563eb"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                            <circle cx={baseTopRight.x} cy={baseTopRight.y} r={5} fill="#2563eb" />

                                            <rect
                                                x={refPos.x - 2}
                                                y={refPos.y - 2}
                                                width={refWidth + 4}
                                                height={refHeight + 4}
                                                fill="none"
                                                stroke="#2563eb"
                                                strokeWidth="2"
                                                strokeDasharray="4"
                                                rx="4"
                                            />

                                            <g
                                                transform={`translate(${refPos.x + refWidth / 2 - 12}, ${refPos.y - 28})`}
                                                onMouseDown={handleRefMouseDown}
                                                style={{ cursor: 'grab' }}
                                            >
                                                <rect width="24" height="24" rx="12" fill="#2563eb" />
                                                <path d="M12 6v12M6 12h12" stroke="white" strokeWidth="2" />
                                            </g>
                                        </>
                                    )}

                                    <image
                                        href={refImage}
                                        x={refPos.x}
                                        y={refPos.y}
                                        width={refWidth}
                                        height={refHeight}
                                    />
                                </g>
                            )}

                            {/* DESENHO RÉGUAS */}
                            {measurements.map((m, i) => (
                                <React.Fragment key={`svg-m-${i}`}>
                                    {m.points.length >= 1 && m.points.map((p, pi) => (
                                        <circle key={pi} cx={p.x} cy={p.y} r={markWidth} fill="red" cursor="move" onMouseDown={(e) => { e.stopPropagation(); setDraggingPoint({ type: 'line', mIndex: i, pIndex: pi }); }} />
                                    ))}
                                    {m.points.length === 2 && m.labelPos && (
                                        <>
                                            <line x1={m.points[0].x} y1={m.points[0].y} x2={m.points[1].x} y2={m.points[1].y} stroke={m.color} strokeWidth={lineWidth} />
                                            <line x1={(m.points[0].x + m.points[1].x) / 2} y1={(m.points[0].y + m.points[1].y) / 2} x2={m.labelPos.x + 20} y2={m.labelPos.y} stroke={m.color} strokeWidth="4" strokeDasharray="5" />
                                            <g onMouseDown={() => setDraggingIndex({ type: 'line', index: i })} style={{ cursor: 'move' }}>
                                                <rect x={m.labelPos.x} y={m.labelPos.y - fontSize} width={fontSize * 8} height={fontSize * 1.2} fill="white" rx="4" />
                                                <text x={m.labelPos.x + 10} y={m.labelPos.y - (fontSize * 0.2)} fontSize={fontSize} fill={m.color} fontWeight="bold">
                                                    <tspan fill="black" fontSize={fontSize * 0.45}>{`Med ${i + 1}: `}</tspan>
                                                    {m.measure[0]?.inputValue ? `${m.measure[0]?.inputValue}mm` : ''}
                                                </text>
                                            </g>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}

                            {/* DESENHO ÂNGULOS */}
                            {angleMeasurements.map((a, i) => (
                                <React.Fragment key={`svg-a-${i}`}>
                                    {a.points.length >= 1 && a.points.map((p, pi) => (
                                        <circle key={pi} cx={p.x} cy={p.y} r={markWidth} fill="orange" cursor="move" onMouseDown={(e) => { e.stopPropagation(); setDraggingPoint({ type: 'angle', mIndex: i, pIndex: pi }); }} />
                                    ))}
                                    {a.points.length >= 2 && (
                                        <line x1={a.points[0].x} y1={a.points[0].y} x2={a.points[1].x} y2={a.points[1].y} stroke={a.color} strokeWidth={lineWidth} />
                                    )}
                                    {a.points.length === 3 && (
                                        <>
                                            <line x1={a.points[1].x} y1={a.points[1].y} x2={a.points[2].x} y2={a.points[2].y} stroke={a.color} strokeWidth={lineWidth} />
                                            {renderAngleArc(a.points, a.color, lineWidth)}
                                            {a.labelPos && (
                                                <g onMouseDown={() => setDraggingIndex({ type: 'angle', index: i })} style={{ cursor: 'move' }}>
                                                    <rect x={a.labelPos.x} y={a.labelPos.y - fontSize} width={fontSize * 7} height={fontSize * 1.2} fill="white" rx="4" />
                                                    <text x={a.labelPos.x + 10} y={a.labelPos.y - (fontSize * 0.2)} fontSize={fontSize} fill={a.color} fontWeight="bold">
                                                        <tspan fill="black" fontSize={fontSize * 0.45}>{`Âng ${i + 1}: `}</tspan>
                                                        {a.measure[0]?.inputValue ? `${a.measure[0]?.inputValue}°` : ''}
                                                    </text>
                                                </g>
                                            )}
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </svg>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default Ruler;