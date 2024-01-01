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
import { Label } from "@/components/ui/label"
import {
    TabsContent,
} from "@/components/ui/tabs"
import { ToggleItems } from "./toggle-items"
import { ToggleResult } from "./toggle-result"
import { FormEvent, useCallback, useState } from "react";
import { Badge } from "./ui/badge";
import { Press } from "@prisma/client";
import * as z from 'zod';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { SelectValue } from './ui/select';
import {
    FontBoldIcon,
    FontItalicIcon,
    UnderlineIcon,
} from "@radix-ui/react-icons"

import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

const formSchema = z.object({
    item: z.string().min(4),
    version: z.string(),
    odf: z.string().min(6),
    amount: z.string().min(1),
    qtd: z.string().min(1),
    result: z.string().min(1),
    prefix: z.string().min(1),

});

type PressFormValues = z.infer<typeof formSchema>

interface FormPressProps {
    tab: string;
}

const FormPress: React.FC<FormPressProps> = ({ tab }) => {
    const router = useRouter();

    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data: PressFormValues) => {

        const res = await axios.post('/api/register', data)
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
                                            Rosqueadeira
                                        </Badge>
                                    </CardTitle>
                                    <div>
                                        <CardDescription>
                                            Formulario digital Rev: 00
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
                                                            <FormLabel>Versao:</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='number' placeholder='Versao do item' {...field}
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
                                                            <FormLabel>Quantida ODF:</FormLabel>
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
                                                            <FormLabel>Quantidade inspecionada:</FormLabel>
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
                                <div className='flex w-[390px] justify-center'>
                                <Button 
                                type='submit'
                                className='flex w-[370px]'
                                >
                                    Registrar
                                </Button>
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