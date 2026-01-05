import React, { useEffect, useState } from 'react';
import { useDrawerNcSeeMore } from "@/hooks/use-nc-see-more-drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import toast from 'react-hot-toast';
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
            toast.success(`${fieldName} copied to clipboard`)
        }
    };

    useEffect(() => {
        if (handleDrawer.id) {
            loadUniqueNcRegister(handleDrawer.id)
                .then((data) => setNc(data));
        };
    }, [handleDrawer.id]);

    if (!nc) {
        return (
            <div className="w-full flex h-[80vh] justify-center items-center">
                <GridLoader color="#9e0837" size={50} />
            </div>
        )
    }

    return (
        <div className='w-full px-4 py-2'>
            <div className="flex flex-col justify-center items-center w-full">
                {/* Altura dinâmica: h-[calc(100vh-100px)] ajuda a manter o scroll dentro da tela */}
                <ScrollArea className="w-full h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] rounded-md border-none">
                    <div className='flex flex-col lg:flex-row gap-6 pb-10 justify-center items-start '>
                        
                        {/* Card Principal de Report */}
                        <Card className="w-full lg:max-w-3xl">
                            <CardHeader className="bg-accent">
                                <CardTitle className="text-xl md:text-2xl font-bold text-foreground text-center lg:text-left">
                                    Manufacturing Quality Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="item" className="text-sm font-bold uppercase text-foreground">Item</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.item} id="item" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("item", "Item")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="revision" className="text-sm font-bold uppercase text-foreground">Revision</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.version} id="revision" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("revision", "Revision")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="sheet-thickness" className="text-sm font-bold uppercase text-foreground">Sheet Thickness</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.thickness} id="sheet-thickness" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("sheet-thickness", "Sheet Thickness")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="manufacturing-order" className="text-sm font-bold uppercase text-foreground">Manufacturing Order</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.odf} id="manufacturing-order" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("manufacturing-order", "Manufacturing Order")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="order-quantity" className="text-sm font-bold uppercase text-foreground">Order Quantity</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.amount} id="order-quantity" type="number" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("order-quantity", "Order Quantity")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="program-number" className="text-sm font-bold uppercase text-foreground">Program Number</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.cnc} id="program-number" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("program-number", "Program Number")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="machine" className="text-sm font-bold uppercase text-foreground">Machine</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.machine} id="machine" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("machine", "Machine")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="quantity-problem" className="text-sm font-bold uppercase text-foreground">Quantity with Problem</Label>
                                            <div className="flex gap-2 mt-1">
                                                <Input value={nc?.amountNc} id="quantity-problem" type="number" readOnly className="border-2 border-border" />
                                                <Button size="icon" variant="outline" onClick={() => copyToClipboard("quantity-problem", "Quantity with Problem")} className="shrink-0">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 mt-2">
                                        <Label htmlFor="report" className="text-sm font-bold uppercase text-foreground">Report</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Textarea
                                                value={nc?.report}
                                                id="report"
                                                readOnly
                                                className="min-h-[120px] border-2 border-border resize-none"
                                            />
                                            <Button size="icon" variant="outline" onClick={() => copyToClipboard("report", "Report")} className="shrink-0">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card do Logbook */}
                        <Card className="w-full lg:w-96 shrink-0">
                            <CardHeader className="bg-accent border-b-2 border-primary">
                                <CardTitle className="text-2xl font-bold text-foreground">Logbook</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6">
                                <div className='flex gap-2'>
                                    <Textarea
                                        className="min-h-[250px] lg:h-72 w-full text-sm leading-relaxed"
                                        id='logbook'
                                        readOnly
                                        value={`Segregado ${nc?.amountNc} un do item ${nc?.item} devido ao seguinte problema: "${nc?.report}" ocorrido na maquina ${nc?.machine} ${nc?.cnc ? `com o programa ${nc?.cnc}` : ``}. da ordem de fabricação ${nc?.odf}. Espessura da chapa ${nc?.thickness}mm, revisão da peça ${nc?.version}. Quantidade total da ordem ${nc?.amount} unidades.`}
                                    />
                                    <Button size="icon" variant="outline" onClick={() => copyToClipboard("logbook", "Logbook")} className="shrink-0">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}