
import { DrawerPatter } from "../drawer-patter";
import { useReporDrawer } from "@/hooks/use-drawer-report";
import { Button } from "../ui/button";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import ReportTitle from "../report-title";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ShieldCheck } from 'lucide-react'
import { useSession } from "next-auth/react";
import { loadUniquePressRegister, loadUniqueReportRegister } from "@/actions/load";
import { GridLoader } from "react-spinners";
import { format, set } from "date-fns";
import FeaturesControlReport from "../features-control-reporty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import toast from "react-hot-toast";


const formSchema = z.object({
    id: z.string().default(''),
    itemId: z.string().default(''),
    reportStatus: z.string().default(''),
    status: z.string().min(1),
});

type ReportFormValues = z.infer<typeof formSchema>;

export function DrawerRepor() {
    const ref = useRef<HTMLDivElement | null>(null);
    const handleDrawer = useReporDrawer();
    const { data: session, status } = useSession();
    const [inspectionData, setInspectionData] = useState<any>([]);
    const [show, setShow] = useState<boolean>(true);
    const [closed, setClosed] = useState<boolean>(true);
    const [reportData, setReportData] = useState<any>();
    const form = useForm<ReportFormValues>({
        resolver: zodResolver(formSchema),
    });

    const DownloadReport = () => {
        setShow(false);
        const interval = setInterval(() => {
            generatePDF(ref, options)
            setShow(true);
            clearInterval(interval);
        }, 1000);
    };

    const endReport = async () => {
        try {
            setClosed(false);
            form.setValue('reportStatus', 'rs');
            form.setValue('status', 'closed');
            form.setValue('id', handleDrawer.id.id!);
            await axios.post('/api/register/report', form);
            toast.success('Relatorio finalizado!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#109c2e',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#109c2e',
                },
            });
        } catch (error) {
            setClosed(true)
            toast.error('Este relatio está finalizado!!!', {
                style: {
                    border: '3px solid white',
                    color: 'white',
                    backgroundColor: '#a80a1f',
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#a80a1f',
                },
            });
        }
    };

    const options: Options = {
        filename: `relatorio-${inspectionData.item}.pdf`,
        method: "save",
        resolution: Resolution.NORMAL,
        page: {
            margin: Margin.LARGE,
            format: "letter",
            orientation: "portrait"
        },
        canvas: {
            mimeType: "image/jpeg",
            qualityRatio: 1
        },
        overrides: {
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        }
    };

    useEffect(() => {
        if (handleDrawer.id !== "") {
            loadUniquePressRegister(handleDrawer?.id.id!).then((res) => {
                setInspectionData(res);
            });
        }

         loadUniqueReportRegister(handleDrawer.id.id!)
            .then((res) => {
                setReportData(res);
            }); 
    }, [handleDrawer.id]);

    if (status === "loading" && !inspectionData) {
        return (
            <>
                <div className="flex justify-center p-10">
                </div>
                <div className="flex h-5/6 justify-center items-center">
                    <GridLoader color="#9e0837" size={100} />
                </div>
            </>
        )
    };

    return (
        <>
            <div className="">
                <DrawerPatter
                    isOpen={handleDrawer.isOpen}
                    onClose={handleDrawer.onClose}
                >
                    <ScrollArea className="flex justify-center items-center h-[55rem] m-auto ">
                        <div className="flex m-auto ">
                            <div ref={ref}>
                                <div className="border border-spacing-4 w-[40rem]  bg-zinc-50 dark:bg-zinc-900">
                                    <div
                                        className=" ">
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
                                            value={inspectionData.item}
                                        />
                                        <ReportTitle
                                            name="Amostras"
                                            value="5"
                                        />
                                    </div>
                                    <div className="flex justify-between mx-10">
                                        <ReportTitle
                                            name="Revisão"
                                            value={inspectionData.version}
                                        />
                                        <ReportTitle
                                            name="Resultado"
                                            value={inspectionData.result}
                                        />
                                    </div>
                                    <div className="flex justify-between mx-10">
                                        <ReportTitle
                                            name="Data"
                                            value={!inspectionData.createdAt ? '' : format(new Date(inspectionData.createdAt), "dd/MM/yyyy")}
                                        />
                                        <ReportTitle
                                            name="ODF"
                                            value={inspectionData.odf}
                                        />
                                    </div>
                                    <div className="shadow-lg rounded-lg mx-10 my-1 ">
                                        <div className="flex justify-center font-bold text-sm dark:bg-zinc-900 bg-zinc-50 p-2">
                                            CARACTERISTICAS DE CONTROLE
                                        </div>
                                        <Separator />
                                        <div className="w-full flex justify-center items-center bg-white dark:bg-zinc-800">

                                            <FeaturesControlReport show={show} />

                                        </div>
                                    </div>
                                    <Card className="mx-10 my-5 boder shadow-lg">
                                        <CardHeader>
                                            <CardTitle>
                                                <div className="flex justify-between items-center">
                                                    <div className="">Certificamos que esta peça foi produzida e inspecionada, estando em conformidade com todos os requisitos de qualidade especificados.</div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="text-yellow-400 mt-2 flex items-center">Garantia de qualidade <ShieldCheck /></div>
                                                    <div className="mt-2 text-sm font-normal">Rev00 00/00</div>
                                                </div>
                                                <div className="flex mt-2 items-center">
                                                    <div>Inspetor:&nbsp; </div>
                                                    <div className="font-normal text-sm "> {session?.user?.name}</div>
                                                </div>
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                    <br></br>
                                </div>
                                <div className="flex justify-center items-center">
                                    {show && (
                                        <>
                                            <div className="p-2">
                                                <Button onClick={() => {
                                                    DownloadReport();
                                                }}>
                                                    Baixar relatorio
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                    {show ?
                                         reportData?.status !== "closed" && (
                                            <div className="p-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        endReport();
                                                    }}>
                                                    Finalizar relatorio
                                                </Button>
                                            </div>
                                        )
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </DrawerPatter>
            </div>
        </>
    )
};

