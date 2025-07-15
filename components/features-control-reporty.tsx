'use client'

import InputEspecifiedMeasure from '@/components/input-especified-measure';
import InputEspecifiedThickness from '@/components/input-especified-thickness';
import InputFoundMeasure from '@/components/input-found-measure';
import InputSurfaceFound from '@/components/input-found-surface';
import InputFoundThickness from '@/components/input-found-thickness';
import { Button } from '@/components/ui/button';
import React, { use, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { Separator } from './ui/separator';
import { loadUniqueReportRegister } from '@/actions/load';
import { useReporDrawer } from '@/hooks/use-drawer-report';


interface FeaturesControlReportProps {
    show: boolean;
};

const FeaturesControlReport = ({ show }: FeaturesControlReportProps) => {
    const [inputAmount, setInputAmount] = useState<any>([1]);
    const [reportData, setReportData] = useState<any>();
    const [closed, setClosed] = useState<boolean>(true);
    const handleDrawer = useReporDrawer();
    let array = [...inputAmount];

    useEffect(() => {
        loadUniqueReportRegister(handleDrawer.id.id!)
            .then((res) => {
                setReportData(res);
                if (res) {
                    for (let i = 0; i < 10; i++) {
                        if ((res as any)[`measurement${i}`] > 0 && i > 1) {
                            array.push(i + 1);
                        }
                    }
                }
                setInputAmount(array);
            });
    }, [handleDrawer.id.id,]);

    loadUniqueReportRegister(handleDrawer.id.id!)
        .then((res) => {
            if (res?.status === "closed") {
                setClosed(false);
            };
        });


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
            )
            }
        </div>
    );
};

export default FeaturesControlReport;
