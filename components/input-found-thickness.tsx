

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
    foundThickness: z.string().min(1).default(''),
    foundThicknessNumber: z.string().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface InputEspecifiedMeasureProps {
    foundThicknessNumber: string;
    reportData?: any;
};

const InputFoundThickness = ({ foundThicknessNumber, reportData }: InputEspecifiedMeasureProps) => {

    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });

    const [especifiedMeasure, setEspecifiedMeasure] = useState<string>('');
    const [enable, setEnable] = useState<boolean>(false);
    const handleDrawer = useReporDrawer();


    const formRefEspecifiedThickness = useRef<ElementRef<"form">>(null);
    const inputRefEspecifiedThickness = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        const interval = setInterval(() => {
            inputRefEspecifiedThickness.current?.focus();
            inputRefEspecifiedThickness.current?.select();

            clearInterval(interval);
        }, 150);
    };

    useEffect(() => {
        if (reportData) {
            setEspecifiedMeasure(reportData.foundThickness);
        }
    }, [reportData])

    const onSubmit = async () => {
        try {
            form.setValue('foundThickness', especifiedMeasure);
            form.setValue('foundThicknessNumber', `ft${foundThicknessNumber}`);
            form.setValue('id', handleDrawer.id.id!);
            await axios.post('/api/register/report', form);
            toast.success('Espessura encontrada salva!', {
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
        formRefEspecifiedThickness.current?.requestSubmit();
        setEnable(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
            formRefEspecifiedThickness.current?.requestSubmit();
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
                    {especifiedMeasure
                        ? `${especifiedMeasure} mm`
                        : <div className="text-xm text-muted-foreground">_._mm</div>
                    }
                </div>
            )
                :
                <form
                    ref={formRefEspecifiedThickness}
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
                                ref={inputRefEspecifiedThickness}
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

export default InputFoundThickness;