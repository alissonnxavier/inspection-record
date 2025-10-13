'use client'

// @ts-nocheck

import React, { useState, useRef, useEffect } from 'react';

const Ruler = ({ }) => {
  type Measurement = { points: { x: number; y: number }[] };
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
  const [mmPerPixel, setMmPerPixel] = useState(0.2646);
  const [image, setImage] = useState(null);


  const svgRef = useRef();

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
    const newMeasurements = [...measurements, { points: [] }];
    //@ts-ignore
    setMeasurements(newMeasurements);

    setActiveMeasurementIndex(newMeasurements.length - 1);
  };

  const handleSvgClick = (event: any) => {
    //@ts-ignore
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    const newMeasurements = [...measurements, { points: [] }];

    console.log('medida', newMeasurements.length - 1)
    console.log('index', activeMeasurementIndex)

    if (measurements[measurements.length - 1]?.points.length === 2 || measurements.length === 0) {
      handleAddMeasurement();
    }

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
    <div className='h-screen w-full' style={{ userSelect: 'none' }}>
      <h3>Medidor Interativo com Imagem</h3>

      <div style={{ marginBottom: '10px' }}>
        <input type="file" onChange={handleImageUpload} accept="image/*" />

        <button onClick={handleAddMeasurement} disabled={!image || mmPerPixel === 0}>
          Adicionar Nova Medição
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        {measurements.map((measurement, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>

            {measurement.points.length === 2 && mmPerPixel > 0 && (
              <>
                Medição {index + 1}: **{calculateDistance(measurement.points[0], measurement.points[1])} mm**
              </>
            )}
            {measurement.points.length < 2 && (
              <p>Medição {index + 1}: {true ? 'Aguardando calibração' : 'Selecione os dois pontos.'}</p>
            )}
          </div>
        ))}
      </div>

      <svg
        //@ts-ignore
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ border: '1px solid #ccc', marginTop: '10px', display: image ? 'block' : 'none' }}
        onClick={handleSvgClick}
      >
        {/* Renderiza a imagem carregada */}
        {image && <image href={image} x="0" y="0" width={1000} height={1000} />}

        {/* Renderiza os pontos de calibração */}


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
                  stroke={measurementIndex === activeMeasurementIndex ? 'red' : 'green'}
                  strokeWidth="2"
                />

                {/* Texto da medição */}
                <text
                  x={(measurement.points[0].x + measurement.points[1].x) / 2 + 10}
                  y={(measurement.points[0].y + measurement.points[1].y) / 2}
                  fontSize="20"
                  fill="black"
                  fontWeight="bold"
                >
                  {calculateDistance(measurement.points[0], measurement.points[1])} mm
                </text>

                {/* Linha de anotação do texto */}
                <line
                  x1={(measurement.points[0].x + measurement.points[1].x) / 2}
                  y1={(measurement.points[0].y + measurement.points[1].y) / 2}
                  x2={(measurement.points[0].x + measurement.points[1].x) / 2 + 5}
                  y2={(measurement.points[0].y + measurement.points[1].y) / 2}
                  stroke="black"
                  strokeWidth="1"
                />
              </>
            )}
            {measurement.points.map((point, pointIndex) => (
              <circle
                key={`m-${measurementIndex}-${pointIndex}`}
                cx={point.x}
                cy={point.y}
                r="8"
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
