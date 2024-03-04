'use client'

import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    TabsContent,
} from "@/components/ui/tabs"
import { Badge } from "./ui/badge";
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertOctagon, Trash2 } from 'lucide-react';

const formSchema = z.object({
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(6),
    amount: z.string().min(1),
    qtd: z.string().min(1),
    result: z.string().min(1),
    prefix: z.string().min(1),
    thickness: z.string().min(1),
    cnc: z.string().min(2),
    inspector: z.string().min(2),
    machine: z.string().min(2),
});

type PressFormValues = z.infer<typeof formSchema>;

interface FormPressProps {
    tab: string;
}

const FormPress: React.FC<FormPressProps> = ({ tab }) => {
    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
    });
    const { data: session } = useSession();
    const [inspectorName, setInspectorName] = useState('');
    const [showIcon, setShowIcon] = useState('hidden');
    const router = useRouter();

    useEffect(() => {
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name')
        form.setValue('inspector', inspectorName);
    }, [inspectorName, setInspectorName, session, form]);

    const onSubmit = async (data: PressFormValues) => {
        try {
            const res = await axios.post('/api/register/punching', data);
            toast.success('Registro salvo com sucesso!!!', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#109c2e'

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#109c2e',
                },
            });
            form.setValue('item', '');
            form.setValue('version', '');
            form.setValue('odf', '');
            form.setValue('amount', '');
            form.setValue('result', '');
            form.setValue('prefix', '');
        } catch (error) {
            console.log(error);
            toast.error('Parece que algo está errado!!!', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#a80a1f'

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#a80a1f',
                },
            });
        }
    }

    const clearForm = () => {
        form.setValue('item', '');
        form.setValue('version', '');
        form.setValue('odf', '');
        form.setValue('amount', '');
        form.setValue('thickness', '');
        form.setValue('qtd', '');
        form.setValue('cnc', '');
        form.setValue('machine', '');
        form.setValue('result', '');
        form.setValue('prefix', '');
        setShowIcon('hidden');
        toast.success('Formulário limpo!!!', {
            style: {
                border: '3px solid white',
                padding: '30px',
                color: 'white',
                backgroundColor: '#2786b3'

            },
            iconTheme: {
                primary: 'white',
                secondary: '#2786b3',
            },
        });
    }

    const verifyEmpetyField = () => {
        if (form.getValues('cnc') !== '' || form.getValues('thickness') !== '' || form.getValues('machine') !== '') {
            setShowIcon('');
        } else {
            setShowIcon('hidden')
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <TabsContent value={tab}>
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle>
                                        <Badge className="p-1 text-2xl">
                                            Puncionadeira
                                        </Badge>
                                    </CardTitle>
                                    <div>
                                        <CardDescription>
                                            Formulário digital Rev: 00
                                        </CardDescription>
                                        <CardDescription>
                                            Criação: 00/00/00
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="">
                                    <div className="space-y-1 mb-4 ">
                                        <div className="">
                                            <div className='flex mb-3'>
                                                <div className='flex fixed gap-5 gap-y-4 ml-3 '>
                                                    <div
                                                        onClick={() => clearForm()}
                                                        className='cursor-pointer'
                                                    >
                                                        <Button type='reset' size='icon' variant='outline'>
                                                            <Trash2 size={20} color='red' />
                                                        </Button>
                                                    </div>
                                                    <div className=''>
                                                        <Button
                                                            type='button'
                                                            size='icon'
                                                            variant='outline'
                                                            disabled={true}
                                                            className={`brightness-200 ${showIcon}`}
                                                        >
                                                            <AlertOctagon color='#0ba3a1' size={20} className='animate-pulse' />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className='pt-10 '>
                                                    <FormField
                                                        control={form.control}
                                                        name="prefix"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <ToggleGroupItem value="ME." aria-label="Toggle bold">
                                                                        ME.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem value="PU." aria-label="Toggle italic">
                                                                        PU.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem value="ENP." aria-label="Toggle strikethrough">
                                                                        ENP.
                                                                    </ToggleGroupItem>
                                                                </ToggleGroup>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className='pt-2'>
                                                    <FormField
                                                        control={form.control}
                                                        name='item'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Item:</FormLabel>
                                                                <FormControl
                                                                    onChange={() => { verifyEmpetyField() }}
                                                                >
                                                                    <Input
                                                                        type='number'
                                                                        placeholder='Codigo do item'
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name='version'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Revisão:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='Rev' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='thickness'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Espessura:</FormLabel>
                                                            <FormControl
                                                                onChange={() => { verifyEmpetyField() }}
                                                            >
                                                                <Input
                                                                    type='text' placeholder='0,0' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='odf'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>ODF:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='_,_,_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='amount'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Qtd ODF:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number'
                                                                    placeholder='_,_,_,_'
                                                                    {...field}
                                                                    className=''
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='flex gap-2'>

                                                <FormField
                                                    control={form.control}
                                                    name='cnc'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>CNC:</FormLabel>
                                                            <FormControl
                                                                onChange={() => { verifyEmpetyField() }}
                                                            >
                                                                <Input
                                                                    type='text'
                                                                    placeholder='_,_,_,_'
                                                                    {...field}
                                                                    className='w-20'
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='machine'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Maquina:</FormLabel>
                                                            <FormControl
                                                                onChange={() => { verifyEmpetyField() }}
                                                            >
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger className="w-[150px]">
                                                                        <SelectValue placeholder="Selecione a maquina" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Selecione a maquina</SelectLabel>
                                                                            <SelectItem value="MT300">MT300</SelectItem>
                                                                            <SelectItem value="HPE">HPE</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='qtd'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='truncate'>Qtd inspecionada:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                    className=''
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name='result'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className='flex justify-center m-4'>
                                                                <FormLabel>Resultado:</FormLabel>
                                                            </div>
                                                            <ToggleGroup
                                                                type="single"
                                                                onValueChange={field.onChange} defaultValue={field.value}>
                                                                <ToggleGroupItem
                                                                    value="Aprovado"
                                                                    aria-label="Toggle"
                                                                    className="hover:bg-green-100"
                                                                >
                                                                    Aprovado
                                                                </ToggleGroupItem>
                                                                <ToggleGroupItem
                                                                    value="Reprovado"
                                                                    aria-label="Toggle"
                                                                    className="hover:bg-red-100"
                                                                >
                                                                    Reprovado
                                                                </ToggleGroupItem>
                                                            </ToggleGroup>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </CardContent>
                            <CardFooter>
                                <div className='flex w-[390px] justify-center '>
                                    <Button
                                        type='submit'
                                        className='flex w-[320px] '
                                    >
                                        Registrar
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </form>
            </Form >
        </>
    )
}

export default FormPress