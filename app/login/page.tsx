'use client';

import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react';
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

const LoginForm = () => {

  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/')
  }

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.stopPropagation();

    try {
      const res = await signIn("credentials", {
        name,
        password,
        redirect: false,
      });

      if (res?.error) {
        console.error('invalid credentials');
        toast.error('Algo deu errado, verifique sua senha e email.', {
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
    }
  }

  return (
    <div className='h-screen flex items-center justify-center align-middle'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Fazer Login</CardTitle>
          <CardDescription>Faça login para fazer registros de inspeção.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type='text'
                  placeholder="Nome de usuario"
                  onChange={(e) => { setName(e.target.value) }}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Senha</Label>
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
          >
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginForm;