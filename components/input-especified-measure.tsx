

import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import React, { useRef, useState, ElementRef } from 'react';
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import { Form } from './ui/form';

const formSchema = z.object({
    id: z.string().default(''),
    especifiedMeasure: z.string().default(''),
    especifiedMeasureNumber: z.number().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface InputEspecifiedMeasureProps {
    especifiedMeasureNumber?: number;
};

const InputEspecifiedMeasure = ({ especifiedMeasureNumber }: InputEspecifiedMeasureProps) => {

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });

    const [especifiedMeasure, setEspecifiedMeasure] = useState<string>('');
    const [enable, setEnable] = useState<boolean>(false);
   

    const formRefEspecifiedMeasure = useRef<ElementRef<"form">>(null);
    const inputRefEspecifiedMeasure = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        const interval = setInterval(() => {
            inputRefEspecifiedMeasure.current?.focus();
            inputRefEspecifiedMeasure.current?.select();

            clearInterval(interval);
        }, 150);
    };

    const onSubmit = async () => {
        try {
            form.setValue('especifiedMeasure', especifiedMeasure);
            await axios.post('/api/register/report', form);
            toast.success('Espessura especificada salva!', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#706d0c',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#706d0c',
                },
            });
            setEnable(false);
        } catch (error) {
            console.log(error);
            toast.error('Parece que algo está errado!!!', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#a80a1f',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#a80a1f',
                },
            });
            setEnable(false);
        }
    };

    const handleSubmit = () => {
        onSubmit();
        setEnable(false);
    };

    const onBlur = () => {
        formRefEspecifiedMeasure.current?.requestSubmit();
        setEnable(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
            formRefEspecifiedMeasure.current?.requestSubmit();
            setEnable(false);
        };
    };

    useEventListener("keydown", onKeyDown);

    return (
        <div className='flex items-center justify-center h-full'>
            {!enable ? (
                <div
                    onClick={() => {
                        setEnable(true);
                        enableEditing();
                    }} >
                    {especifiedMeasure ? `${especifiedMeasure} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                </div>
            )
                :
                <form
                    ref={formRefEspecifiedMeasure}
                    action={handleSubmit}
                >
                    <>
                        <div className="flex">
                            <Input
                                value={especifiedMeasure}
                                ref={inputRefEspecifiedMeasure}
                                onBlur={() => {
                                    onBlur()
                                }}
                                onChange={(e) => { setEspecifiedMeasure(e.target.value) }}
                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                type="number"
                            />
                            <div className="text-xm text-muted-foreground">mm</div>
                        </div>
                    </>
                    <button type="submit" hidden />
                </form>

            }
        </div>
    )
};

export default InputEspecifiedMeasure;