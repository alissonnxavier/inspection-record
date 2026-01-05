import React from 'react';
import { useDrawerNcSeeMore } from "@/hooks/use-nc-see-more-drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import toast from 'react-hot-toast';
import { useEffect, useState } from "react";
import { loadUniqueNcRegister } from "@/actions/load";
import { GridLoader } from "react-spinners";
import { ScrollArea } from './ui/scroll-area';

export const NcSeeMorePage = () => {

    const handleDrawer = useDrawerNcSeeMore();
    const [nc, setNc] = useState<any>(null);

    const copyToClipboard = (fieldId: string, fieldName: string) => {
        const element = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement
        if (element && element.value) {
            navigator.clipboard.writeText(element.value)

            toast.success(`${fieldName} copied to clipboard`,)
        }
    };

    useEffect(() => {
        if (handleDrawer.id) {
            loadUniqueNcRegister(handleDrawer.id)
                .then((data) => setNc(data))
        };
    }, [handleDrawer.id]);

    console.log(nc)

    if (!nc) {
        return (
            <>
                <div className="w-full flex h-5/6 justify-center items-center">
                    <GridLoader color="#9e0837" size={100} />
                </div>
            </>
        )
    }

    return (
        <div className='w-full'>
            <div className="flex flex-row justify-center items-center w-full">
                <ScrollArea className="h-[50rem] mt-4">
                    <div className=' flex sm:flex-col md:flex-row  lg:flex-row xl:flex-row 2xl:flex-row justify-center items-start p-4 gap-4'>
                        <Card className="w-96 max-w-4xl mr-4">
                            <CardHeader className="bg-accent ">
                                <CardTitle className="text-2xl font-bold text-foreground">Manufacturing Quality Report</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="item" className="text-sm font-bold uppercase text-foreground">
                                                Item
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.item} id="item" placeholder="Enter item name" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("item", "Item")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="revision" className="text-sm font-bold uppercase text-foreground">
                                                Revision
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.version} id="revision" placeholder="Enter revision" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("revision", "Revision")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="sheet-thickness" className="text-sm font-bold uppercase text-foreground">
                                                Sheet Thickness
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.thickness} id="sheet-thickness" placeholder="Enter thickness" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("sheet-thickness", "Sheet Thickness")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="manufacturing-order" className="text-sm font-bold uppercase text-foreground">
                                                Manufacturing Order
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.odf} id="manufacturing-order" placeholder="Enter order number" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("manufacturing-order", "Manufacturing Order")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="order-quantity" className="text-sm font-bold uppercase text-foreground">
                                                Order Quantity
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    value={nc.amount}
                                                    id="order-quantity"
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    className="border-2 border-border"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("order-quantity", "Order Quantity")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="program-number" className="text-sm font-bold uppercase text-foreground">
                                                Program Number
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.cnc} id="program-number" placeholder="Enter program number" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("program-number", "Program Number")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="machine" className="text-sm font-bold uppercase text-foreground">
                                                Machine
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.machine} id="machine" placeholder="Enter machine name" className="border-2 border-border" />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("machine", "Machine")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="quantity-problem" className="text-sm font-bold uppercase text-foreground">
                                                Quantity with Problem
                                            </Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    value={nc.amountNc}
                                                    id="quantity-problem"
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    className="border-2 border-border"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    onClick={() => copyToClipboard("quantity-problem", "Quantity with Problem")}
                                                    className="shrink-0"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 mt-2">
                                        <Label htmlFor="report" className="text-sm font-bold uppercase text-foreground">
                                            Report
                                        </Label>
                                        <div className="flex gap-2 mt-1">
                                            <Textarea
                                                value={nc.report}
                                                id="report"
                                                placeholder="Enter detailed report..."
                                                className="min-h-32 border-2 border-border resize-none"
                                            />
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => copyToClipboard("report", "Report")}
                                                className="shrink-0"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="w-96">
                            <CardHeader className="bg-accent border-b-2 border-primary">
                                <CardTitle className="text-2xl font-bold text-foreground mt-4">Logbook</CardTitle>
                            </CardHeader>
                            <CardContent
                                className="p-6 mt-4"
                            >
                                <div className='flex'>
                                    <Textarea
                                        className="min-h-32 h-72 flex justify-center items-center m-auto"
                                        id='logbook'
                                        value={`Segregado ${nc?.amountNc} un do item ${nc?.item} devido ao seguinte problema: "${nc?.report}" ocorrido na maquina ${nc?.machine} ${nc?.cnc ? `com o programa ${nc?.cnc}` : ``}. da ordem de fabricação ${nc?.odf}. Espessura da chapa ${nc?.thickness}mm, revisão da peça ${nc?.version}. Quantidade total da ordem ${nc?.amount} unidades.`}
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => copyToClipboard("logbook", "Logbook")}
                                        className="shrink-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
