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

const Ruler = ({ }) => {
  type Measurement = {
    points: { x: number; y: number }[];
    measure: { inputValue: number }[];
    color: string;
    labelPos?: { x: number; y: number };
  };

  const [newValue, setNewValue] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
  const [mmPerPixel, setMmPerPixel] = useState(0.2646);
  const [base64, setBase64] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compressedImages, setCompressedImages] = useState([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineWidth, setLineWidth] = useState<number>(5);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

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

  const mouseOverAddMeasure = () => {
    if (base64.length < 1) return;
    if (measurements[measurements.length - 1]?.points.length === 2 || measurements.length === 0) {
      handleAddMeasurement();
    }
  };

  const handleAddMeasurement = () => {
    const newMeasurements: Measurement[] = [...measurements, { points: [], measure: [], color: '#060cbd' }];
    setMeasurements(newMeasurements);
    setActiveMeasurementIndex(newMeasurements.length - 1);
  };

  const handleDeleteMeasurement = (index: number) => {
    const newArr = [...measurements];
    newArr.splice(index, 1);
    setMeasurements(newArr);
  };

  const handleSvgClick = (event: any) => {
    if (draggingIndex !== null) return;
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    if (activeMeasurementIndex !== -1) {
      const newMeasurements = [...measurements];
      const activeMeasurement = newMeasurements[activeMeasurementIndex];

      if (activeMeasurement?.points.length < 2) {
        activeMeasurement.points.push({ x, y });
        if (activeMeasurement.points.length === 2) {
          activeMeasurement.labelPos = {
            x: (activeMeasurement.points[0].x + activeMeasurement.points[1].x) / 2,
            y: (activeMeasurement.points[0].y + activeMeasurement.points[1].y) / 2 - 20
          };
        }
        setMeasurements(newMeasurements);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingIndex === null || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    const newMeasures = [...measurements];
    newMeasures[draggingIndex].labelPos = { x, y };
    setMeasurements(newMeasures);
  };

  const handleMouseUp = () => setDraggingIndex(null);

  return (
    <div
      onMouseOver={mouseOverAddMeasure}
      className='w-full min-h-screen bg-background flex flex-col items-center' // Ajustado para scroll
      style={{ userSelect: 'none' }}
    >
      <div className='w-full flex flex-col sm:flex-row justify-between items-center p-4 gap-4'>
        <Link href='/' className="sm:ml-4 lg:ml-10">
          <DoorOpen size={50} />
        </Link>
        <h3 className='text-center text-lg md:text-xl font-medium sm:mr-4 lg:mr-28'>
          Medidor Interativo com Imagem
        </h3>
        <div className='hidden sm:block'></div>
      </div>

      <div style={{ marginBottom: '10px' }} className='flex justify-center items-center'>
        <div className='w-[20rem]'>
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
                  <Image
                    className='m-1 aspect-square object-cover rounded hover:scale-150 transition'
                    key={index} src={img} height={38} width={38} alt='uploaded image'
                  />
                ))}
              </ul>
            </aside>
          </section>
        </div>
      </div>

      <div>
        {measurements.length > 0 ? (
          <>
            <div className='text-center mb-2 text-sm text-gray-500'>
              Clique na imagem para adicionar pontos. Arraste o texto para mover.
            </div>
            <div className='flex justify-center items-center m-1 text-center text-lg md:text-xl font-medium'>
              resultados
            </div>
          </>
        ) : (
          <div className='text-center mb-2 text-sm text-gray-500'>
            Carregue uma imagem para começar.
          </div>
        )}

        <div className='flex flex-wrap m-auto justify-center items-center gap-2'>
          {measurements.map((measurement, measurementIndex) => (
            <div key={measurementIndex} className='flex gap-1 justify-center items-center m-1 p-2 border border-spacing-2 rounded-md'>
              <span className='text-xs font-bold'>Med {measurementIndex + 1}:</span>
              <input
                type="color"
                value={measurement.color}
                onChange={(e) => {
                  const newMeasures = [...measurements];
                  newMeasures[measurementIndex].color = e.target.value;
                  setMeasurements(newMeasures);
                }}
                className="w-6 h-6 cursor-pointer border-none bg-transparent"
              />
              <Input
                className='w-20 border h-8'
                type="number"
                onChange={(e) => {
                  const newMeasurements = [...measurements];
                  newMeasurements[measurementIndex].measure = [{ inputValue: Number(e.target.value) }];
                  setMeasurements(newMeasurements);
                  setNewValue(Number(e.target.value));
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteMeasurement(measurementIndex)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* DIV DE CONTROLE DE SCROLL ADICIONADO AQUI */}
      <div className='w-full overflow-auto flex-grow flex justify-center p-4'>
        <svg
          ref={svgRef}
          width="1280" // Largura fixa ou baseada na imagem para forçar o scroll se necessário
          height="1200" // Altura suficiente para as imagens empilhadas
          style={{ border: '1px solid #ccc', backgroundColor: '', minWidth: '1280px' }}
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <defs>
            {measurements.map((m, i) => (
              <marker key={`arrow-${i}`} id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={m.color} />
              </marker>
            ))}
          </defs>

          {base64.map((img, index) => (
            <image
              key={index}
              href={img}
              x={index < 2 ? index * 602 : (index - 2) * 600}
              y={index < 2 ? 0 : 602}
              width={1280}
              height={600}
            />
          ))}

          {measurements.map((measurement, measurementIndex) => {
            const hasTwoPoints = measurement.points.length === 2;
            const center = hasTwoPoints ? {
              x: (measurement.points[0].x + measurement.points[1].x) / 2,
              y: (measurement.points[0].y + measurement.points[1].y) / 2
            } : { x: 0, y: 0 };

            return (
              <React.Fragment key={measurementIndex}>
                {hasTwoPoints && (
                  <>
                    {measurement.labelPos && (
                      <line
                        x1={measurement.labelPos.x + 70}
                        y1={measurement.labelPos.y + 17}
                        x2={center.x}
                        y2={center.y}
                        stroke={measurement.color}
                        strokeWidth="5"
                        strokeDasharray="3"
                      //markerEnd={`url(#arrowhead-${measurementIndex})`}
                      />
                    )}

                    <line
                      x1={measurement.points[0].x}
                      y1={measurement.points[0].y}
                      x2={measurement.points[1].x}
                      y2={measurement.points[1].y}
                      stroke={measurement.color}
                      strokeWidth={lineWidth}
                    />

                    <g
                      onMouseDown={(e) => { e.stopPropagation(); setDraggingIndex(measurementIndex); }}
                      style={{ cursor: 'move' }}
                    >
                      <rect
                        x={(measurement.labelPos?.x || center.x) - 10}
                        y={(measurement.labelPos?.y || center.y) - 34}
                        width="40" height="50" fill="white" fillOpacity="0.8" rx="4"
                      />
                      <text
                        x={measurement.labelPos?.x || center.x}
                        y={measurement.labelPos?.y || center.y}
                        fontSize="10"
                        fill={measurement.color}
                        fontWeight="bold"
                      >
                        Med {measurementIndex + 1}:
                      </text>
                      <rect
                        x={(measurement.labelPos?.x || center.x) + 30}
                        y={(measurement.labelPos?.y || center.y) - 34}
                        width="160"
                        height="50"
                        fill="white"
                        fillOpacity="0.8"
                        rx="4"
                      />
                      <text
                        x={(measurement.labelPos?.x || center.x) + 35}
                        y={measurement.labelPos?.y || center.y}
                        fontSize="30"
                        fill={measurement.color}
                        fontWeight="bold"
                      >
                        : {measurement.measure[measurement.measure.length - 1]?.inputValue || 0} mm
                      </text>
                    </g>
                  </>
                )}
                {measurement.points.map((point, pointIndex) => (
                  <circle
                    key={`m-${measurementIndex}-${pointIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="red"
                    opacity="0.9"
                    cursor="pointer"
                  />
                ))}
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Ruler;