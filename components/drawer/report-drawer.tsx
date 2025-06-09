
import { DrawerPatter } from "../drawer-patter";
import { useReporDrawer } from "@/hooks/use-drawer-report";
import { Button } from "../ui/button";
import generatePDF, { Resolution, Margin, Options } from 'react-to-pdf';
import { ElementRef, useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import ReportTitle from "../report-title";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ShieldCheck } from 'lucide-react'
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useEventListener } from "usehooks-ts";
import { useSession } from "next-auth/react";
import { loadUniquePressRegister } from "@/actions/load";
import { GridLoader } from "react-spinners";
import { format } from "date-fns";
import { saveReport } from "@/actions/save";
import FeaturesControlReport from "../features-control-reporty";




export function DrawerRepor() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [divNumber, setDivNumber] = useState<number | null>(null);
    const [enable, setEnable] = useState<boolean>(false);
    const handleDrawer = useReporDrawer();
    const { data: session, status } = useSession();
    const [inspectionData, setInspectionData] = useState<any>([]);
    const [show, setShow] = useState<boolean>(true);

    const DownloadReport = () => {
        setShow(false);


        const interval = setInterval(() => {
            generatePDF(ref, options)
            setShow(true);

            clearInterval(interval);
        }, 1000);
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
    }, [handleDrawer.id]);

    console.log(inspectionData);
    console.log(handleDrawer.id);





    const [thickness, setThickness] = useState<string>('');
    const [surface, setSurface] = useState<string>('');
    const [cot1, setCot1] = useState<string>('');
    const [cot2, setCot2] = useState<string>('');
    const [cot3, setCot3] = useState<string>('');
    const [cot4, setCot4] = useState<string>('');
    const [cot5, setCot5] = useState<string>('');
    const [cot6, setCot6] = useState<string>('');
    const [cot7, setCot7] = useState<string>('');
    const [cot8, setCot8] = useState<string>('');
    const [cot9, setCot9] = useState<string>('');
    const [cot10, setCot10] = useState<string>('');

    const [especifiedThickness, setEspecifiedThickness] = useState<string>('');
    const [especifiedCot1, setEspecifiedCot1] = useState<string>('');
    const [especifiedCot2, setEspecifiedCot2] = useState<string>('');
    const [especifiedCot3, setEspecifiedCot3] = useState<string>('');
    const [especifiedCot4, setEspecifiedCot4] = useState<string>('');
    const [especifiedCot5, setEspecifiedCot5] = useState<string>('');
    const [especifiedCot6, setEspecifiedCot6] = useState<string>('');
    const [especifiedCot7, setEspecifiedCot7] = useState<string>('');
    const [especifiedCot8, setEspecifiedCot8] = useState<string>('');
    const [especifiedCot9, setEspecifiedCot9] = useState<string>('');
    const [especifiedCot10, setEspecifiedCot10] = useState<string>('');














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
            <div>
                <DrawerPatter
                    isOpen={handleDrawer.isOpen}
                    onClose={handleDrawer.onClose}
                >
                    <div className="flex m-auto">
                        <div ref={ref}>
                            <div className="border border-spacing-4 w-[40rem]  bg-zinc-50 dark:bg-zinc-900">
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
                            {show && (
                                <div className="p-2">
                                    <Button onClick={() => {
                                        DownloadReport();
                                    }}>
                                        Salvar relatorio
                                    </Button>
                                </div>
                            )}

                        </div>

                    </div>
                    {/*  <div className="w-full">
                        <Button>
                            save
                        </Button>
                    </div> */}
                </DrawerPatter>
            </div>
        </>
    )
};

