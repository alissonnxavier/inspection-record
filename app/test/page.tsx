'use client'

import InputEspecifiedMeasure from '@/components/input-especified-measure';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { add } from 'date-fns';
import React, { useRef, useState, ElementRef } from 'react';
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";

const Page = () => {

  const [inputAmount, setInputAmount] = useState<any>([1]);

  console.log(inputAmount);

  const addInput = () => {
    setInputAmount((prev: any) => [...prev, prev.length + 1]);
  };

  return (

    <div className='flex flex-col items-center justify-center h-full'>
      <Button
        onClick={() => {
          addInput();
        }}
      >
        Add more input
      </Button>

      {inputAmount.map((input: any, inputIndex: number) => (
        <div key={inputIndex}>
          <InputEspecifiedMeasure />
        </div>
      ))}



    </div>


  )

};

export default Page;