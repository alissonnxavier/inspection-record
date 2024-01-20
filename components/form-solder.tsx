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

const formSchema = z.object({
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(6),
    amount: z.string().min(1),
    qtd: z.string().min(1),
    result: z.string().min(1),
    prefix: z.string().min(1),
    process: z.string().min(1),
    inspector: z.string().min(1),
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
    const router = useRouter();

    useEffect(()=>{
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name')
        form.setValue('inspector', inspectorName);
    },[inspectorName, setInspectorName, session]);

    const onSubmit = async (data: PressFormValues) => {
        try {
            const res = await axios.post('/api/register/soldier', data);
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
            form.setValue('qtd', '');
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
                                <div className="">
                                    <div className="space-y-1 mb-4 ">
                                        <div className="">
                                            <div className='flex mb-3'>
                                                <div className='pt-8'>
                                                    <FormField
                                                        control={form.control}
                                                        name="prefix"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <ToggleGroup type="single" onValueChange={field.onChange} defaultValue={field.value}>
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
                                                                    type='number' placeholder='_,_,_,_,_' {...field}
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
                                                            <FormLabel>Quantidade inspecionada:</FormLabel>
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