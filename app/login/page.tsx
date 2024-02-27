'use client';

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';

const LoginForm = () => {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [block, setBlock] = useState(false);

  const handleSubmit = async (event: any) => {
    event.stopPropagation();

    try {
      setBlock(true);
      const res = await signIn("credentials", {
        name,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (res?.error) {
        console.error('invalid credentials');
        toast.error('Algo deu errado, verifique sua senha e email.', {
          style: {
            border: '3px solid white',
            padding: '30px',
            color: 'white',
            backgroundColor: '#870921'

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
          padding: '30px',
          color: 'white',
          backgroundColor: '#109c2e'

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
    <div className='h-screen flex items-center justify-center align-middle'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Faça login para salvar as inspeçoẽs.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className='flex justify-around'>
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
          </div> */}
          {/* <Separator className='my-4' /> */}
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type='text'
                  placeholder="Digite o nome"
                  onChange={(e) => { setName(e.target.value) }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type='password'
                  placeholder="Digite a senha"
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleSubmit}
            disabled={block}
          >
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginForm;