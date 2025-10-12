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
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertOctagon, Trash2 } from 'lucide-react';
import { loadUniquePunchingMachineRegister } from '@/actions/load';
import { useEditForm } from '@/hooks/use-edit-form';

const formSchema = z.object({
    id: z.string().default(''),
    item: z.string().min(4),
    version: z.string().min(1),
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
    id: string;
    tab: string;
}

const FormPress: React.FC<FormPressProps> = ({ id, tab }) => {
    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
    });
    const { data: session } = useSession();
    const [inspectorName, setInspectorName] = useState('');
    const [showIcon, setShowIcon] = useState(false);
    const [showTrashIcon, setShowTrashIcon] = useState(false);
    const [inspectionData, setInspectionData] = useState([] as any);
    const handleEditForm = useEditForm();

    const handleData = async (id: string) => {
        if (id?.length > 2 && handleEditForm.tab === tab) {
            await loadUniquePunchingMachineRegister(id)
                .then((response) => {
                    setInspectionData(response as any);
                    if (inspectionData?.id?.length > 3) {
                        form.setValue('id', response?.id as string);
                        form.setValue('prefix', response?.item.slice(0, 3) as string);
                        form.setValue('item', response?.item.slice(3, response?.item.length) as any);
                        form.setValue('version', response?.version as any);
                        form.setValue('thickness', response?.thickness as any);
                        form.setValue('odf', response?.odf as string);
                        form.setValue('amount', response?.amount as string);
                        form.setValue('cnc', response?.cnc as string);
                        form.setValue('machine', response?.machine as string);
                        form.setValue('qtd', response?.qtd as string);
                        form.setValue('result', response?.result as string);
                    }
                });
        }
    }

    useEffect(() => {
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name')
        form.setValue('inspector', inspectorName);
        handleData(id);
    }, [setInspectorName, session, form, id, inspectorName]);

    const onSubmit = async (formData: PressFormValues) => {
        try {
            if (inspectionData?.id?.length > 0) {
                const res = await axios.post('/api/edit/punching', formData);
                toast.success('Registro alterado com sucesso!!!', {
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
                form.setValue('cnc', '');
                form.setValue('machine', '');
                form.setValue('result', '');
                form.setValue('thickness', '');
                setInspectionData([]);
                handleEditForm.clearData();
            } else {
                const res = await axios.post('/api/register/punching', formData);
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
                form.setValue('result', '');
                form.setValue('prefix', '');
            }
            //handleEditForm.clearData();
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
    };

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
        setShowIcon(false);
        setShowTrashIcon(false);
        toast.success('Formulário limpo!!!', {
            style: {
                border: '3px solid white',
                padding: '30px',
                color: 'white',
                backgroundColor: '#2786b3',
                borderRadius: '50%',
                boxShadow: '20px 20px 50px grey',

            },
            iconTheme: {
                primary: 'white',
                secondary: '#2786b3',
            },
        });
    };

    const verifyEmpetyField = () => {

        if (form.getValues('cnc') || form.getValues('machine') || form.getValues('thickness')) {
            setShowIcon(true);
            setShowTrashIcon(true);
        } else {
            setShowIcon(false);
            setShowTrashIcon(false);
        }
        verifyEmpetyForm();
    };

    const verifyEmpetyForm = () => {
        if (form.getValues('amount') || form.getValues('cnc') || form.getValues('machine') || form.getValues('thickness') || form.getValues('item') || form.getValues('odf') || form.getValues('prefix') || form.getValues('qtd') || form.getValues('result') || form.getValues('version')) {
            setShowTrashIcon(true);
        } else {
            setShowTrashIcon(false)
        }
    };

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
                                                <div className='flex absolute gap-5 gap-y-4 ml-3 '>
                                                    {showTrashIcon && !inspectionData?.id ?
                                                        <div
                                                            onClick={() => clearForm()}
                                                            className='cursor-pointer'
                                                        >
                                                            <Button type='reset' size='icon' variant='outline'>
                                                                <Trash2 size={20} color='red' />
                                                            </Button>
                                                        </div> : <div></div>
                                                    }
                                                    <div className=''>
                                                        {showIcon && !inspectionData?.id ?
                                                            <Button
                                                                type='button'
                                                                size='icon'
                                                                variant='outline'
                                                                disabled={true}
                                                                className={`brightness-200`}
                                                                hidden={false}

                                                            >
                                                                <AlertOctagon color='#0ba3a1' size={20} className='animate-pulse' />
                                                            </Button>
                                                            : <div></div>
                                                        }

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
                                                            <FormControl
                                                                onChange={verifyEmpetyField}
                                                            >
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
                                                                onChange={verifyEmpetyField}
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
                                                            >
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                    defaultValue={field.value}
                                                                    onOpenChange={verifyEmpetyField}
                                                                >
                                                                    <SelectTrigger className="w-[150px]">
                                                                        <SelectValue placeholder="Selecione a maquina" />
                                                                    </SelectTrigger >
                                                                    <SelectContent>
                                                                        <SelectGroup >
                                                                            <SelectItem value="MT300">MT300A</SelectItem>
                                                                            <SelectItem value="HPE">MT300B</SelectItem>
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
                                                            <FormLabel className='truncate'>Inspecionado:</FormLabel>
                                                            <FormControl
                                                                onChange={verifyEmpetyField}
                                                            >
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
                                            onClick={() => {

                                            }}
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