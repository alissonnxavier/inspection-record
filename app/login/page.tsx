'use client';

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { setCookie } from '@/actions/set-cookies';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(4),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface FormLoginProps {
  tab: string;
}

const LoginForm: React.FC<FormLoginProps> = ({ tab }) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });

  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [block, setBlock] = useState(false);

  const handleCookies = () => {
    //setCookie();
  }

  useEffect(() => {
    handleCookies();
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      signIn("credentials", {
        email: form.getValues('email'),
        password: form.getValues('password'),
        redirect: false,
        callbackUrl: '/'
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (event: any) => {

    try {
      setBlock(true);
      const res = await signIn("credentials", {
        email: form.getValues('email'),
        password: form.getValues('password'),
        redirect: false,
        callbackUrl: '/'
      });

      if (res?.error) {
        console.error('invalid credentials');
        toast.error('Algo deu errado, verifique seu E-mail e senha.', {
          style: {
            border: '3px solid white',
            color: 'white',
            backgroundColor: '#870921',
            boxShadow: '20px 20px 50px grey',

          },
          iconTheme: {
            primary: 'white',
            secondary: '#870921',
          },
        });

        return null;
      }

      toast.success('Login realizado com sucesso!', {
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

    } catch (error) {
      console.log(error);
    } finally {
      setBlock(false);
    }
  }

  const signInGoogle = () => {
    signIn("google");
  }

  const signInGithub = () => {
    signIn("github");
  }

  if (status === "loading") {
    return (
      <div className="flex h-5/6 justify-center items-center">
        {/* <GridLoader color="#9e0837" size={100} />  */}
      </div>
    )
  }
  if (status === 'authenticated') {
    redirect('/');
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='h-screen flex items-center justify-center align-middle'>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Faça login para salvar as inspeçoẽs.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex justify-around'>
                  <Button
                    onClick={() => signInGoogle()}
                    variant='outline'
                    className='gap-2 px-8'
                  >
                    <Icons.google className='w-5 h-5' />
                    Google
                  </Button>
                  <Button
                    onClick={() => signInGithub()}
                    variant='outline'
                    className='gap-2 px-8'
                  >
                    <Icons.gitHub className='h-5 w-5' />
                    Github
                  </Button>
                </div>
                <Separator className='my-4' />

                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email:</FormLabel>
                          <FormControl>
                            <Input
                              type='email' placeholder='Email' {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha:</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder='password'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button

                  type='submit'
                  className=''
                >
                  Entrar
                </Button>
              </CardFooter>
            </Card>
          </div >
        </form>
      </Form>
    </>
  )
}

export default LoginForm;