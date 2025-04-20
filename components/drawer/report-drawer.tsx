import { DrawerPatter } from "../drawer-patter";
import { useReporDrawer } from "@/hooks/use-drawer-report";
import { Button } from "../ui/button";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { useRef } from "react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import ReportTitle from "../report-title";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ShieldCheck } from 'lucide-react'
import { Input } from "../ui/input";

const options: Options = {
    filename: "advanced-example.pdf",
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.NORMAL,
    page: {
        // margin is in MM, default is Margin.NONE = 0
        margin: Margin.LARGE,
        // default is 'A4'
        format: "letter",
        // default is 'portrait'
        orientation: "portrait"
    },
    canvas: {
        // default is 'image/jpeg' for better size performance
        mimeType: "image/jpeg",
        qualityRatio: 1
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
        // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
        pdf: {
            compress: true
        },
        // see https://html2canvas.hertzen.com/configuration for more options
        canvas: {
            useCORS: true
        }
    }
}


export function DrawerRepor() {

    //const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });
    const ref = useRef();

    const handleDrawer = useReporDrawer();
    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <div className="flex m-auto">


                <div ref={ref}>
                    <div className="border border-spacing-4  w-[40rem] bg-zinc-50 dark:bg-zinc-900">
                        <div
                            className="
                             
                              
                            ">
                            <Card className="mx-10 my-5 boder shadow-lg">
                                <CardHeader>
                                    <CardTitle>
                                        <div className="flex justify-between items-center">
                                            <div className="text-3xl">RELATORIO DE QUALIDADE</div>
                                            <div><ShieldCheck size={60} /></div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="flex justify-between mx-10">
                            <ReportTitle
                                name="Item"
                                value="ME.00773"
                            />
                            <ReportTitle
                                name="Amostras"
                                value="5"
                            />
                        </div>
                        <div className="flex justify-between mx-10">
                            <ReportTitle
                                name="Revisão"
                                value="1"
                            />
                            <ReportTitle
                                name="Resultado"
                                value="Aprovado"
                            />
                        </div>
                        <div className="flex justify-between mx-10">
                            <ReportTitle
                                name="Data"
                                value="05/04/2023"
                            />
                            <ReportTitle
                                name="ODF"
                                value="554433"
                            />
                        </div>
                        <div className="shadow-lg rounded-lg mx-10 my-1 ">
                            <div className="flex justify-center font-bold text-sm dark:bg-zinc-900 bg-zinc-50 p-2">
                                CARACTERISTICAS DE CONTROLE
                            </div>
                            <Separator />
                            <div className="flex justify-between bg-white dark:bg-zinc-800">
                                <div className="p-2 text-sm">
                                    <div className="font-bold">DESCRIÇÃO</div>
                                    <div>Espessura(mm)</div>
                                    <div>Supeficie</div>
                                    <div>Cota 1</div>
                                    <div>Cota 2</div>
                                    <div>Cota 3</div>
                                    <div>Cota 4</div>
                                    <div>Cota 5</div>
                                    <div>Cota 6</div>
                                    <div>Cota 7</div>
                                    <div>Cota 8</div>
                                    <div>Cota 9</div>
                                    <div>Cota 10</div>
                                </div>
                                <div className="p-2 text-sm">
                                    <div className="font-bold">ESPECIFICADO</div>
                                    <div>1.5 (mm)</div>
                                    <div>-------</div>
                                    <Input
                                        className="w-20"
                                        
                                    />
                                    <div>Cota 1</div>
                                    <div>Cota 2</div>
                                    <div>Cota 3</div>
                                    <div>Cota 4</div>
                                    <div>Cota 5</div>
                                    <div>Cota 6</div>
                                    <div>Cota 7</div>
                                    <div>Cota 8</div>
                                    <div>Cota 9</div>
                                    <div>Cota 10</div>
                                </div>
                                <div className="p-2 text-sm">
                                    <div className="font-bold">ENCONTRADO</div>
                                    <div>1.5 (mm)</div>
                                    <div>Oleado</div>
                                    <div>Cota 1</div>
                                    <div>Cota 2</div>
                                    <div>Cota 3</div>
                                    <div>Cota 4</div>
                                    <div>Cota 5</div>
                                    <div>Cota 6</div>
                                    <div>Cota 7</div>
                                    <div>Cota 8</div>
                                    <div>Cota 9</div>
                                    <div>Cota 10</div>
                                </div>
                            </div>
                        </div>
                        <Card className="mx-10 my-5 boder shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex justify-between items-center">
                                        <div className="">Certificamos que esta peça foi produzida e inspecionado, estando em conformidade com todos os requisitos de qualidade especificados</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="text-yellow-400 mt-2 flex items-center">Garantia de qualidade <ShieldCheck /></div>
                                        <div className="mt-2 text-sm font-normal">Rev00 00/00</div>
                                    </div>
                                    <div className="flex mt-2 items-center">
                                        <div>Inspetor: </div>
                                        <div className="font-normal text-sm ">Alisson Xavier</div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                        <br></br>
                    </div>
                </div>
            </div>
            <Button onClick={() => { generatePDF(ref, options) }} >
                Download
            </Button>
        </DrawerPatter>
    )
};

