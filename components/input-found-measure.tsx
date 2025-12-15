

import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import React, { useRef, useState, ElementRef, useEffect, use, useCallback, useMemo } from 'react';
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import { cn } from '@/lib/utils';
import { useReporDrawer } from '@/hooks/use-drawer-report';


const formSchema = z.object({
    id: z.string().default(''),
    foundMeasure: z.string().default(''),
    foundMeasureNumber: z.string().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface InputEspecifiedMeasureProps {
    foundMeasureNumber: string;
    reportData?: any;
};

const InputFoundMeasure = ({ foundMeasureNumber, reportData }: InputEspecifiedMeasureProps) => {
    const formRefEspecifiedMeasure = useRef<ElementRef<"form">>(null);
    const inputRefEspecifiedMeasure = useRef<ElementRef<"input">>(null);
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });
    const [foundMeasure, setFoundMeasure] = useState<string>('');
    const [enable, setEnable] = useState<boolean>(false);
    const [especifiedMeasures, setEspecifiedMeasures] = useState<Record<string, string>>({});
    const [meassureNC, setMeassureNC] = useState<boolean>(false);
    const handleDrawer = useReporDrawer();

    const measureSoon = () => {
        return foundMeasure ? foundMeasure : 0;
    };

    const increment = foundMeasureNumber + 1;
    const formatFoundMeasure = async (especifidMeasure: string) => {

        if (Number(especifidMeasure) > 0 && Number(especifidMeasure) <= 3) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 0.19 || tolerance < -0.19) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 3 && Number(especifidMeasure) <= 6) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 0.19 || tolerance < -0.19) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 6 && Number(especifidMeasure) <= 30) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 0.29 || tolerance < -0.29) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 30 && Number(especifidMeasure) <= 120) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 0.39 || tolerance < -0.39) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 120 && Number(especifidMeasure) <= 200) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 0.59 || tolerance < -0.59) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 200 && Number(especifidMeasure) <= 1000) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 1.09 || tolerance < -1.09) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        } else if (Number(especifidMeasure) > 1000 && Number(especifidMeasure) <= 2000) {
            const tolerance = Number(foundMeasure) - Number(especifidMeasure);
            if (tolerance > 2.09 || tolerance < -2.09) {
                setMeassureNC(true);
            } else {
                setMeassureNC(false);
            }
        };
    };

    useEffect(() => {
        setEspecifiedMeasures(reportData as any);
        if (reportData) {
            setFoundMeasure((reportData as any)[`foundMeasurement${foundMeasureNumber + 1}`]);
        };
    }, [reportData]);

    useEffect(() => {
        if (reportData) {
            formatFoundMeasure(reportData["measurement" + increment as string]);
        };
    }, [foundMeasure, increment, reportData]);

    const enableEditing = () => {
        const interval = setInterval(() => {
            inputRefEspecifiedMeasure.current?.focus();
            inputRefEspecifiedMeasure.current?.select();

            clearInterval(interval);
        }, 150);
    };

    const onSubmit = async () => {
        try {
            form.setValue('foundMeasure', foundMeasure);
            form.setValue('foundMeasureNumber', `fm${foundMeasureNumber}`);
            form.setValue('id', handleDrawer.id.id!);
            await axios.post('/api/register/report', form);
            toast.success('Espessura especificada salva!', {
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
        <div className={cn('flex items-center justify-center h-full',
            meassureNC ? 'text-red-500' : 'text-green-600'
        )}>
            {!enable ? (
                <div
                    className='hover:bg-muted cursor-pointer hover:rounded-md hover:font-bold'
                    onClick={() => {
                        setEnable(true);
                        enableEditing();
                    }} >
                    {foundMeasure
                        ? `${foundMeasure} mm`
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
                                    foundMeasure
                                        ? foundMeasure
                                        : ''
                                }
                                ref={inputRefEspecifiedMeasure}
                                onBlur={() => {
                                    onBlur()
                                }}
                                onChange={(e) => { setFoundMeasure(e.target.value) }}
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

export default InputFoundMeasure;