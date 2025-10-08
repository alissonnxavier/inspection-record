

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
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';
import Compressor from 'compressorjs';
import { RiseLoader } from 'react-spinners';
import { Tip } from './ui/tip';
import { useEditForm } from '@/hooks/use-edit-form';
import { loadUniqueSerigraphyRegister } from '@/actions/load';


const formSchema = z.object({
    id: z.string().default(''),
    prefix: z.string().min(1),
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(2),
    amount: z.string().min(1),
    inspected: z.string().min(1),
    result: z.string().min(1),
    inspector: z.string().min(3, { message: 'Atualize a pagina' }),
    images: z.any(z.any()),
    imagesOldName: z.any().default([]),
});

type SteelPlateFormValues = z.infer<typeof formSchema>;

interface FormPressProps {
    id: string;
    tab: string;
}

const FormSerigraphy: React.FC<FormPressProps> = ({ id, tab }) => {

    const form = useForm<SteelPlateFormValues>({
        resolver: zodResolver(formSchema),
    });
    const router = useRouter();
    const { data: session } = useSession();
    const [inspetorName, setInspectorName] = useState('');
    const [base64, setBase64] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleEditForm = useEditForm();
    const [inspectionData, setInspectionData] = useState([] as any);

    const handleData = async (id: string) => {
        if (id.length > 2 && handleEditForm.tab === tab) {
            await loadUniqueSerigraphyRegister(id)
                .then((response) => {
                    setInspectionData(response);
                    if (inspectionData[0]?.id?.length > 3) {
                        setBase64(response[0].base64);
                        form.setValue('id', response[0]?.id as string);
                        form.setValue('prefix', response[0]?.item.slice(0, 3));
                        form.setValue('item', response[0].item.slice(3, response[0].item.length));
                        form.setValue('version', response[0].version);
                        form.setValue('odf', response[0].odf);
                        form.setValue('amount', response[0].amount);
                        form.setValue('inspected', response[0].inspected);
                        form.setValue('result', response[0].result);
                        form.setValue('imagesOldName', response[0].images);
                        form.setValue('images', response[0].base64 as any);
                    }
                });
        }
    }

    const handleDrop = useCallback(async (files: any) => {
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
    }, [setInspectorName, session, form, id, inspectionData[0]?.id]);

    const onSubmit = async (formData: SteelPlateFormValues) => {
        try {
            if (base64.length < 1) {
                toast.error('Carregue as imagens!!!', {
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
            } else {
                setIsLoading(true);
                if (inspectionData.length > 0) {
                    const res = await axios.post('/api/edit/serigraphy', formData);
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
                    setInspectionData([]);
                } else {
                    const res = await axios.post('/api/register/serigraphy', formData);
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
                }
                form.setValue('item', '');
                form.setValue('version', '');
                form.setValue('odf', '');
                form.setValue('amount', '');
                form.setValue('inspected', '');
                form.setValue('result', '');
                form.setValue('images', '');
                setBase64([]);
                setCompressedImages([]);
                //handleEditForm.clearData();
            }
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
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const setPhotos = () => {
        if (compressedImages.length < 1) {
            form.setValue('images', base64)
        } else {
            form.setValue('images', compressedImages)
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
                                            Serigrafia
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
                                <div className="pt-0.5">
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
                                                                    <ToggleGroupItem size='sm' value="ME." aria-label="Toggle bold">
                                                                        ME.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem size='sm' value="PU." aria-label="Toggle bold">
                                                                        PU.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem size='sm' value="ENP." aria-label="Toggle bold">
                                                                        ENP.
                                                                    </ToggleGroupItem>
                                                                    <ToggleGroupItem size='sm' value="ER." aria-label="Toggle bold">
                                                                        ER.
                                                                    </ToggleGroupItem>
                                                                </ToggleGroup>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div className='flex gap-1'>
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
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
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
                                                                    type='number' placeholder='_,_,_,_' {...field}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='inspected'
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
                                            <div className='flex gap-2'>

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
                                <div className=''>
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

export default FormSerigraphy;