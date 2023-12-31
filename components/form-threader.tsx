'use client';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    TabsContent,
} from "@/components/ui/tabs"
import { ToggleItems } from "./toggle-items"
import { ToggleResult } from "./toggle-result"
import { useState } from "react";
import { Badge } from "./ui/badge";

interface FormPressProps {
    tab: string
}

const FormThreader: React.FC<FormPressProps> = ({ tab }) => {

    const [result, setResult] = useState('');
    const [prefix, setPrefix] = useState('');
    const [codeItem, setCodeItem] = useState('');
    const [odf, setOdf] = useState('');
    const [amount, setAmount] = useState('');
    const [version, setVersion] = useState('');
    const [quantityInspected, setQuantityInspected] = useState('');
    const [process, setProcess] = useState('');

    const handleSubmit = () => {
        /* heri place your code to send all data to api backend */
    }

    console.log(prefix, result, codeItem, odf, amount, version, quantityInspected);

    return (
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
                                Criação: 31/12/23
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex justify-between">
                        <div className="space-y-1 mb-4 ">
                            <Label htmlFor="name">Item: </Label>
                            <div className="flex justify-start">
                                <ToggleItems prefixResult={setPrefix} />
                                <Input
                                    required
                                    className="w-24"
                                    id="name"
                                    placeholder="00000"
                                    onChange={(e) => { setCodeItem(e.target.value) }}
                                    type="number"
                                />
                            </div>
                        </div>
                        <div>
                            <Label
                                htmlFor="username"
                                className=""
                            >
                                Revisao:
                            </Label>
                            <Input
                                id="username"
                                placeholder="_._"
                                min={6}
                                max={7}
                                className="w-16 mt-1"
                                type="number"
                                onChange={(e) => { setVersion(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between pb-4 space-y-1">
                        <div className="mt-1">
                            <Label htmlFor="username">Ordem de fabricação:</Label>
                            <Input
                                id="username"
                                placeholder="_._._._._._"
                                min={6}
                                max={7}
                                className="w-32"
                                type="number"
                                onChange={(e) => { setOdf(e.target.value) }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="username">Quantidade:</Label>
                            <Input
                                id="username"
                                placeholder="00"
                                min={6}
                                max={7}
                                className="w-24"
                                type="number"
                                onChange={(e) => { setAmount(e.target.value) }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="username">Processo:</Label>
                            <Select onValueChange={(value) => { setProcess(value)}}>
                                <SelectTrigger className="w-[105px]">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Rosca">Rosca</SelectItem>
                                        <SelectItem value="Escareado">Escareado</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="">
                            <Label htmlFor="username">Quantidade inspecionada:</Label>
                            <Input
                                id="username"
                                placeholder="_._"
                                min={6}
                                max={7}
                                className="w-44"
                                type="number"
                                onChange={(e) => { setQuantityInspected(e.target.value) }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-center mt-1">
                                <Label
                                    htmlFor="username"
                                    className=""
                                >
                                    Resultado:
                                </Label>
                            </div>
                            <div className="mt-1.5 ml-1">
                                <ToggleResult ResultValue={setResult} />
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit}>
                        Registrar
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default FormThreader