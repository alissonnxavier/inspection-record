'use client'

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import toast from 'react-hot-toast';
import { Tip } from '@/components/ui/tip';
import { DoorOpen, List, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
    spl01_out1: z.string().nonempty("Obrigatório"),
    spl01_out2: z.string().nonempty("Obrigatório"),
    spl02_out1: z.string().nonempty("Obrigatório"),
    spl02_out2: z.string().nonempty("Obrigatório"),
    spl03_out1: z.string().nonempty("Obrigatório"),
    spl03_out2: z.string().nonempty("Obrigatório"),
    spl04_out1: z.string().nonempty("Obrigatório"),
    spl04_out2: z.string().nonempty("Obrigatório"),
    spl05_out1: z.string().nonempty("Obrigatório"),
    spl05_out2: z.string().nonempty("Obrigatório"),
    spl06_out1: z.string().nonempty("Obrigatório"),
    spl06_out2: z.string().nonempty("Obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

const eurocardRows = [
    { id: 'spl01', label: 'SPL 01' },
    { id: 'spl02', label: 'SPL 02' },
    { id: 'spl03', label: 'SPL 03' },
    { id: 'spl04', label: 'SPL 04' },
    { id: 'spl05', label: 'SPL 05' },
    { id: 'spl06', label: 'SPL 06' },
];

const inputSequence: string[] = [];
eurocardRows.forEach(row => {
    inputSequence.push(`${row.id}_out1`);
    inputSequence.push(`${row.id}_out2`);
});

const FormEurocard = () => {
    // Captura parâmetro da Ordem de Fabricação (OF) enviado pela URL
    const searchParams = useSearchParams();
    const ofParam = searchParams.get('of') || '';

    // Estado local para guardar/editar a OF
    const [ordemFabricacao, setOrdemFabricacao] = useState<string>(ofParam);

    // Estado para armazenar o número do próximo módulo
    const [moduloNum, setModuloNum] = useState<number | string>('...');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            spl01_out1: '', spl01_out2: '',
            spl02_out1: '', spl02_out2: '',
            spl03_out1: '', spl03_out2: '',
            spl04_out1: '', spl04_out2: '',
            spl05_out1: '', spl05_out2: '',
            spl06_out1: '', spl06_out2: '',
        }
    });

    // Função para buscar o número sequencial do banco de dados filtrado por OF
    const fetchProximoNumero = useCallback(async (ofTarget?: string) => {
        const targetOF = ofTarget !== undefined ? ofTarget : ordemFabricacao;

        if (!targetOF.trim()) {
            setModuloNum(1); // Se não tiver OF preenchida, assume 1 por padrão
            return;
        }

        try {
            const response = await axios.get('/api/register/eurocard', {
                params: { of: targetOF.trim().toUpperCase() }
            });
            setModuloNum(response.data.proximoNumero);
        } catch (error) {
            console.error("Erro ao carregar o número do módulo", error);
            setModuloNum('Erro');
        }
    }, [ordemFabricacao]);

    // Atualiza o estado da OF e refaz a busca se a URL mudar
    useEffect(() => {
        if (ofParam) {
            setOrdemFabricacao(ofParam);
            fetchProximoNumero(ofParam);
        } else {
            fetchProximoNumero();
        }
    }, [ofParam, fetchProximoNumero]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string,
        onChangeProps: (value: string) => void
    ) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        if (value.length === 3) value = value.charAt(0) + ',' + value.slice(1);

        onChangeProps(value);

        if (value.length === 4) {
            const currentIndex = inputSequence.indexOf(fieldName);
            if (currentIndex !== -1 && currentIndex < inputSequence.length - 1) {
                const nextFieldName = inputSequence[currentIndex + 1];
                const nextInput = document.querySelector(`input[name="${nextFieldName}"]`) as HTMLInputElement;
                if (nextInput) {
                    setTimeout(() => {
                        nextInput.focus();
                        nextInput.select();
                    }, 10);
                }
            }
        }
    };

    const onSubmit = async (data: FormValues) => {
        if (!ordemFabricacao.trim()) {
            toast.error("Por favor, informe a Ordem de Fabricação.");
            return;
        }

        try {
            const formattedData = {
                ordemFabricacao: ordemFabricacao.trim().toUpperCase(),
                moduloNum: Number(moduloNum), // Envia o número sequencial específico dessa OF
                spl01_out1: parseFloat(data.spl01_out1.replace(',', '.')),
                spl01_out2: parseFloat(data.spl01_out2.replace(',', '.')),
                spl02_out1: parseFloat(data.spl02_out1.replace(',', '.')),
                spl02_out2: parseFloat(data.spl02_out2.replace(',', '.')),
                spl03_out1: parseFloat(data.spl03_out1.replace(',', '.')),
                spl03_out2: parseFloat(data.spl03_out2.replace(',', '.')),
                spl04_out1: parseFloat(data.spl04_out1.replace(',', '.')),
                spl04_out2: parseFloat(data.spl04_out2.replace(',', '.')),
                spl05_out1: parseFloat(data.spl05_out1.replace(',', '.')),
                spl05_out2: parseFloat(data.spl05_out2.replace(',', '.')),
                spl06_out1: parseFloat(data.spl06_out1.replace(',', '.')),
                spl06_out2: parseFloat(data.spl06_out2.replace(',', '.')),
            };

            await axios.post('/api/register/eurocard', formattedData);

            toast.success(`Módulo ${moduloNum} salvo com sucesso para a ordem de fabricação ${ordemFabricacao.toUpperCase()}!`);
            form.reset();

            // Recarrega a contagem para o próximo módulo referente a ESTA mesma OF
            fetchProximoNumero(ordemFabricacao);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar os dados.");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 mb-12">
            <header className="flex items-center justify-between border-b border-border pb-4 z-10">
                <div className="print:hidden">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Salvar Módulo</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/eurocard/books">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ArrowLeft size={16} /> Voltar aos Books
                        </Button>
                    </Link>
                    <Link href="/" className="sm:ml-4 lg:ml-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200">
                        <DoorOpen size={30} /> Sair
                    </Link>
                </div>
            </header>

            <Card className="w-full max-w-3xl mx-auto mt-6">
                <CardHeader className="border-b border-border bg-muted/30">

                    {/* Exibição da Ordem de Fabricação (OF) vinculada */}

                    <CardTitle className="text-xl font-bold tracking-tight text-center uppercase pt-2">
                        MÓDULO {moduloNum}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Formulário de medição de atenuação (dB) por canal Eurocard
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="border border-border rounded-sm overflow-hidden text-sm">

                                {/* Cabeçalho da Tabela */}
                                <div className="grid grid-cols-12 border-b border-border font-bold text-center divide-x divide-border bg-muted/60">
                                    <div className="col-span-4 py-3 uppercase tracking-wider">Eurocard</div>
                                    <div className="col-span-4 py-3 uppercase tracking-wider">MÓDULO {moduloNum}</div>
                                    <div className="col-span-4 py-3 uppercase tracking-wider">dB</div>
                                </div>

                                {/* Corpo da Tabela */}
                                {eurocardRows.map((row, index) => {
                                    const fieldOut1 = `${row.id}_out1` as keyof FormValues;
                                    const fieldOut2 = `${row.id}_out2` as keyof FormValues;

                                    return (
                                        <div
                                            key={row.id}
                                            className={`grid grid-cols-12 divide-x divide-border ${index !== eurocardRows.length - 1 ? 'border-b border-border' : ''
                                                }`}
                                        >
                                            <div className="col-span-4 flex items-center justify-center font-semibold bg-muted/20">
                                                {row.label}
                                            </div>

                                            <div className="col-span-8 grid grid-rows-2 divide-y divide-border">

                                                {/* Linha OUT 1 */}
                                                <div className="grid grid-cols-8 divide-x divide-border">
                                                    <div className="col-span-4 flex items-center justify-center font-medium py-2">
                                                        OUT 1
                                                    </div>
                                                    <div className="col-span-4 p-1 flex items-center justify-center">
                                                        <FormField
                                                            control={form.control}
                                                            name={fieldOut1}
                                                            render={({ field }) => (
                                                                <FormItem className="w-full space-y-0">
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="text"
                                                                            inputMode="decimal"
                                                                            placeholder="0,00"
                                                                            onChange={(e) => handleInputChange(e, fieldOut1, field.onChange)}
                                                                            className="h-8 text-center border-none focus-visible:ring-1 focus-visible:ring-ring shadow-none bg-transparent"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage className="text-[10px] text-center mt-0.5" />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Linha OUT 2 */}
                                                <div className="grid grid-cols-8 divide-x divide-border">
                                                    <div className="col-span-4 flex items-center justify-center font-medium py-2">
                                                        OUT 2
                                                    </div>
                                                    <div className="col-span-4 p-1 flex items-center justify-center">
                                                        <FormField
                                                            control={form.control}
                                                            name={fieldOut2}
                                                            render={({ field }) => (
                                                                <FormItem className="w-full space-y-0">
                                                                    <FormControl>
                                                                        <Input
                                                                            {...field}
                                                                            type="text"
                                                                            inputMode="decimal"
                                                                            placeholder="0,00"
                                                                            onChange={(e) => handleInputChange(e, fieldOut2, field.onChange)}
                                                                            className="h-8 text-center border-none focus-visible:ring-1 focus-visible:ring-ring shadow-none bg-transparent"
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage className="text-[10px] text-center mt-0.5" />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>

                            <CardFooter className="p-0 pt-4 flex justify-end">
                                <Button type="submit" className="w-full sm:w-auto px-8">
                                    Salvar Módulo {moduloNum} {ordemFabricacao ? `(${ordemFabricacao})` : ''}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FormEurocard;