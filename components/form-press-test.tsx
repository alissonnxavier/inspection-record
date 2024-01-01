
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
import { Test } from "@prisma/client";
import * as z from 'zod';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    name: z.string().min(2),
})

type PressFormValues = z.infer<typeof formSchema>

interface PressFormProsp {
    initialData: Test | null;
}

export const FormTest: React.FC<PressFormProsp> = ({
    initialData
}) => {

    const form = useForm<PressFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
        }
    })

    const onSubmit = async (data: PressFormValues) => {
        try{
            await axios.post('/api/register', data)
            .then((response)=>{console.log(response)})
        }catch(error: any){
            console.log(error);
        }
     }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='yout name' {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type='submit'>
                                Enviar
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FormTest