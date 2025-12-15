import axios from 'axios';
import Image from 'next/image';
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
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';
import Compressor from 'compressorjs';
import { RiseLoader } from 'react-spinners';
import { Tip } from './ui/tip';
import { loadUniquePlateRegister } from '@/actions/load';
import { useEditForm } from '@/hooks/use-edit-form';


const formSchema = z.object({
    id: z.string().default(''),
    item: z.string().min(4),
    supplier: z.string().min(2),
    lot: z.string().min(2),
    invoice: z.string().min(1),
    rir: z.string().min(1),
    hbOne: z.string().min(1),
    hbTwo: z.string().min(1),
    hbThree: z.string().min(1),
    inspector: z.string().min(3, { message: 'Atualize a pagina' }),
    images: z.any(z.any()),
    imagesOldName: z.any().default([]),
    originalInspector: z.any(),
});

type SteelPlateFormValues = z.infer<typeof formSchema>;

interface FormPressProps {
    tab: string;
    id: string;
}

const FormSteelPlate: React.FC<FormPressProps> = ({ tab, id }) => {
    const form = useForm<SteelPlateFormValues>({
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();
    const { data: session } = useSession();
    const [inspectionData, setInspectionData] = useState([] as any);
    const [inspetorName, setInspectorName] = useState('');
    const [base64, setBase64] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleEditForm = useEditForm();

    const handleData = async (id: string) => {
        if (id.length > 2 && handleEditForm.tab === tab) {
            await loadUniquePlateRegister(id)
                .then((response) => {
                    setInspectionData(response);
                    if (inspectionData) {
                        setBase64(response[0]?.base64);
                        form.setValue('item', response[0].item.slice(3, response[0].item.length));
                        form.setValue('supplier', response[0].supplier);
                        form.setValue('lot', response[0].lot);
                        form.setValue('invoice', response[0].invoice);
                        form.setValue('rir', response[0].rir);
                        form.setValue('hbOne', response[0].hbOne);
                        form.setValue('hbTwo', response[0].hbTwo);
                        form.setValue('hbThree', response[0].hbThree);
                        form.setValue('images', response[0]?.base64 as any);
                        form.setValue('id', response[0].id);
                        form.setValue('imagesOldName', response[0].images);
                        form.setValue('originalInspector', response[0].isnpector);
                    }
                });
        }
    }

    const handleDrop = useCallback(async (files: any) => {
        const file = files[0];
        let array = [] as any;
        let compressedImages = [] as any;
        try {
            for (let i = 0; i < files.length; i++) {
                const readerPreviwe = new FileReader();
                readerPreviwe.readAsDataURL(files[i]);
                readerPreviwe.onload = (e) => {
                    array.push(e?.target?.result)
                }
                setBase64(array);
            };
            for (let i = 0; i < files.length; i++) {
                new Compressor(files[i], {
                    quality: 0.4,
                    success: async (compressedFile) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(compressedFile);
                        reader.onload = async (e) => {
                            compressedImages.push(e?.target?.result)
                            setCompressedImages(compressedImages);
                        }
                        /* compressedImages.push(compressedFile)
                        setCompressedImages(compressedImages); */
                    },
                });
            }

        } catch (error) {
            console.log(error);
        }
    }, [setBase64, setCompressedImages]);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        disabled: isLoading,
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
        },
        maxFiles: 5,
    });

    useEffect(() => {
        handleData(id);
        setInspectorName(session?.user?.name ? session?.user?.name : 'No isnpector name');
        form.setValue('inspector', inspetorName);
    }, [setInspectorName, session, inspetorName, form, id]);

    const onSubmit = async (formData: SteelPlateFormValues) => {
        try {

            if (base64.length < 1) {
                toast.error('Carregue as imagens!!!', {
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
            } else {
                setIsLoading(true);
                if (inspectionData.length > 0) {
                    const res = await axios.post('/api/edit/plate', formData);
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
                    setInspectionData([]);
                } else {
                    setIsLoading(true);
                    const res = await axios.post('/api/register/plate', formData);
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
                }
                form.setValue('item', '');
                form.setValue('supplier', '');
                form.setValue('lot', '');
                form.setValue('invoice', '');
                form.setValue('lot', '');
                form.setValue('rir', '');
                form.setValue('hbOne', '');
                form.setValue('hbTwo', '');
                form.setValue('hbThree', '');
                setBase64([]);
                setCompressedImages([]);
                handleEditForm.clearData();
            }
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
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const setPhotos = () => {
        if (compressedImages.length < 1) {
            form.setValue('images', base64)
            console.log('base64 image was seted');

        } else {
            form.setValue('images', compressedImages)
            console.log('compressed image was seted')
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
                                        <Badge className="p-1 text-2xl truncate">
                                            Chapas
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
                                                <div className='pt-10 mr-1'>

                                                    CH.
                                                </div>
                                                <div className='flex gap-x-2'>
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
                                                    <FormField
                                                        control={form.control}
                                                        name='supplier'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Fornecedor:</FormLabel>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        value={field.value}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-[150px]">
                                                                            <SelectValue placeholder="Fornecedor" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectItem value="Shandoing">Shandoing</SelectItem>
                                                                                <SelectItem value="Usiminas">Usiminas</SelectItem>
                                                                                <SelectItem value="Panatlantica">Panatlantica</SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <FormField
                                                    control={form.control}
                                                    name='lot'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Lote:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='text' placeholder='_,_,_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='invoice'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nota fiscal:</FormLabel>
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
                                                    name='rir'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>RIR:</FormLabel>
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
                                                    name='hbOne'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='hbTwo'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='hbThree'
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className='flex justify-center pt-[10px]'><Badge variant='destructive'>HB:</Badge></FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    className='text-center '
                                                                    type='number'
                                                                    placeholder='_,_'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='pt-'>
                                    <section
                                        className="
                                            flex
                                            justify-around
                                            border-dashed 
                                            border-2 
                                            p-3
                                            border-red-500
                                            rounded-lg
                                            shadow-lg shadow-red-900/50
                                            hover:shadow-md hover:shadow-red-300/50
                                        ">
                                        <div {...getRootProps({ className: 'dropzone' })}>
                                            <input {...getInputProps()} />
                                            {/*   <FormField
                                                control={form.control}
                                                name='images'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                className=''
                                                                id='pictures'
                                                                type='file'
                                                                multiple
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            
                                                */}
                                            <div className='flex justify-center align-middle items-center'>
                                                <Tip
                                                    message='Carregar imagens'
                                                    content={
                                                        <ImagePlus size={46} />
                                                    }
                                                />
                                                <div className='animate-pulse'>
                                                    {5 - base64.length < 1 ? "" : `+${5 - base64.length}`}
                                                </div>
                                            </div>
                                        </div>
                                        <aside>
                                            <ul className='flex justify-center align-middle items-center'>
                                                {
                                                    base64.map((img, index) => (
                                                        <Image
                                                            className='m-1 aspect-square object-cover rounded hover:scale-150 transition'
                                                            key={index}
                                                            src={img}
                                                            height={38}
                                                            width={38}
                                                            alt='uploaded image'
                                                        />
                                                    ))
                                                }
                                            </ul>
                                        </aside>
                                    </section>
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
                                                        onClick={() => {
                                                            setPhotos();

                                                        }}
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
                                            disabled={isLoading}
                                            type='submit'
                                            className='flex w-[320px] '
                                            onClick={() => {
                                                form.setValue('id', '11');
                                                form.setValue('originalInspector', '11');
                                                setPhotos();
                                            }}
                                        >
                                            {isLoading ? <div><RiseLoader color="#f5f7fa" size={5} /></div> : 'Registrar'}
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

export default FormSteelPlate;