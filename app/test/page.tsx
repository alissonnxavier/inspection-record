'use client'

import InputEspecifiedMeasure from '@/components/input-especified-measure';
import InputEspecifiedThickness from '@/components/input-especified-thickness';
import InputFoundMeasure from '@/components/input-found-measure';
import InputSurfaceFound from '@/components/input-found-surface';
import InputFoundThickness from '@/components/input-found-thickness';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import toast from "react-hot-toast";

const Page = () => {
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

    <div className='flex flex-col items-center justify-center h-full'>
      <div className='flex justify-around w-full p-4 mt-4'>
        <div>Superficie</div>
        <div>_____</div>
        <InputSurfaceFound foundSurfaceNumber='0' />
      </div>
      <div className='flex justify-around w-full p-4 mt-4'>
        <div>Espessura</div>
        <InputEspecifiedThickness especifiedThicknessNumber='0' />
        <InputFoundThickness foundThicknessNumber='0' />
      </div>
      <div className='flex flex-col border-2 border-gray-300 rounded-lg p-4 mt-4 w-full'>
        {inputAmount.map((input: any, inputIndex: any) => (
          <div key={inputIndex} className='w-full'>
            <div className='flex justify-around'>
              <div>Medida n.º {inputIndex + 1}</div>
              <InputEspecifiedMeasure especifiedMeasureNumber={inputIndex} />
              <InputFoundMeasure foundMeasureNumber={inputIndex} />
            </div>
          </div>
        ))}
      </div>

      <div className='p-5 w-72 flex justify-between'>
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

    </div>
  );
};

export default Page;