'use client'

import InputEspecifiedMeasure from '@/components/input-especified-measure';
import InputEspecifiedThickness from '@/components/input-especified-thickness';
import InputFoundMeasure from '@/components/input-found-measure';
import InputSurfaceFound from '@/components/input-found-surface';
import InputFoundThickness from '@/components/input-found-thickness';
import { Button } from '@/components/ui/button';
import { set } from 'date-fns';
import React, { useState } from 'react';
import toast from "react-hot-toast";

interface FeaturesControlReportProps {
    show: boolean;
}

const FeaturesControlReport = ({ show }: FeaturesControlReportProps) => {
    const [inputAmount, setInputAmount] = useState<any>([1]);


    const addInput = () => {
        if (inputAmount.length >= 10) {
            toast.error('Você só pode adicionar até 10 medidas!', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#2786b3',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',
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
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#2786b3',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',
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
                <div>Superficie&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div></div>
                <InputSurfaceFound foundSurfaceNumber='0' />
            </div>
            <div className='flex justify-between w-full px-4'>
                <div>Espessura&nbsp;&nbsp;&nbsp;</div>
                <InputEspecifiedThickness especifiedThicknessNumber='0' />
                <InputFoundThickness foundThicknessNumber='0' />
            </div>
            <div className='flex flex-col border-2 border-gray-300 rounded-lg px-4 mt-1 w-full'>
                {inputAmount.map((input: any, inputIndex: any) => (
                    <div key={inputIndex} className='w-full'>
                        <div className='flex justify-between items-center'>
                            <div>Medida n.º {inputIndex + 1}</div>
                            <InputEspecifiedMeasure especifiedMeasureNumber={inputIndex} />
                            <InputFoundMeasure foundMeasureNumber={inputIndex} />
                        </div>
                    </div>
                ))}
            </div>

            {show && (
                <div className='p-5 w-72 flex justify-between' >
                    <Button
                        onClick={() => {
                            addInput();
                        }}
                    >
                        Add more input
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
