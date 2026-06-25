'use client';

import React, { useState, useRef, MouseEvent, PointerEvent, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Trash2, DoorOpen, ZoomIn, Move, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';

export default function MedidorInterativo() {
    const [image, setImage] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(2);
    const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 }); // Percentual (0-100) dentro da imagem
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Estados para o Componente Móvel (Posicionamento em pixels na tela)
    const [panelPos, setPanelPos] = useState({ x: 100, y: 250 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Coordenadas absolutas na tela para desenhar a linha (Stripe) do SVG
    const [stripeCoords, setStripeCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
    const [lineWidth, setLineWidth] = useState<number>(4); // Espessura da linha do SVG
    const [stripeColor, setStripeColor] = useState<string>('#6366f1'); // Cor customizável da linha

    const imageRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null); // Referência da mira alvo
    const panelRef = useRef<HTMLDivElement>(null); // Referência da caixa inteira do painel móvel

    // Configuração do Dropzone para Upload
    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImage(objectUrl);
            setPanelPos({ x: window.innerWidth / 2 + 250, y: window.innerHeight / 2 - 100 });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    const handleRemoveImage = () => {
        setImage(null);
        setIsHovering(false);
        setStripeCoords(null);
    };

    // Gerencia o movimento do mouse sobre a imagem
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();

        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        setPointerPos({ x: clampedX, y: clampedY });
        setZoomPos({ x: clampedX, y: clampedY });
    };

    // Lógica de arrastar o Painel de Zoom (Móvel)
    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX - panelPos.x,
            y: e.clientY - panelPos.y
        };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        setPanelPos({ x: newX, y: newY });
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // Conexão dinâmica lateral e centralização fixa baseada na resposta anterior
    useEffect(() => {
        if (isHovering && targetRef.current && panelRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect();
            const panelRect = panelRef.current.getBoundingClientRect();

            const targetCenterX = targetRect.left + targetRect.width / 2 + window.scrollX;
            const targetCenterY = targetRect.top + targetRect.height / 2 + window.scrollY;
            const panelCenterY = panelRect.top + panelRect.height / 2 + window.scrollY;

            const isTargetLeftOfPanel = targetCenterX < panelRect.left + window.scrollX;
            const anchorX = isTargetLeftOfPanel
                ? panelRect.left + window.scrollX
                : panelRect.right + window.scrollX;

            setStripeCoords({
                x1: targetCenterX,
                y1: targetCenterY,
                x2: anchorX,
                y2: panelCenterY,
            });
        } else {
            setStripeCoords(null);
        }
    }, [pointerPos, panelPos, isHovering]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-6 flex flex-col justify-between relative overflow-hidden select-none">

            {/* SVG Overlay dinâmico com a cor selecionada */}
            {stripeCoords && (
                <svg className="absolute inset-0 pointer-events-none w-full h-full z-40">
                    {/* Brilho neon inferior acompanhando a cor do estado */}
                    <line
                        x1={stripeCoords.x1}
                        y1={stripeCoords.y1}
                        x2={stripeCoords.x2}
                        y2={stripeCoords.y2}
                        stroke={stripeColor}
                        strokeWidth={lineWidth + 3}
                        className="opacity-20 blur-sm"
                    />
                    {/* Linha pontilhada principal */}
                    <line
                        x1={stripeCoords.x1}
                        y1={stripeCoords.y1}
                        x2={stripeCoords.x2}
                        y2={stripeCoords.y2}
                        stroke={stripeColor}
                        strokeWidth={lineWidth}
                        strokeDasharray="4 4"
                        className="animate-[dash_20s_linear_infinite]"
                    />
                </svg>
            )}

            {/* Header */}
            <header className="flex items-center justify-between border-b border-slate-800 pb-4 z-10">
                <Link href='/' className="sm:ml-4 lg:ml-10 flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors duration-200 ">
                    <DoorOpen size={50} /> Sair
                </Link>
            </header>

            {/* Conteúdo Centralizado */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6 my-4 w-full max-w-5xl mx-auto z-10">

                {/* Painéis de Controle Superiores */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">

                    {/* Painel 1: Zoom */}
                    <div className="w-full max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-slate-400">Nível do Zoom</span>
                            <span className="text-indigo-400 font-bold">{zoomLevel.toFixed(1)}x</span>
                        </div>
                        <Slider
                            value={[zoomLevel]}
                            onValueChange={(value) => setZoomLevel(value[0])}
                            min={1.5}
                            max={5}
                            step={0.1}
                            className="py-2"
                        />
                        {image && (
                            <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center mt-1">
                                <div className="text-[11px] text-slate-400 font-mono">
                                    {pointerPos.x.toFixed(0)}%, {pointerPos.y.toFixed(0)}%
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleRemoveImage}
                                    className="gap-1.5 h-7 text-xs px-2"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Remover
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Painel 2: Espessura + NOVO Seletor de Cor */}
                    <div className="w-full max-w-xs bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-slate-400">Espessura da linha</span>
                            <span className="text-indigo-400 font-bold">{lineWidth}px</span>
                        </div>
                        <Slider
                            value={[lineWidth]}
                            onValueChange={(value) => setLineWidth(value[0])}
                            min={1}
                            max={10}
                            step={1}
                            className="py-2"
                        />

                        {/* Integração do Seletor de Cor */}
                        <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                <Palette className="w-3.5 h-3.5" style={{ color: stripeColor }} />
                                <span>Cor da Linha</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase">{stripeColor}</span>
                                <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-700 hover:border-slate-500 cursor-pointer transition-colors">
                                    <input
                                        type="color"
                                        value={stripeColor}
                                        onChange={(e) => setStripeColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div
                                        className="w-full h-full rounded-md transition-transform active:scale-95"
                                        style={{ backgroundColor: stripeColor }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Workspace Central */}
                <div className="w-full flex justify-center items-center min-h-[450px]">
                    {!image ? (
                        <div
                            {...getRootProps()}
                            className={`w-full max-w-2xl flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 min-h-[350px]
                                ${isDragActive ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'}`}
                        >
                            <input {...getInputProps()} />
                            <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                                <ImagePlus className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-base font-medium">Arraste uma imagem ou clique para selecionar</p>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center items-center">

                            {/* Imagem Original Interativa */}
                            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-center relative max-w-xl w-full">
                                <div
                                    ref={imageRef}
                                    onMouseMove={handleMouseMove}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                    className="relative overflow-hidden cursor-none max-w-full max-h-[450px]"
                                >
                                    <img
                                        src={image}
                                        alt="Original"
                                        className="w-full h-auto object-contain max-h-[450px] rounded"
                                        draggable={false}
                                    />

                                    {/* Super Mira Alvo Customizada (Acompanha a cor escolhida) */}
                                    {isHovering && (
                                        <div
                                            ref={targetRef}
                                            className="absolute w-12 h-12 border border-dashed rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-slate-950/20 shadow-lg z-50"
                                            style={{
                                                left: `${pointerPos.x}%`,
                                                top: `${pointerPos.y}%`,
                                                borderColor: stripeColor,
                                            }}
                                        >
                                            <div className="absolute w-full h-[1px] opacity-40" style={{ backgroundColor: stripeColor }} />
                                            <div className="absolute h-full w-[1px] opacity-40" style={{ backgroundColor: stripeColor }} />
                                            <div className="w-4 h-4 border-2 rounded-full bg-slate-950 flex items-center justify-center" style={{ borderColor: stripeColor }}>
                                                <div className="w-1.5 h-1.5 rounded-full animate-ping absolute" style={{ backgroundColor: stripeColor }} />
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stripeColor }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* COMPONENTE MÓVEL: Quadro de Zoom Flutuante */}
                            <div
                                ref={panelRef}
                                style={{
                                    position: 'fixed',
                                    left: `${panelPos.x}px`,
                                    top: `${panelPos.y}px`,
                                }}
                                className={`w-[280px] bg-slate-900/95 backdrop-blur-md border rounded-xl p-3 flex flex-col shadow-2xl z-50 transition-shadow duration-200
                                    ${isDragging ? 'border-indigo-500 shadow-indigo-500/10 cursor-grabbing' : 'border-slate-700/80 shadow-black'}`}
                            >
                                {/* Barra de Arraste Superior */}
                                <div
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-200 select-none"
                                >
                                    <Move className="w-3.5 h-3.5 pointer-events-none" style={{ color: stripeColor }} />
                                    <span className="text-xs font-medium pointer-events-none flex-1">Lupa</span>
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: stripeColor }} />
                                </div>

                                {/* Container de Amostragem do Zoom Centralizado Perfect */}
                                <div className="w-full aspect-square bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative flex items-center justify-center">
                                    {isHovering ? (
                                        <div
                                            className="w-full h-full pointer-events-none"
                                            style={{
                                                backgroundImage: `url(${image})`,
                                                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                                backgroundSize: `${zoomLevel * 100}%`,
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                        />
                                    ) : (
                                        <div className="text-[11px] text-slate-500 text-center px-4">
                                            Inspecione a imagem
                                        </div>
                                    )}

                                    {/* Retícula de centralização */}
                                    {isHovering && (
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                            <div className="w-3 h-3 border rounded-full opacity-60" style={{ borderColor: stripeColor }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>

            <footer className="text-center text-xs text-slate-600 pt-4 border-t border-slate-900"></footer>
        </div>
    );
}