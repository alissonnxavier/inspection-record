'use client'

import { Input } from '@/components/ui/input';
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { DoorOpen, ImagePlus, Trash2, ChevronRight, Ruler as RulerIcon } from 'lucide-react'; // Importei RulerIcon para o botão
import { Tip } from '@/components/ui/tip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';

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
    const [isLoading, setIsLoading] = useState(false);
    const [compressedImages, setCompressedImages] = useState([]);
    const svgRef = useRef<SVGSVGElement>(null);
    const [markWidth, setMarkWidth] = useState<any>([5]);
    const [lineWidth, setLineWidth] = useState<any>([1]);
    const [fontSize, setFontSize] = useState<any>([30]);

    const [draggingIndex, setDraggingIndex] = useState<{ type: 'line' | 'angle', index: number } | null>(null);
    const [draggingPoint, setDraggingPoint] = useState<{ type: 'line' | 'angle', mIndex: number, pIndex: number } | null>(null);

    const handleDrop = useCallback(async (files: any) => {
        let array = [] as any;
        let compressedImages = [] as any;
        try {
            for (let i = 0; i < files.length; i++) {
                const readerPreviwe = new FileReader();
                readerPreviwe.readAsDataURL(files[i]);
                readerPreviwe.onload = (e) => {
                    array.push(e?.target?.result)
                    setBase64([...array]);
                }
            };
            for (let i = 0; i < files.length; i++) {
                new Compressor(files[i], {
                    quality: 0.4,
                    success: async (compressedFile) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedFile);
                        reader.onload = async (e) => {
                            compressedImages.push(e?.target?.result)
                            setCompressedImages(compressedImages);
                        }
                    },
                });
            }
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

    // NOVA FUNÇÃO DE ADICIONAR MEDIÇÃO (Agora via botão)
    const handleAddMeasurement = () => {
        if (base64.length < 1) return; // Opcional: só permite se houver imagem
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
        if (draggingIndex !== null || draggingPoint !== null) return;
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
                    setActiveMeasurementIndex(-1); // Finaliza a edição após o 2º ponto
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
                    setActiveAngleIndex(-1); // Finaliza a edição após o 3º ponto
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
    };

    return (
        <div
            className='w-full min-h-screen bg-background flex flex-col items-center'
            style={{ userSelect: 'none' }}
        >
            <div className='w-full flex flex-col sm:flex-row justify-between items-center p-4 gap-4'>
                <Link href='/' className="sm:ml-4 lg:ml-10">
                    <DoorOpen size={50} />
                </Link>
                <h3 className='text-center text-lg md:text-xl font-medium sm:mr-4 lg:mr-28'>
                    Medidor
                </h3>
                <div className='hidden sm:block'></div>
            </div>

            <div className='flex flex-wrap w-full justify-center items-center gap-4 p-4'>
                <div className='flex flex-col items-center min-w-[150px] w-full sm:w-auto'>
                    <span className="text-sm font-medium mb-2">Marca</span>
                    <Slider value={markWidth} onValueChange={setMarkWidth} min={1} max={10} step={0.1} className="w-full max-w-[200px]" />
                </div>
                <div className='flex flex-col items-center min-w-[150px] w-full sm:w-auto'>
                    <span className="text-sm font-medium mb-2">Linha</span>
                    <Slider value={lineWidth} onValueChange={setLineWidth} min={1} max={10} step={0.1} className="w-full max-w-[200px]" />
                </div>
                <div className='flex flex-col items-center min-w-[150px] w-full sm:w-auto'>
                    <span className="text-sm font-medium mb-2">Font</span>
                    <Slider value={fontSize} onValueChange={setFontSize} min={1} max={100} step={1} className="w-full max-w-[200px]" />
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className='flex flex-wrap justify-center items-center w-full sm:w-auto gap-2'>
                    <Button onClick={handleAddMeasurement} variant="outline" className={`flex gap-2 border-blue-500 text-blue-500 ${activeMeasurementIndex !== -1 ? 'bg-blue-50' : ''}`}>
                        <RulerIcon size={20} /> + Medição
                    </Button>

                    <Button onClick={handleAddAngle} variant="outline" className={`flex gap-2 border-red-500 text-red-500 ${activeAngleIndex !== -1 ? 'bg-red-50' : ''}`}>
                        <ChevronRight className="rotate-45" size={20} /> + Ângulo
                    </Button>

                    <div className='w-full max-w-[20rem]'>
                        <section className="flex justify-around border-dashed border-2 p-3 border-red-500 rounded-lg shadow-lg shadow-red-900/50 hover:shadow-md hover:shadow-red-300/50">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <div className='flex justify-center align-middle items-center'>
                                    <Tip message='Carregar imagem' content={<ImagePlus size={46} />} />
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
                </div>
            </div>

            {/* LISTA DE MEDIÇÕES E ÂNGULOS */}
            <div className='flex flex-wrap m-auto justify-center items-center gap-2'>
                {measurements.map((m, i) => (
                    <div key={`l-m-${i}`} className={`flex gap-1 justify-center items-center m-1 p-2 border rounded-md ${activeMeasurementIndex === i ? 'border-blue-500 ' : 'border-spacing-2'}`}>
                        <span className='text-xs font-bold'>Med {i + 1}:</span>
                        <input type="color" value={m.color} onChange={(e) => {
                            const next = [...measurements];
                            next[i].color = e.target.value;
                            setMeasurements(next);
                        }} className="w-6 h-6 cursor-pointer border-none bg-transparent" />
                        <Input className='w-20 border h-8' type="number" value={m.measure[0]?.inputValue || ''} onChange={(e) => {
                            const next = [...measurements];
                            next[i].measure = [{ inputValue: Number(e.target.value) }];
                            setMeasurements(next);
                        }} />
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteMeasurement(i)}><Trash2 size={16} /></Button>
                    </div>
                ))}

                {angleMeasurements.map((a, i) => (
                    <div key={`l-a-${i}`} className={`flex gap-1 justify-center items-center m-1 p-2 border rounded-md ${activeAngleIndex === i ? 'border-yellow-600 ' : 'border-yellow-500'}`}>
                        <span className='text-xs font-bold'>Âng {i + 1}:</span>
                        <input type="color" value={a.color} onChange={(e) => {
                            const next = [...angleMeasurements];
                            next[i].color = e.target.value;
                            setAngleMeasurements(next);
                        }} className="w-6 h-6 cursor-pointer border-none bg-transparent" />
                        <Input
                            className='w-20 border h-8 border-yellow-300'
                            type="number"
                            placeholder="°"
                            value={a.measure[0]?.inputValue || ''}
                            onChange={(e) => updateAngleByInput(i, Number(e.target.value))}
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAngle(i)}><Trash2 size={16} /></Button>
                    </div>
                ))}
            </div>

            <div className='w-full overflow-auto flex-grow flex justify-center p-4'>
                <svg ref={svgRef} width="1280" height="1200" style={{ minWidth: '1280px', cursor: (activeMeasurementIndex !== -1 || activeAngleIndex !== -1) ? 'crosshair' : 'default' }} onClick={handleSvgClick} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <defs>
                        {[...measurements, ...angleMeasurements].map((m, i) => (
                            <marker key={`arr-${i}`} id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                                <polygon points="0 0, 4 3.5, 0 7" fill={m.color} />
                            </marker>
                        ))}
                    </defs>

                    {base64.map((img, index) => (
                        <image key={index} href={img} x={index < 2 ? index * 602 : (index - 2) * 600} y={index < 2 ? 0 : 602} width={1280} height={600} />
                    ))}

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
                                        <rect x={m.labelPos.x} y={m.labelPos.y - fontSize} width={fontSize * 5} height={fontSize * 1.2} fill="white" rx="4" />
                                        <text x={m.labelPos.x - 55} y={m.labelPos.y} fontSize={15} fill="black" fontWeight="bold">Med {i + 1}</text>
                                        <text x={m.labelPos.x} y={m.labelPos.y} fontSize={fontSize} fill={m.color} fontWeight="bold">: {m.measure[0]?.inputValue || 0} mm</text>
                                    </g>
                                </>
                            )}
                        </React.Fragment>
                    ))}

                    {/* DESENHO ÂNGULOS */}
                    {angleMeasurements.map((m, i) => (
                        <React.Fragment key={`svg-a-${i}`}>
                            {m.points.length >= 2 && (
                                <>
                                    <polyline points={m.points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" opacity={0.9} stroke={m.color} strokeWidth={lineWidth} />
                                    {renderAngleArc(m.points, m.color, lineWidth)}
                                    {m.points.length === 3 && m.labelPos && (
                                        <>
                                            <line x1={m.points[1].x} y1={m.points[1].y} x2={m.labelPos.x + 10} y2={m.labelPos.y - 10} stroke={m.color} strokeWidth="4" strokeDasharray="5,5" />
                                            <g onMouseDown={() => setDraggingIndex({ type: 'angle', index: i })} style={{ cursor: 'move' }}>
                                                <rect x={m.labelPos.x} y={m.labelPos.y - fontSize} width={fontSize * 4} height={fontSize * 1.2} fill="white" rx="4" stroke={m.color} />
                                                <text x={m.labelPos.x - 55} y={m.labelPos.y} fontSize={15} fill="black" fontWeight="bold">Âng {i + 1}</text>
                                                <text x={m.labelPos.x + 5} y={m.labelPos.y} fontSize={fontSize} fill={m.color} fontWeight="bold">{m.measure[0]?.inputValue || 0}°</text>
                                            </g>
                                        </>
                                    )}
                                </>
                            )}
                            {m.points.map((p, pi) => (
                                <circle key={pi} cx={p.x} cy={p.y} r={markWidth} fill={pi === 1 ? "white" : "red"} stroke={m.color} cursor="move" onMouseDown={(e) => { e.stopPropagation(); setDraggingPoint({ type: 'angle', mIndex: i, pIndex: pi }); }} />
                            ))}
                        </React.Fragment>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default Ruler;