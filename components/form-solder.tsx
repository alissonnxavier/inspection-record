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
    FormMessage,
} from "@/components/ui/form"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useEditForm } from '@/hooks/use-edit-form';
import { loadUniqueSoldierRegister } from '@/actions/load';

const formSchema = z.object({
    id: z.string().default(''),
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(6),
    amount: z.string().min(1),
    qtd: z.string().min(1),
    result: z.string().min(1),
    prefix: z.string().min(1, 'Selecione um prefixo'),
    process: z.string().min(1),
    inspector: z.string().min(1),
});

type PressFormValues = z.infer<typeof formSchema>;

interface FormPressProps {
    id: string;
    tab: string;
}

const FormPress: React.FC<FormPressProps> = ({ id, tab }) => {
    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
    });
    const { data: session } = useSession();
    const [inspectorName, setInspectorName] = useState('');
    const handleEditForm = useEditForm();
    const [inspectionData, setInspectionData] = useState([] as any);
    const [clearToggle, setClearToggle] = useState(true);

    const handleData = async (id: string) => {
        if (id?.length > 2 && handleEditForm.tab === tab) {
            await loadUniqueSoldierRegister(id)
                .then((response) => {
                    setInspectionData(response as any);
                    if (inspectionData?.id?.length > 3) {
                        form.setValue('id', response?.id as string);
                        form.setValue('prefix', response?.item.slice(0, 3) as string);
                        form.setValue('item', response?.item.slice(3, response?.item.length) as any);
                        form.setValue('version', response?.version as any);
                        form.setValue('odf', response?.odf as string);
                        form.setValue('amount', response?.amount as string);
                        form.setValue('qtd', response?.qtd as string);
                        form.setValue('result', response?.result as string);
                        form.setValue('process', response?.process as string);
                    }
                });
        }
    }

    useEffect(() => {
        handleData(id)
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name')
        form.setValue('inspector', inspectorName);
    }, [setInspectorName, session, form, id, inspectionData?.id]);

    const onSubmit = async (formData: PressFormValues) => {
        try {
            if (inspectionData?.id?.length > 0) {
                const res = await axios.post('/api/edit/soldier', formData);
                toast.success('Registro editado com sucesso!!!', {
                    style: {
                        border: '3px solid white',
                        color: 'white',
                        backgroundColor: '#706d0c',
                        boxShadow: '20px 20px 50px grey',
                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#706d0c',
                    },
                });
                form.setValue('item', '');
                form.setValue('version', '');
                form.setValue('odf', '');
                form.setValue('amount', '');
                form.setValue('qtd', '');
                form.setValue('process', '');
                setInspectionData([]);
                handleEditForm.clearData();
            } else {
                const res = await axios.post('/api/register/soldier', formData);
                toast.success('Registro salvo com sucesso!!!', {
                    style: {
                        border: '3px solid white',
                        color: 'white',
                        backgroundColor: '#109c2e',
                        boxShadow: '20px 20px 50px grey',

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
                form.setValue('qtd', '');
                form.setValue('process', '');
            }
            setClearToggle(false);
        } catch (error) {
            console.log(error);
            toast.error('Parece que algo está errado!!!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#a80a1f',
                    boxShadow: '20px 20px 50px grey',

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#a80a1f',
                },
            });
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
                                            Solda
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
                                <div className="pt-2">
                                    <div className="space-y-1 mb-4 ">
                                        <div className="">
                                            <div className='flex mb-3'>
                                                <div className='pt-8'>
                                                    <FormField
                                                        control={form.control}
                                                        name="prefix"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <ToggleGroup
                                                                    type="single"
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                    value={clearToggle ? field.value : ''}
                                                                >
                                                                    <ToggleGroupItem value="ER." aria-label="Toggle ">
                                                                        ER.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem value="ME." aria-label="Toggle ">
                                                                        ME.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem value="PU." aria-label="Toggle ">
                                                                        PU.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem value="ENP." aria-label="Toggle ">
                                                                        ENP.
                                                                    </ToggleGroupItem>
                                                                </ToggleGroup>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name='item'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Item:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='Codigo do item' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
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
                                                                    type='number' placeholder='Revisão' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='process'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Processo:</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger className="w-[150px]">
                                                                        <SelectValue placeholder="Selecione o processo" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Selecione o processo</SelectLabel>
                                                                            <SelectItem value="Solda ponto">Solda ponto</SelectItem>
                                                                            <SelectItem value="Solda MIG">Solda MIG</SelectItem>
                                                                            <SelectItem value="Solda TIG">Solda TIG</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
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
                                            </div>
                                            <div className='flex gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name='amount'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quantidade ODF:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='qtd'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Inspecionado:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='_,_' {...field}
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
                                                                onValueChange={field.onChange}
                                                                defaultValue={field.value}
                                                                value={clearToggle ? field.value : ''}
                                                            >
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
                                    {handleEditForm.id && handleEditForm.tab === tab ?
                                        <>
                                            <div className='flex w-full justify-between px-10'>
                                                <div>
                                                    <Button
                                                        type='submit'
                                                        className='shadow-lg hover:shadow-sm'
                                                        variant='secondary'>
                                                        Salvar
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button
                                                        onClick={() => {
                                                            handleEditForm.clearData();
                                                            window.location.reload()
                                                        }}
                                                        variant='delete'>
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                        : <Button
                                            type='submit'
                                            className='flex w-[320px] '
                                        >
                                            Registrar
                                        </Button>
                                    }
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