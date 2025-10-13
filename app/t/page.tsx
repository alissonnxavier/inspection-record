'use client'

// @ts-nocheck

import React, { useState, useRef, useEffect } from 'react';

const Ruler = ({ }) => {
    const [pixelSizeInMm, setPixelSizeInMm] = useState<number | null>(null);
    type Measurement = { points: { x: number; y: number }[] };
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
    const [draggingPointId, setDraggingPointId] = useState(null);
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
    const [mmPerPixel, setMmPerPixel] = useState(0.2646);
    const [image, setImage] = useState(null);
    type Point = { x: number; y: number };
    const [calibration, setCalibration] = useState<{
        enabled: boolean;
        points: Point[];
    }>({
        enabled: false,
        points: [],
    });

    const usePixelSizeInMm = () => {
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const devicePixelRatio = window.devicePixelRatio || 1;
                // Assume a densidade base do CSS de 96 DPI.
                const dpiBase = 96;

                const cssPixelSizeInInches = 1 / dpiBase;
                const physicalPixelSizeInInches = cssPixelSizeInInches / devicePixelRatio;
                const physicalPixelSizeInMm = physicalPixelSizeInInches * 25.4;
                //@ts-ignore
                setPixelSizeInMm(physicalPixelSizeInMm);
            }
        }, []);
        return pixelSizeInMm;
    };
    const pixels = usePixelSizeInMm();


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
                setCalibration({ enabled: false, points: [] });
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


        console.log(newMeasurements);
    };

    const handleSvgClick = (event: any) => {
        //@ts-ignore
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        console.log(activeMeasurementIndex)
        console.log('click aqui');
        if (activeMeasurementIndex === 0) {
            handleAddMeasurement();
        }


        if (calibration.enabled) {
            // Adiciona pontos de calibração
            if (calibration.points.length < 2) {
                setCalibration({
                    ...calibration,
                    //@ts-ignore
                    points: [...calibration.points, { x, y }],
                });
            }
        } else if (activeMeasurementIndex !== -1) {
            // Adiciona pontos de medição
            const newMeasurements = [...measurements];
            const activeMeasurement = newMeasurements[activeMeasurementIndex];
            //@ts-ignore
            if (activeMeasurement.points.length < 2) {
                //@ts-ignore
                activeMeasurement.points.push({ x, y });
                setMeasurements(newMeasurements);
            }
        }
    };

    const handleMouseDown = (
        event: React.MouseEvent<SVGCircleElement, MouseEvent>,
        measurementIndex: number,
        pointIndex: number
    ) => {
        event.stopPropagation(); // Impede que o clique no círculo adicione um novo ponto
        //@ts-ignore
        setDraggingPointId({ measurementIndex, pointIndex, type: 'measurement' });
        setStartDragPos({ x: event.clientX, y: event.clientY });
    };

    const handleCalibrationMouseDown = (
        event: React.MouseEvent<SVGCircleElement, MouseEvent>,
        pointIndex: number
    ) => {
        event.stopPropagation();
        //@ts-ignore
        setDraggingPointId({ measurementIndex: -1, pointIndex, type: 'calibration' });
        setStartDragPos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event: any) => {
        if (draggingPointId) {
            const dx = event.clientX - startDragPos.x;
            const dy = event.clientY - startDragPos.y;
            //@ts-ignore
            if (draggingPointId.type === 'measurement') {
                const { measurementIndex, pointIndex } = draggingPointId;
                const newMeasurements = [...measurements];
                const newPoint = {
                    //@ts-ignore
                    x: newMeasurements[measurementIndex].points[pointIndex].x + dx,
                    //@ts-ignore
                    y: newMeasurements[measurementIndex].points[pointIndex].y + dy,
                };
                //@ts-ignore
                newMeasurements[measurementIndex].points[pointIndex] = newPoint;
                setMeasurements(newMeasurements);
                //@ts-ignore
            } else if (draggingPointId.type === 'calibration') {
                const { pointIndex } = draggingPointId;
                const newCalibrationPoints = [...calibration.points];
                const newPoint = {
                    //@ts-ignore
                    x: newCalibrationPoints[pointIndex].x + dx,
                    //@ts-ignore
                    y: newCalibrationPoints[pointIndex].y + dy,
                };
                //@ts-ignore
                newCalibrationPoints[pointIndex] = newPoint;
                setCalibration({ ...calibration, points: newCalibrationPoints });
            }

            setStartDragPos({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setDraggingPointId(null);
    };



    const handleDeleteMeasurement = (index: any) => {
        const newMeasurements = measurements.filter((_, i) => i !== index);
        setMeasurements(newMeasurements);
        if (activeMeasurementIndex === index) {
            setActiveMeasurementIndex(-1);
        }
    };

    const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        return (distancePixels * mmPerPixel).toFixed(2);
    };

    const handleCalibrate = () => {
        const knownDistanceMm = prompt('Insira a distância conhecida em mm:');
        if (knownDistanceMm && calibration.points.length === 2) {
            const distPixels = Math.sqrt(
                //@ts-ignore
                (calibration.points[0].x - calibration.points[1].x) ** 2 +
                //@ts-ignore
                (calibration.points[0].y - calibration.points[1].y) ** 2
            );
            //@ts-ignore
            setMmPerPixel(knownDistanceMm / distPixels);
            setCalibration({ enabled: false, points: [] });
        } else {
            alert('Selecione dois pontos para a calibração.');
        }
    };

    return (
        <div className='h-screen w-full' onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ userSelect: 'none' }}>
            <div>
                {pixelSizeInMm ? (
                    <p>O tamanho estimado de cada pixel físico é de {pixelSizeInMm.toFixed(4)} mm.</p>
                ) : (
                    <p>Calculando...</p>
                )}
            </div>



            <h3>Medidor Interativo com Imagem</h3>

            <div style={{ marginBottom: '10px' }}>
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                <button onClick={() => setCalibration({ enabled: true, points: [] })} disabled={!image}>
                    Iniciar Calibração
                </button>
                {calibration.enabled && (
                    <button onClick={handleCalibrate} disabled={calibration.points.length < 2}>
                        Confirmar Calibração
                    </button>
                )}
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
                                <button onClick={() => handleDeleteMeasurement(index)} style={{ marginLeft: '10px' }}>
                                    Excluir
                                </button>
                            </>
                        )}
                        {measurement.points.length < 2 && (
                            <p>Medição {index + 1}: {calibration.enabled ? 'Aguardando calibração' : 'Selecione os dois pontos.'}</p>
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
                {calibration.enabled && (
                    <>
                        {calibration.points.length === 2 && (
                            <line

                                x1={calibration.points[0].x}
                                y1={calibration.points[0].y}
                                x2={calibration.points[1].x}
                                y2={calibration.points[1].y}
                                stroke="orange"
                                strokeWidth="2"
                                strokeDasharray="4"
                            />
                        )}
                        {calibration.points.map((point, index) => (
                            <circle
                                key={`cal-${index}`}
                                cx={point.x}
                                cy={point.y}
                                r="8"
                                fill="orange"
                                opacity="0.7"
                                onMouseDown={(e) => handleCalibrationMouseDown(e, index)}
                                cursor="pointer"
                            />
                        ))}
                    </>
                )}

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
                                onMouseDown={(e) => handleMouseDown(e, measurementIndex, pointIndex)}
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
