'use client'

import InputEspecifiedMeasure from '@/components/input-especified-measure';
import InputEspecifiedThickness from '@/components/input-especified-thickness';
import InputFoundMeasure from '@/components/input-found-measure';
import InputSurfaceFound from '@/components/input-found-surface';
import InputFoundThickness from '@/components/input-found-thickness';
import { Button } from '@/components/ui/button';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import toast from "react-hot-toast";
import { Separator } from './ui/separator';
import { loadUniqueReportRegister } from '@/actions/load';
import { useReporDrawer } from '@/hooks/use-drawer-report';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { ImagePlus } from 'lucide-react';
import { Tip } from './ui/tip';
import { Input } from './ui/input';


interface FeaturesControlReportProps {
    show: boolean;
};

const FeaturesControlReport = ({ show }: FeaturesControlReportProps) => {
    type Measurement = { points: { x: number; y: number }[]; measure: { inputValue: number }[] };
    const [inputAmount, setInputAmount] = useState<any>([]);
    const [reportData, setReportData] = useState<any>();
    const handleDrawer = useReporDrawer();
    const [isLoading, setIsLoading] = useState(false);
    const [base64, setBase64] = useState([]);
    const [mmPerPixel, setMmPerPixel] = useState(0.2646);
    const [activeMeasurementIndex, setActiveMeasurementIndex] = useState(-1);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [image, setImage] = useState(null);
    const svgRef = useRef();


    let array = [...inputAmount];

    useEffect(() => {
        loadUniqueReportRegister(handleDrawer.id.id!)
            .then((res) => {
                setReportData(res);
                if (res) {
                    for (let i = 0; i < 11; i++) {
                        if ((res as any)[`measurement${i}`] > 0 && i > 1) {
                            array.push(i + 1);
                        }
                    }
                }
                setInputAmount(array);
            });
    }, [handleDrawer.id.id,]);

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
                        }
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    }, [setBase64]);

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
            setInputAmount((prev: any) => [...prev, prev.length + 1]);
        }
    };

    const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        (distancePixels * mmPerPixel).toFixed(2);
        return (distancePixels * mmPerPixel).toFixed(2);
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

    const addInput = () => {
        if (inputAmount.length >= 10) {
            toast.error('Você só pode adicionar até 10 medidas!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#2786b3',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#2786b3',
                },
            });
            return;
        }
        setInputAmount((prev: any) => [...prev, prev.length + 1]);
    };

    const removeInput = () => {
        if (inputAmount.length <= 1) {
            toast.error('Você deve ter pelo menos uma medida!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#2786b3',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#2786b3',
                },
            });
            return;
        }
        const lessOneItem = inputAmount.pop();
        setInputAmount([...inputAmount]);
    };

    return (

        <div className='flex flex-col items-center justify-center h-full w-full'>
            <div className='flex justify-between w-full mt-4'>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div className='font-bold'>Especificado</div>
                <div className='font-bold pr-3'>Encontrado</div>
            </div>
            <div className='flex justify-between w-full px-4 mt-1'>
                <div className='font-bold'>Superficie&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div></div>
                <InputSurfaceFound foundSurfaceNumber='0' reportData={reportData} />
            </div>
            <div className='flex justify-between w-full px-4'>
                <div className='font-bold'>Espessura&nbsp;&nbsp;&nbsp;</div>
                <InputEspecifiedThickness especifiedThicknessNumber='0' reportData={reportData} />
                <InputFoundThickness foundThicknessNumber='0' reportData={reportData} />
            </div>
            <div className='flex flex-col px-6 mt-1 w-full'>
                {inputAmount.map((input: any, inputIndex: any) => (
                    <div key={inputIndex} className='w-full'>
                        <div className='flex justify-between items-center'>
                            <div className='font-bold '>Medida n.º {inputIndex + 1}</div>
                            <InputEspecifiedMeasure especifiedMeasureNumber={inputIndex} reportData={reportData} />
                            <InputFoundMeasure foundMeasureNumber={inputIndex} reportData={reportData} />
                        </div>
                    </div>
                ))}
            </div>

            {show && reportData?.status !== "closed" && (
                <div>
                    <div className='p-5 w-72 flex justify-between' >
                        <Button
                            onClick={() => {
                                addInput();
                            }}
                        >
                            Adicionar campo
                        </Button>
                        <Button
                            onClick={() => {
                                removeInput();
                            }}
                        >
                            Remover
                        </Button>
                    </div>
                    <div>
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
                    </div>
                </div>
            )
            }

            {/* Aqui esta o codigo para rederizar as linhas das mediçoes */}
            <div
                onMouseOver={mouseOverAddMeasure}
                className='h-screen w-full'
                style={{ userSelect: 'none' }}
            >
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
                    height="70%"
                    // style={{ border: '1px solid #ccc', marginTop: '10px', }}
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
                                width={500}
                                height={500}
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

        </div>
    );
};

export default FeaturesControlReport;
