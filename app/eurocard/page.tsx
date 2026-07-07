'use client'

import { useEffect, useState } from 'react';
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
  // Estado para armazenar o número do próximo módulo vindo do banco
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

  // Função para buscar o número sequencial do banco de dados
  const fetchProximoNumero = async () => {
    try {
      const response = await axios.get('/api/register/eurocard');
      setModuloNum(response.data.proximoNumero);
    } catch (error) {
      console.error("Erro ao carregar o número do módulo", error);
      setModuloNum('Erro');
    }
  };

  // Carrega ao montar o componente na tela
  useEffect(() => {
    fetchProximoNumero();
  }, []);

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
    try {
      const formattedData = {
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

      toast.success(`Módulo ${moduloNum} salvo com sucesso!`);
      form.reset();

      // Atualiza o contador na tela automaticamente para o próximo número após salvar
      fetchProximoNumero();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar os dados.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border border-zinc-300 shadow-md">
      <CardHeader className="bg-zinc-50 border-b border-zinc-200">
        <CardTitle className="text-xl font-bold tracking-tight text-center uppercase">
          MÓDULO {moduloNum} {/* Exibe dinamicamente no Título */}
        </CardTitle>
        <CardDescription className="text-center">
          Formulário de medição de atenuação (dB) por canal Eurocard
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="border border-zinc-400 rounded-sm overflow-hidden text-sm">

              {/* Cabeçalho da Tabela Dinâmico */}
              <div className="grid grid-cols-12 bg-zinc-100 border-b border-zinc-400 font-bold text-center divide-x divide-zinc-400">
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
                    className={`grid grid-cols-12 divide-x divide-zinc-400 ${index !== eurocardRows.length - 1 ? 'border-b border-zinc-400' : ''
                      }`}
                  >
                    <div className="col-span-4 flex items-center justify-center font-semibold bg-zinc-50 text-zinc-700">
                      {row.label}
                    </div>

                    <div className="col-span-8 grid grid-rows-2 divide-y divide-zinc-400">

                      {/* Linha OUT 1 */}
                      <div className="grid grid-cols-8 divide-x divide-zinc-400">
                        <div className="col-span-4 flex items-center justify-center font-medium py-2 bg-white">
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
                                    className="h-8 text-center border-none focus-visible:ring-1 focus-visible:ring-zinc-400 shadow-none bg-transparent"
                                  />
                                </FormControl>
                                <FormMessage className="text-[10px] text-center mt-0.5" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Linha OUT 2 */}
                      <div className="grid grid-cols-8 divide-x divide-zinc-400">
                        <div className="col-span-4 flex items-center justify-center font-medium py-2 bg-white">
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
                                    className="h-8 text-center border-none focus-visible:ring-1 focus-visible:ring-zinc-400 shadow-none bg-transparent"
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
              <Button type="submit" className="w-full sm:w-auto px-8 bg-zinc-900 text-white hover:bg-zinc-800">
                Salvar Módulo {moduloNum}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormEurocard;