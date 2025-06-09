

import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import React, { useRef, useState, ElementRef, useEffect } from 'react';
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";

const formSchema = z.object({
    id: z.string().default(''),
    foundMeasure: z.string().default(''),
    foundMeasureNumber: z.string().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

interface InputEspecifiedMeasureProps {
    foundMeasureNumber: string;
};

const InputFoundMeasure = ({ foundMeasureNumber }: InputEspecifiedMeasureProps) => {
    const formRefEspecifiedMeasure = useRef<ElementRef<"form">>(null);
    const inputRefEspecifiedMeasure = useRef<ElementRef<"input">>(null);
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });
    const [foundMeasure, setFoundMeasure] = useState<string>('');
    const [enable, setEnable] = useState<boolean>(false);
    const [especifiedMeasures, setEspecifiedMeasures] = useState<Record<string, string>>({});

    const getEspecifiedMeasure = async () => {
        const result = await axios.get('/api/register/report')
            .then((response) => {
                setEspecifiedMeasures(response.data);
            });
    };

    console.log('foundMeasureNumber', especifiedMeasures["foundMeasurement" + foundMeasureNumber as string]);
    useEffect(() => {
        getEspecifiedMeasure();
    }, [foundMeasure]);

    const formatFoundMeasure = (measure: string) => {
      if(especifiedMeasures){

      }
    }

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
                    {foundMeasure ? `${foundMeasure} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
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
                                value={foundMeasure}
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