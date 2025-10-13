'use client'

import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';

const Ruler = ({ width, height }) => {
    const [measurements, setMeasurements] = useState([]);
    const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
    const [draggingPointId, setDraggingPointId] = useState(null);
    const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
    const [mmPerPixel, setMmPerPixel] = useState(0);
    const [image, setImage] = useState(null);
    const [calibration, setCalibration] = useState({
        enabled: false,
        points: [],
    });

    const svgRef = useRef();

    // Função para lidar com o carregamento da imagem
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setMeasurements([]); // Limpa as medições ao carregar nova imagem
                setCalibration({ enabled: false, points: [] });
                setMmPerPixel(0); // Reseta a escala
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSvgClick = (event) => {
        const svgRect = svgRef.current.getBoundingClientRect();
        const x = event.clientX - svgRect.left;
        const y = event.clientY - svgRect.top;

        if (calibration.enabled) {
            // Adiciona pontos de calibração
            if (calibration.points.length < 2) {
                setCalibration({
                    ...calibration,
                    points: [...calibration.points, { x, y }],
                });
            }
        } else if (activeMeasurementIndex !== -1) {
            // Adiciona pontos de medição
            const newMeasurements = [...measurements];
            const activeMeasurement = newMeasurements[activeMeasurementIndex];
            if (activeMeasurement.points.length < 2) {
                activeMeasurement.points.push({ x, y });
                setMeasurements(newMeasurements);
            }
        }
    };

    const handleMouseDown = (event, measurementIndex, pointIndex) => {
        event.stopPropagation();
        setDraggingPointId({ measurementIndex, pointIndex, type: 'measurement' });
        setStartDragPos({ x: event.clientX, y: event.clientY });
    };

    const handleCalibrationMouseDown = (event, pointIndex) => {
        event.stopPropagation();
        setDraggingPointId({ measurementIndex: -1, pointIndex, type: 'calibration' });
        setStartDragPos({ x: event.clientX, y: event.clientY });
    };

    const handleMouseMove = (event) => {
        if (draggingPointId) {
            const dx = event.clientX - startDragPos.x;
            const dy = event.clientY - startDragPos.y;

            if (draggingPointId.type === 'measurement') {
                const { measurementIndex, pointIndex } = draggingPointId;
                const newMeasurements = [...measurements];
                const newPoint = {
                    x: newMeasurements[measurementIndex].points[pointIndex].x + dx,
                    y: newMeasurements[measurementIndex].points[pointIndex].y + dy,
                };
                newMeasurements[measurementIndex].points[pointIndex] = newPoint;
                setMeasurements(newMeasurements);
            } else if (draggingPointId.type === 'calibration') {
                const { pointIndex } = draggingPointId;
                const newCalibrationPoints = [...calibration.points];
                const newPoint = {
                    x: newCalibrationPoints[pointIndex].x + dx,
                    y: newCalibrationPoints[pointIndex].y + dy,
                };
                newCalibrationPoints[pointIndex] = newPoint;
                setCalibration({ ...calibration, points: newCalibrationPoints });
            }

            setStartDragPos({ x: event.clientX, y: event.clientY });
        }
    };

    const handleMouseUp = () => {
        setDraggingPointId(null);
    };

    const handleAddMeasurement = () => {
        const newMeasurements = [...measurements, { points: [] }];
        setMeasurements(newMeasurements);
        setActiveMeasurementIndex(newMeasurements.length - 1);
    };

    const handleDeleteMeasurement = (index) => {
        const newMeasurements = measurements.filter((_, i) => i !== index);
        setMeasurements(newMeasurements);
        if (activeMeasurementIndex === index) {
            setActiveMeasurementIndex(-1);
        }
    };

    const calculateDistance = (p1, p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        return (distancePixels * mmPerPixel).toFixed(2);
    };

    const handleCalibrate = () => {
        const knownDistanceMm = prompt('Insira a distância conhecida em mm:');
        if (knownDistanceMm && calibration.points.length === 2) {
            const distPixels = Math.sqrt(
                (calibration.points[0].x - calibration.points[1].x) ** 2 +
                (calibration.points[0].y - calibration.points[1].y) ** 2
            );
            setMmPerPixel(knownDistanceMm / distPixels);
            setCalibration({ enabled: false, points: [] });
        } else {
            alert('Selecione dois pontos para a calibração.');
        }
    };

    return (
        <div className='h-screen' onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ userSelect: 'none' }}>
            <h3>Medidor Interativo com Imagem</h3>

            <div style={{ marginBottom: '10px' }}>
                <input type="file" onChange={handleImageUpload} accept="image/*" />

                <Button className='bg-yellow-500' onClick={() => setCalibration({ enabled: true, points: [] })} disabled={!image}>
                    Iniciar Calibração
                </Button>
                {calibration.enabled && (
                    <Button onClick={handleCalibrate} disabled={calibration.points.length < 2}>
                        Confirmar Calibração
                    </Button>
                )}

                <Button className='bg-green-600' onClick={handleAddMeasurement} disabled={!image || mmPerPixel === 0}>
                    Adicionar Nova Medição
                </Button>
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
                            <p>Medição {index + 1}: Selecione os dois pontos.</p>
                        )}
                    </div>
                ))}
            </div>

            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                style={{ border: '1px solid #ccc', marginTop: '10px', display: image ? 'block' : 'none' }}
                onClick={handleSvgClick}
            >
                {/* Renderiza a imagem carregada */}
                {image && <image href={image} x="0" y="0" width={1000} height={1000} />}

                {/* Renderiza os pontos de calibração */}
                {calibration.enabled && calibration.points.map((point, index) => (
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
                {calibration.enabled && calibration.points.length === 2 && (
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

                {/* Renderiza as medições */}
                {measurements.map((measurement, measurementIndex) => (
                    <React.Fragment key={measurementIndex}>
                        {measurement.points.length === 2 && (
                            <line
                                x1={measurement.points[0].x}
                                y1={measurement.points[0].y}
                                x2={measurement.points[1].x}
                                y2={measurement.points[1].y}
                                stroke={measurementIndex === activeMeasurementIndex ? 'red' : 'green'}
                                strokeWidth="2"
                            />
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
