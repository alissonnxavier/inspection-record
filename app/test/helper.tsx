'use client'

import { Input } from '@/components/ui/input';
import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { DoorOpen, ImagePlus, Trash2 } from 'lucide-react';
import { Tip } from '@/components/ui/tip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Ruler = () => {
  // 1. Atualizado o Type para incluir color
  type Measurement = { 
    points: { x: number; y: number }[]; 
    measure: { inputValue: number }[];
    color: string; // Nova propriedade
  };

  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
  const [base64, setBase64] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDrop = useCallback(async (files: File[]) => {
    let array: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          if (e.target?.result) {
            array.push(e.target.result as string);
            setBase64([...array]);
          }
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    disabled: isLoading,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleAddMeasurement = () => {
    // 2. Definimos uma cor padrão (ex: verde #22c55e) ao criar a medição
    const newMeasurements: Measurement[] = [
      ...measurements, 
      { points: [], measure: [], color: '#22c55e' } 
    ];
    setMeasurements(newMeasurements);
    setActiveMeasurementIndex(newMeasurements.length - 1);
  };

  const mouseOverAddMeasure = () => {
    if (base64.length < 1) return;
    if (measurements.length === 0 || measurements[measurements.length - 1]?.points.length === 2) {
      handleAddMeasurement();
    }
  };

  const handleDeleteMeasurement = (index: number) => {
    const updated = measurements.filter((_, i) => i !== index);
    setMeasurements(updated);
  };

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || activeMeasurementIndex === -1) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    const newMeasurements = [...measurements];
    const active = newMeasurements[activeMeasurementIndex];

    if (active.points.length < 2) {
      active.points.push({ x, y });
      setMeasurements(newMeasurements);
    }
  };

  return (
    <div
      onMouseOver={mouseOverAddMeasure}
      className='min-h-screen w-full m-auto justify-center items-center flex flex-col'
      style={{ userSelect: 'none' }}
    >
      <div className='w-full flex flex-col sm:flex-row justify-between items-center p-4 gap-4'>
        <Link href='/' className="sm:ml-4 lg:ml-10"><DoorOpen size={50} /></Link>
        <h3 className='text-center text-lg md:text-xl font-medium'>Medidor Interativo</h3>
        <div className='hidden sm:block'></div>
      </div>

      {/* Upload Area */}
      <div className='mb-4 flex justify-center items-center'>
        <div className='w-[20rem] border-dashed border-2 p-3 border-red-500 rounded-lg'>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className='flex justify-center items-center cursor-pointer'>
              <Tip message='Carregar imagem' content={<ImagePlus size={46} />} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Medições e Seletor de Cor */}
      <div className='flex flex-wrap m-auto justify-center items-center gap-2 mb-4'>
        {measurements.map((measurement, idx) => (
          <div key={idx} className='flex gap-2 justify-center items-center p-2 border rounded-md bg-slate-50'>
            <span className='text-sm font-bold'>Med {idx + 1}:</span>
            
            {/* INPUT DE COR ADICIONADO AQUI */}
            <input 
              type="color" 
              value={measurement.color}
              onChange={(e) => {
                const newMeasures = [...measurements];
                newMeasures[idx].color = e.target.value;
                setMeasurements(newMeasures);
              }}
              className="w-8 h-8 cursor-pointer rounded-full border-none"
            />

            <Input
              className='w-16 border'
              type="number"
              placeholder="mm"
              onChange={(e) => {
                const newMeasures = [...measurements];
                newMeasures[idx].measure = [{ inputValue: Number(e.target.value) }];
                setMeasurements(newMeasures);
              }}
            />
            <Button variant="destructive" size="icon" onClick={() => handleDeleteMeasurement(idx)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      {/* SVG Display */}
      <svg
        ref={svgRef}
        width="100%"
        height="600px"
        className='border border-gray-300 bg-slate-100'
        onClick={handleSvgClick}
      >
        {base64.map((img, index) => (
          <image key={index} href={img} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
        ))}

        {measurements.map((m, mIdx) => (
          <React.Fragment key={mIdx}>
            {m.points.length === 2 && (
              <>
                {/* Linha com a COR DINÂMICA */}
                <line
                  x1={m.points[0].x} y1={m.points[0].y}
                  x2={m.points[1].x} y2={m.points[1].y}
                  stroke={m.color}
                  strokeWidth="3"
                />
                <text
                  x={(m.points[0].x + m.points[1].x) / 2}
                  y={(m.points[0].y + m.points[1].y) / 2 - 10}
                  fontSize="14"
                  fill={m.color} // Texto também assume a cor escolhida
                  fontWeight="bold"
                  textAnchor="middle"
                  className='drop-shadow-sm'
                >
                  {m.measure[0]?.inputValue || 0} mm
                </text>
              </>
            )}
            {m.points.map((p, pIdx) => (
              <circle key={`${mIdx}-${pIdx}`} cx={p.x} cy={p.y} r="5" fill={m.color} />
            ))}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default Ruler;