

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
} from "@/components/ui/form";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useEditForm } from '@/hooks/use-edit-form';
import { loadUniquePlateRegister, loadUniquePressRegister } from '@/actions/load';

const formSchema = z.object({
    id: z.string().default(''),
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(6),
    amount: z.string().min(1),
    qtd: z.string().min(1),
    result: z.string().min(1),
    prefix: z.string().min(1),
    inspector: z.string().min(3, { message: 'Atualize a pagina' }),
});

type PressFormValues = z.infer<typeof formSchema>;

interface FormPressProps {
    tab: string;
    id: string
}

const FormPress: React.FC<FormPressProps> = ({ tab, id }) => {

    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();
    const { data: session } = useSession();
    const [inspetorName, setInspectorName] = useState('');
    const handleEditForm = useEditForm();
    const [inspectionData, setInspectionData] = useState([] as any);

    const handleData = async (id: string) => {
        if (id?.length > 2 && handleEditForm.tab === tab) {
            await loadUniquePressRegister(id)
                .then((response) => {
                    setInspectionData(response as any);
                    if (inspectionData) {
                        form.setValue('id', response?.id as string);
                        form.setValue('prefix', response?.item.slice(0, 3) as string);
                        form.setValue('item', response?.item.slice(3, response?.item.length) as any);
                        form.setValue('version', response?.version as any);
                        form.setValue('odf', response?.odf as string);
                        form.setValue('amount', response?.amount as string);
                        form.setValue('qtd', response?.qtd as string);
                        form.setValue('result', response?.result as string);
                    }
                });
        }
    }

    useEffect(() => {
        handleData(id);
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name');
        form.setValue('inspector', inspetorName);
    }, [setInspectorName, session, inspetorName, form, id]);


    const onSubmit = async (formData: PressFormValues) => {
        try {
            if (inspectionData?.id?.length > 0) {
                const res = await axios.post('/api/edit/press', formData);
                toast.success('Registro editado com sucesso!!!', {
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
                form.setValue('item', '');
                form.setValue('version', '');
                form.setValue('odf', '');
                form.setValue('amount', '');
                form.setValue('qtd', '');
                setInspectionData([]);
                handleEditForm.clearData();
            } else {
                const res = await axios.post('/api/register/press', formData);
                toast.success('Registro salvo com sucesso!!!', {
                    style: {
                        border: '3px solid white',
                        padding: '30px',
                        color: 'white',
                        backgroundColor: '#109c2e',
                        borderRadius: '50%',
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
            }
            handleEditForm.clearData();
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
                                            Prensa
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