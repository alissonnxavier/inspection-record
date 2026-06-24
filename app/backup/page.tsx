'use client'

import React, { useState, useRef, MouseEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Trash2, DoorOpen, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';

export default function MedidorInterativo() {
  const [image, setImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(2); // Multiplicador do zoom (2x, 3x, etc.)
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);

  // Configuração do Dropzone para Upload
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Limpar imagem da tela
  const handleRemoveImage = () => {
    setImage(null);
    setIsHovering(false);
  };

  // Gerencia o movimento do mouse para calcular o ponto de zoom
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();

    // Coordenadas relativas ao container da imagem (0 a 100%)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Restringe os limites entre 0 e 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setPointerPos({ x: clampedX, y: clampedY });
    setZoomPos({ x: clampedX, y: clampedY });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 flex flex-col justify-between">
      {/* Header / Barra Superior */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <ZoomIn className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tight">Zoom</h1>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-slate-100">
            <DoorOpen className="w-4 h-4" />
            Sair
          </Button>
        </Link>
      </header>

      {/* Conteúdo Centralizado */}
      <div className="flex-1 flex flex-col justify-center items-center gap-6 my-4 w-full max-w-5xl mx-auto">

        {/* Painel de Controle Superior (Slider) */}
        <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-lg">
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

          {/* Área de Status de Remoção */}
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

        {/* Workspace Central (Dropzone ou Imagens) */}
        <div className="w-full flex justify-center items-center min-h-[420px]">
          {!image ? (
            /* Dropzone perfeitamente centralizado */
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
              <p className="text-xs text-slate-500 mt-1">Formatos suportados: JPEG, PNG, WEBP</p>
            </div>
          ) : (
            /* Imagem + Lupa centralizados lado a lado */
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">

              {/* Imagem Original Interativa */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-center relative select-none max-w-xl w-full">
                <div
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  // cursor-none esconde a seta padrão do Windows/Mac para destacar apenas a nossa mira customizada
                  className="relative overflow-hidden cursor-none max-w-full max-h-[450px]"
                >
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-auto object-contain max-h-[450px] rounded"
                    draggable={false}
                  />

                  {/* Super Mira Alvo Ultra Chamativa */}
                  {isHovering && (
                    <div
                      className="absolute w-12 h-12 border border-dashed border-red-700 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-green-500 opacity-80 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-transform duration-75"
                      style={{ left: `${pointerPos.x}%`, top: `${pointerPos.y}%` }}
                    >
                      {/* Linhas em Cruz do Alvo (Eixos X e Y) */}
                      <div className="absolute w-full h-[1px] bg-red-400" />
                      <div className="absolute h-full w-[1px] bg-red-500" />
                      
                      {/* Anel interno brilhante */}
                      <div className="w-4 h-4 border-2 border-red-500 rounded-full bg-slate-950 flex items-center justify-center shadow-inner">
                        {/* Ponto central exato */}
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping absolute" />
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quadro Lateral de Zoom Ampliado */}
              <div className="w-full md:w-[300px] bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between self-stretch md:self-auto">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3 text-center md:text-left">Ponto Ampliado</h3>

                  <div className="w-full aspect-square bg-slate-950 border border-indigo-500/30 rounded-lg overflow-hidden relative flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.15)]">
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
                      <div className="text-xs text-slate-500 text-center px-4">
                        Passe o mouse sobre a imagem original para inspecionar
                      </div>
                    )}
                    
                    {/* Retícula sutil no centro do painel de zoom para ajudar no foco */}
                    {isHovering && (
                      <div className="absolute inset-0 border border-indigo-500/20 pointer-events-none flex items-center justify-center">
                        <div className="w-3 h-3 border border-indigo-500/40 rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mt-4 text-center border-t border-slate-800/60 pt-3">
                
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Footer Simples */}
      <footer className="text-center text-xs text-slate-600 pt-4 border-t border-slate-900">
      
      </footer>
    </div>
  );
}