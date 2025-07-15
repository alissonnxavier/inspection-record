

import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import React, { useRef, useState, ElementRef, use, useEffect } from 'react';
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import { useReporDrawer } from '@/hooks/use-drawer-report';

const formSchema = z.object({
    id: z.string().default(''),
    especifiedMeasure: z.string().min(1).default(''),
    especifiedMeasureNumber: z.string().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface InputEspecifiedMeasureProps {
    especifiedMeasureNumber: number;
    reportData?: any;
};

const InputEspecifiedMeasure = ({ especifiedMeasureNumber, reportData }: InputEspecifiedMeasureProps) => {

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });

    const [especifiedMeasure, setEspecifiedMeasure] = useState<string>('');
    const [enable, setEnable] = useState<boolean>(false);
    const handleDrawer = useReporDrawer();


    const formRefEspecifiedMeasure = useRef<ElementRef<"form">>(null);
    const inputRefEspecifiedMeasure = useRef<ElementRef<"input">>(null);

    useEffect(() => {
        if (reportData) {
            setEspecifiedMeasure((reportData as any)[`measurement${especifiedMeasureNumber + 1}`])
        }
    }, [reportData]);

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
            form.setValue('especifiedMeasureNumber', `em${especifiedMeasureNumber}`);
            form.setValue('id', handleDrawer.id.id!);
            await axios.post('/api/register/report', form);
            toast.success('Medida especificada salva!', {
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
            setEnable(false);
        } catch (error) {
            console.log(error);
            toast.error('Parece que algo está errado!!!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#a80a1f',
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
                className='cursor-pointer'
                    onClick={() => {
                        setEnable(true);
                        enableEditing();
                    }} >
                    {especifiedMeasure
                        ? `${especifiedMeasure} mm`
                        : <div className="text-xm text-muted-foreground">_._mm</div>
                    }
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
                                value={
                                    especifiedMeasure
                                        ? especifiedMeasure
                                        : ''
                                }
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
    );


};

export default InputEspecifiedMeasure;