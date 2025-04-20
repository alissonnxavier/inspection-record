'use client';

import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { verifyAdmin } from '@/actions/verify-admin';
import { useCardModal } from '@/hooks/use-card-modal';
import { GridLoader } from 'react-spinners';

const formSchema = z.object({
    name: z.string().min(3),
    email: z.string().email().min(3),
    password: z.string().min(4),
});

type RegisterUserFormValues = z.infer<typeof formSchema>;

interface FormLoginProps {

}

const RegisterForm: React.FC<FormLoginProps> = () => {
    const form = useForm<RegisterUserFormValues>({
        resolver: zodResolver(formSchema),
    });

    const { data: session, status } = useSession();
    const router = useRouter();
    const [block, setBlock] = useState(false);
    const [admin, setAdmin] = useState(true);

    const rumVerify = async () => {
        const bool = await verifyAdmin(session?.user?.email);
        return bool;
    }
    const handleCardModal = useCardModal();

    useEffect(() => {
        rumVerify().then((res) => {
            if (res === 'true') {
                setAdmin(true);
            }
        })
    }, [session]);

    const handleSubmit = async (data: RegisterUserFormValues) => {
        if (admin) {
            try {
                setBlock(true);
                const res = await axios.post("/api/register/user", data);
                toast.success('Usuario criado com sucesso!', {
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
                form.setValue('name', '');
                form.setValue('email', '');
                form.setValue('password', '')
            } catch (error) {
                toast.error('Impossivel criar, este e-mail ja esta em uso.', {
                    style: {
                        border: '3px solid white',
                        padding: '30px',
                        color: 'white',
                        backgroundColor: '#870921',
                        borderRadius: '50%',
                        boxShadow: '20px 20px 50px grey',

                    },
                    iconTheme: {
                        primary: 'white',
                        secondary: '#870921',
                    },
                });
                console.log(error);
            } finally {
                setBlock(false);
            }
        } else {
            toast.error('Você nao tem permissão para fazer isso.', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#870921',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#870921',
                },
            });
        }
    }

    if (status === "loading") {
        return (
            <div className="flex h-5/6 justify-center items-center">
                {<GridLoader color="#9e0837" size={100} />}
            </div>
        )
    }

    if (status != 'authenticated') {
        redirect('/login');
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className='pb-3 '>
                        <div className="w-full  ">
                            <div className="flex justify-end space-y-1.5 ">
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-x-2'>
                                            <FormLabel>Nome:</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='focus-visible:ring-0 focus:border-lime-400 '
                                                    type='name'
                                                    placeholder='Nome'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex space-y-1.5 justify-end">
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-x-2'>
                                            <FormLabel>Email:</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='focus-visible:ring-0 focus:border-lime-400'
                                                    type='email'
                                                    placeholder='Email'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-end space-y-1.5 ">
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-x-2'>
                                            <FormLabel>Senha:</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className='focus-visible:ring-0 focus:border-lime-400'
                                                    type='password'
                                                    placeholder='Senha'
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex items-center gap-3 justify-end mt-3'>
                                <Button
                                    type="button"
                                    variant='destructive'
                                    className='mr-5'
                                    onClick={() => { handleCardModal.onClose() }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    disabled={block || !admin}
                                    type='submit'
                                    className='hover:bg-green-900 hover:text-green-300 hover:border-lime-200'
                                    variant='outline'
                                >
                                    Criar usuário
                                </Button>
                            </div>
                        </div>
                    </div >
                </form>
            </Form>

        </>
    )
}

export default RegisterForm;