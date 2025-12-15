'use client'

import { Input } from '@/components/ui/input';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Compressor from 'compressorjs';
import { ImagePlus } from 'lucide-react';
import { Tip } from '@/components/ui/tip';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


const Ruler = ({ }) => {
  type Measurement = { points: { x: number; y: number }[]; measure: { inputValue: number }[] };
  const [newValue, setNewValue] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
  const [mmPerPixel, setMmPerPixel] = useState(0.2646);
  const [base64, setBase64] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compressedImages, setCompressedImages] = useState([]);
  const [image, setImage] = useState(null);
  const svgRef = useRef();

  const handleDrop = useCallback(async (files: any) => {
    const file = files[0];
    let array = [] as any;
    let compressedImages = [] as any;
    try {
      for (let i = 0; i < files.length; i++) {
        const readerPreviwe = new FileReader();
        readerPreviwe.readAsDataURL(files[i]);
        readerPreviwe.onload = (e) => {
          array.push(e?.target?.result)
        }
        setBase64(array);
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
  }, [setBase64, setCompressedImages]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    disabled: isLoading,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    maxFiles: 4,
  });

  const mouseOverAddMeasure = () => {
    if (base64.length < 1) return;
    if (measurements[measurements.length - 1]?.points.length === 2 || measurements.length === 0) {
      handleAddMeasurement();
    }
  };

  // Função para lidar com o carregamento da imagem
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        //@ts-ignore
        setImage(e.target.result);
        setMeasurements([]); // Limpa as medições ao carregar nova imagem
        //setMmPerPixel(0); // Reseta a escala
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMeasurement = () => {
    const newMeasurements = [...measurements, { points: [], measure: [] }];
    //@ts-ignore
    setMeasurements(newMeasurements);
    setActiveMeasurementIndex(newMeasurements.length - 1);
  };

  const handleDeleteMeasurement = (index: number) => {
    measurements.splice(measurements.length - 1, 1);
    measurements.splice(index, 1);
    setMeasurements([...measurements]);
  };

  const handleSvgClick = (event: any) => {
    //@ts-ignore
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    /*  if (measurements[measurements.length - 1]?.points.length === 2 || measurements.length === 0) {
       handleAddMeasurement();
     }; */

    if (activeMeasurementIndex !== -1) {
      // Adiciona pontos de medição
      const newMeasurements = [...measurements];
      const activeMeasurement = newMeasurements[activeMeasurementIndex];

      //@ts-ignore
      if (activeMeasurement?.points.length < 2) {
        //@ts-ignore
        activeMeasurement.points.push({ x, y });
        setMeasurements(newMeasurements);
      }
    }
  };

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const distancePixels = Math.sqrt(dx * dx + dy * dy);
    (distancePixels * mmPerPixel).toFixed(2);
    return (distancePixels * mmPerPixel).toFixed(2);
  };


  return (
    <div
      onMouseOver={mouseOverAddMeasure}
      className='h-screen w-full'
      style={{ userSelect: 'none' }}
    >
      <h3>Medidor Interativo com Imagem</h3>
      <div style={{ marginBottom: '10px' }}>
        <input type="file" onChange={handleImageUpload} accept="image/*" />

        <div
          className='w-[28rem]'
        >
          <section
            className="
                      flex
                      justify-around
                      border-dashed 
                      border-2 
                      p-3
                    border-red-500
                      rounded-lg
                      shadow-lg shadow-red-900/50
                      hover:shadow-md hover:shadow-red-300/50
                      ">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <div className='flex justify-center align-middle items-center'>
                <Tip
                  message='Carregar imagens'
                  content={
                    <ImagePlus size={46} />
                  }
                />
                <div className='animate-pulse'>
                  {5 - base64.length < 1 ? "" : `+${4 - base64.length}`}
                </div>
              </div>
            </div>
            <aside>
              <ul className='flex justify-center align-middle items-center'>
                {
                  base64.map((img, index) => (
                    <Image
                      className='m-1 aspect-square object-cover rounded hover:scale-150 transition'
                      key={index}
                      src={img}
                      height={38}
                      width={38}
                      alt='uploaded image'
                    />
                  ))
                }
              </ul>
            </aside>
          </section>
        </div>

        <button onClick={handleAddMeasurement} disabled={!image || mmPerPixel === 0}>
          Adicionar Nova Medição
        </button>
      </div>
      <div>
        <div>
          resultados
        </div>
        <div className='flex flex-wrap'>
          {
            measurements.map((measurement, measurementIndex) => (
              <div key={measurementIndex} className='flex'>
                Mediçao {measurementIndex + 1}:
                <Input
                  className='bg-black w-36 border'
                  onChange={(e) => {
                    const newMeasurements = [...measurements];
                    newMeasurements[measurementIndex].measure.push({ inputValue: Number(e.target.value) });
                    setMeasurements(newMeasurements);
                    setNewValue(Number(e.target.value));
                  }} />
                <Button
                  onClick={() => {
                    handleDeleteMeasurement(measurementIndex);
                  }}
                >
                  Trash
                </Button>
              </div>
            ))
          }
        </div>
      </div>

      <svg
        //@ts-ignore

        ref={svgRef}
        className='flex'
        width="100%"
        height="140%"
        style={{ border: '1px solid #ccc', marginTop: '10px', }}

        onClick={handleSvgClick}
      >
        {/* Renderiza a imagem carregada */}
        {/*         {image && <image href={image} x="0" y="0" width={1000} height={1000} />}*/}
        {base64.length > 0 &&
          base64.map((img, index) => (

            <image
              key={index}
              href={img}
              x={index < 2 ? index * 602 : (index - 2) * 600}
              y={index < 2 ? 0 : 602}
              width={600}
              height={600}
            />

          ))
        }


        {/* Renderiza as medições */}
        {measurements.map((measurement, measurementIndex) => (

          <React.Fragment key={measurementIndex}>
            {measurement.points.length === 2 && (
              <>
                {/* Linha de medição principal */}
                <line
                  x1={measurement.points[0].x}
                  y1={measurement.points[0].y}
                  x2={measurement.points[1].x}
                  y2={measurement.points[1].y}
                  stroke={measurementIndex === activeMeasurementIndex ? 'green' : 'green'}
                />
                {/* Texto da medição */}
                <text

                  x={(measurement.points[0].x + measurement.points[1].x) / 2 + 1}
                  y={(measurement.points[0].y + measurement.points[1].y) / 2}
                  fontSize="10"
                  fill=""
                  fontWeight="bold"
                >
                  Med {measurementIndex + 1}:&#160;
                </text>
                <text
                  x={(measurement.points[0].x + measurement.points[1].x) / 2 + 35}
                  y={(measurement.points[0].y + measurement.points[1].y) / 2}
                  fontSize="17"
                  fill="blue"
                  fontWeight="bold"
                  text-decoration-line='underline'

                >
                  {
                    //calculateDistance(measurement.points[0], measurement.points[1])
                    measurement.measure[measurement.measure.length - 1]?.inputValue
                  } mm
                </text>
              </>
            )}
            {measurement.points.map((point, pointIndex) => (
              <circle
                key={`m-${measurementIndex}-${pointIndex}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="red"
                opacity="0.7"
                cursor="pointer"
              />
            ))}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default Ruler;
