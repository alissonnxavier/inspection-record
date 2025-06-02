
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


const options: Options = {
    filename: "advanced-example.pdf",
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

export function DrawerRepor() {

    const [divNumber, setDivNumber] = useState<number | null>(null);
    const [enable, setEnable] = useState<boolean>(false);
    const handleDrawer = useReporDrawer();
    const { data: session, status } = useSession();
    const [inspectionData, setInspectionData] = useState<any>([]);

    useEffect(() => {
        if (handleDrawer.id !== "") {
            loadUniquePressRegister(handleDrawer?.id.id!).then((res) => {
                setInspectionData(res);
            });
        }
    }, [handleDrawer.id]);

    console.log(inspectionData);
    console.log(handleDrawer.id);



    const ref = useRef<HTMLDivElement | null>(null);

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

    let array = [
        {
            "measurements": {
                "especifiedMeasurements": {
                    "cot1": especifiedCot1,
                    "cot2": especifiedCot2,
                    "cot3": especifiedCot3,
                    "cot4": especifiedCot4,
                    "cot5": especifiedCot5,
                    "cot6": especifiedCot6,
                    "cot7": especifiedCot7,
                    "cot8": especifiedCot8,
                    "cot9": especifiedCot9,
                    "cot10": especifiedCot10,
                },
                "foundMeasurements": {
                    "cot1": cot1,
                    "cot2": cot2,
                    "cot3": cot3,
                    "cot4": cot4,
                    "cot5": cot5,
                    "cot6": cot6,
                    "cot7": cot7,
                    "cot8": cot8,
                    "cot9": cot9,
                    "cot10": cot10,
                },
            },
        },
    ];

    const inputEspecifiedThickness = useRef<ElementRef<"input">>(null)
    const inputRefEspecified1 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified2 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified3 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified4 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified5 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified6 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified7 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified8 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified9 = useRef<ElementRef<"input">>(null);
    const inputRefEspecified10 = useRef<ElementRef<"input">>(null);

    const formRefThicknessEspecified = useRef<ElementRef<"form">>(null);
    const formRefEspecified1 = useRef<ElementRef<"form">>(null);
    const formRefEspecified2 = useRef<ElementRef<"form">>(null);
    const formRefEspecified3 = useRef<ElementRef<"form">>(null);
    const formRefEspecified4 = useRef<ElementRef<"form">>(null);
    const formRefEspecified5 = useRef<ElementRef<"form">>(null);
    const formRefEspecified6 = useRef<ElementRef<"form">>(null);
    const formRefEspecified7 = useRef<ElementRef<"form">>(null);
    const formRefEspecified8 = useRef<ElementRef<"form">>(null);
    const formRefEspecified9 = useRef<ElementRef<"form">>(null);
    const formRefEspecified10 = useRef<ElementRef<"form">>(null);

    const inputThickness = useRef<ElementRef<"input">>(null)
    const inputSurface = useRef<ElementRef<"input">>(null);
    const inputRefFound1 = useRef<ElementRef<"input">>(null);
    const inputRefFound2 = useRef<ElementRef<"input">>(null);
    const inputRefFound3 = useRef<ElementRef<"input">>(null);
    const inputRefFound4 = useRef<ElementRef<"input">>(null);
    const inputRefFound5 = useRef<ElementRef<"input">>(null);
    const inputRefFound6 = useRef<ElementRef<"input">>(null);
    const inputRefFound7 = useRef<ElementRef<"input">>(null);
    const inputRefFound8 = useRef<ElementRef<"input">>(null);
    const inputRefFound9 = useRef<ElementRef<"input">>(null);
    const inputRefFound10 = useRef<ElementRef<"input">>(null);

    const formRefThickness = useRef<ElementRef<"form">>(null);
    const formRefSurface = useRef<ElementRef<"form">>(null);
    const formRef1 = useRef<ElementRef<"form">>(null);
    const formRef2 = useRef<ElementRef<"form">>(null);
    const formRef3 = useRef<ElementRef<"form">>(null);
    const formRef4 = useRef<ElementRef<"form">>(null);
    const formRef5 = useRef<ElementRef<"form">>(null);
    const formRef6 = useRef<ElementRef<"form">>(null);
    const formRef7 = useRef<ElementRef<"form">>(null);
    const formRef8 = useRef<ElementRef<"form">>(null);
    const formRef9 = useRef<ElementRef<"form">>(null);
    const formRef10 = useRef<ElementRef<"form">>(null);

    const enableEditing = (number: number) => {
        if (number === 1) {
            inputRefFound1.current?.focus();
            inputRefFound1.current?.select();
        } else if (number === 2) {
            inputRefFound2.current?.focus();
            inputRefFound2.current?.select();
        } else if (number === 3) {
            inputRefFound3.current?.focus();
            inputRefFound3.current?.select();
        } else if (number === 4) {
            inputRefFound4.current?.focus();
            inputRefFound4.current?.select();
        } else if (number === 5) {
            inputRefFound5.current?.focus();
            inputRefFound5.current?.select();
        } else if (number === 6) {
            inputRefFound6.current?.focus();
            inputRefFound6.current?.select();
        } else if (number === 7) {
            inputRefFound7.current?.focus();
            inputRefFound7.current?.select();
        } else if (number === 8) {
            inputRefFound8.current?.focus();
            inputRefFound8.current?.select();
        } else if (number === 9) {
            inputRefFound9.current?.focus();
            inputRefFound9.current?.select();
        } else if (number === 10) {
            inputRefFound10.current?.focus();
            inputRefFound10.current?.select();
        }
    };

    const handleSubmit = () => {
        if (divNumber === 100) {
            toast.success(`Espessura encontrada salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 200) {
            toast.success(`Superficie encontrada salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 1) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 2) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 3) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 4) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 5) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 6) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 7) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 8) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 9) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 10) {
            toast.success(`Cota encontrada numero ${divNumber} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 1000) {
            toast.success(`Espessura especificada salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 21) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 22) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 23) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 24) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 25) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 26) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 27) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 28) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 29) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 30) {
            toast.success(`Cota especificada número ${divNumber - 20} salva!`);
            setDivNumber(null);
            setEnable(false);
        }
    };

    const onBlur = () => {
        if (divNumber === 100) {
            formRefThickness.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 200) {
            formRefSurface.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 1) {
            formRef1.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 2) {
            formRef2.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 3) {
            formRef3.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 4) {
            formRef4.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 5) {
            formRef5.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 6) {
            formRef6.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 7) {
            formRef7.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 8) {
            formRef8.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 9) {
            formRef9.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 10) {
            formRef10.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 1000) {
            formRefThicknessEspecified.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 21) {
            formRefEspecified1.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 22) {
            formRefEspecified2.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 23) {
            formRefEspecified3.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 24) {
            formRefEspecified4.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 25) {
            formRefEspecified5.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 26) {
            formRefEspecified6.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 27) {
            formRefEspecified7.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 28) {
            formRefEspecified8.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 29) {
            formRefEspecified9.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        } else if (divNumber === 30) {
            formRefEspecified10.current?.requestSubmit();
            setDivNumber(null);
            setEnable(false);
        }
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
            if (divNumber === 100) {
                formRefThickness.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 200) {
                formRefSurface.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 1) {
                formRef1.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 2) {
                formRef2.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 3) {
                formRef3.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 4) {
                formRef4.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 5) {
                formRef5.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 6) {
                formRef6.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 7) {
                formRef7.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 8) {
                formRef8.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 9) {
                formRef9.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 10) {
                formRef10.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 1000) {
                formRefThicknessEspecified.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 21) {
                formRefSurface.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 22) {
                formRef1.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 23) {
                formRef2.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 24) {
                formRef3.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 25) {
                formRef4.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 26) {
                formRef5.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 27) {
                formRef6.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 28) {
                formRef7.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 29) {
                formRef8.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            } else if (divNumber === 30) {
                formRef9.current?.requestSubmit();
                setDivNumber(null);
                setEnable(false);
            };
        };
    };
    useEventListener("keydown", onKeyDown);

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

    /*     const handleSaveReport = async () => {
            await saveReport(
                inspectionData.id,
                inspectionData.item,
                inspectionData.version,
                inspectionData.odf,
                inspectionData.amount,
                inspectionData.inspected,
                inspectionData.result,
                inspectionData.inspector,
                array,
            );
        }; */




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
                                            {divNumber !== 1000
                                                ? <div
                                                    onClick={() => {
                                                        setDivNumber(1000);
                                                        setEnable(true);
                                                        enableEditing(1000);
                                                    }} >
                                                    {especifiedThickness ? `${especifiedThickness} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRefThicknessEspecified}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 1000 && (
                                                        <>
                                                            <div className="flex">
                                                                <Input
                                                                    value={especifiedThickness}
                                                                    ref={inputEspecifiedThickness}
                                                                    onBlur={() => {
                                                                        onBlur()
                                                                    }}
                                                                    onChange={(e) => { setEspecifiedThickness(e.target.value) }}
                                                                    className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                    type="number"
                                                                />
                                                                <div className="text-xm text-muted-foreground">mm</div>
                                                            </div>
                                                        </>
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }
                                            <div className="font-bold">-------</div>
                                            <div className="text-sm">
                                                {divNumber !== 21
                                                    ? <div
                                                        onClick={() => {
                                                            setDivNumber(21);
                                                            setEnable(true);
                                                            enableEditing(21);
                                                        }} >
                                                        {especifiedCot1 ? `${especifiedCot1} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified1}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 21 && (
                                                            <Input
                                                                value={especifiedCot1}
                                                                ref={inputRefEspecified1}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot1(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 22
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(22);
                                                            setEnable(true);
                                                            enableEditing(22);
                                                        }} >
                                                        {especifiedCot2 ? `${especifiedCot2} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified2}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 22 && (
                                                            <Input
                                                                value={especifiedCot2}
                                                                ref={inputRefEspecified2}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot2(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}

                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 23
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(23);
                                                            setEnable(true);
                                                            enableEditing(23);
                                                        }} >
                                                        {especifiedCot3 ? `${especifiedCot3} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified3}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 23 && (
                                                            <Input
                                                                value={especifiedCot3}
                                                                ref={inputRefEspecified3}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot3(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}

                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 24
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(24);
                                                            setEnable(true);
                                                            enableEditing(24)
                                                        }} >
                                                        {especifiedCot4 ? `${especifiedCot4} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified4}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 24 && (
                                                            <Input
                                                                value={especifiedCot4}
                                                                ref={inputRefEspecified4}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot4(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 25
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(25);
                                                            setEnable(true);
                                                            enableEditing(25)
                                                        }} >
                                                        {especifiedCot5 ? `${especifiedCot5} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified5}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 25 && (
                                                            <Input
                                                                value={especifiedCot5}
                                                                ref={inputRefEspecified5}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot5(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 26
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(26);
                                                            setEnable(true);
                                                            enableEditing(26)
                                                        }} >
                                                        {especifiedCot6 ? `${especifiedCot6} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified6}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 26 && (
                                                            <Input
                                                                value={especifiedCot6}
                                                                ref={inputRefEspecified6}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot6(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }
                                                {divNumber !== 27
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(27);
                                                            setEnable(true);
                                                            enableEditing(27)
                                                        }} >
                                                        {especifiedCot7 ? `${especifiedCot7} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified7}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 27 && (
                                                            <Input
                                                                value={especifiedCot7}
                                                                ref={inputRefEspecified7}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot7(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }

                                                {divNumber !== 28
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(28);
                                                            setEnable(true);
                                                            enableEditing(28)
                                                        }} >
                                                        {especifiedCot8 ? `${especifiedCot8} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified8}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 28 && (
                                                            <Input
                                                                value={especifiedCot8}
                                                                ref={inputRefEspecified8}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot8(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}

                                                        <button type="submit" hidden />
                                                    </form>
                                                }
                                                {divNumber !== 29
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(29);
                                                            setEnable(true);
                                                            enableEditing(29)
                                                        }} >
                                                        {especifiedCot9 ? `${especifiedCot9} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified9}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 29 && (
                                                            <Input
                                                                value={especifiedCot9}
                                                                ref={inputRefEspecified9}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot9(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }
                                                {divNumber !== 30
                                                    ?
                                                    <div
                                                        onClick={() => {
                                                            setDivNumber(30);
                                                            setEnable(true);
                                                            enableEditing(30)
                                                        }} >
                                                        {especifiedCot10 ? `${especifiedCot10} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                    </div>
                                                    :
                                                    <form
                                                        ref={formRefEspecified10}
                                                        action={handleSubmit}
                                                    >
                                                        {divNumber === 30 && (
                                                            <Input
                                                                value={especifiedCot10}
                                                                ref={inputRefEspecified10}
                                                                onBlur={() => {
                                                                    onBlur()
                                                                }}
                                                                onChange={(e) => { setEspecifiedCot10(e.target.value) }}
                                                                className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                type="number"
                                                            />
                                                        )}
                                                        <button type="submit" hidden />
                                                    </form>
                                                }
                                            </div>
                                        </div>
                                        <div className="p-2 text-sm">
                                            <div className="font-bold">ENCONTRADO</div>
                                            {divNumber !== 100
                                                ? <div
                                                    onClick={() => {
                                                        setDivNumber(100);
                                                        setEnable(true);
                                                        enableEditing(100);
                                                    }} >
                                                    {thickness ? `${thickness} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRefThickness}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 100 && (
                                                        <>
                                                            <div className="flex">
                                                                <Input
                                                                    value={thickness}
                                                                    ref={inputThickness}
                                                                    onBlur={() => {
                                                                        onBlur()
                                                                    }}
                                                                    onChange={(e) => { setThickness(e.target.value) }}
                                                                    className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                                    type="number"
                                                                />
                                                                <div className="text-xm text-muted-foreground">mm</div>
                                                            </div>
                                                        </>
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }
                                            {divNumber !== 200
                                                ? <div
                                                    onClick={() => {
                                                        setDivNumber(200);
                                                        setEnable(true);
                                                        enableEditing(200);

                                                    }} >
                                                    {surface ? surface : <div className="text-xm text-muted-foreground">(ex. oleado)</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRefSurface}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 200 && (
                                                        <Input
                                                            value={surface}
                                                            ref={inputSurface}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setSurface(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="text"
                                                        />
                                                    )}
                                                    <button type="submit" hidden />
                                                </form>
                                            }
                                            {divNumber !== 1
                                                ? <div
                                                    onClick={() => {
                                                        setDivNumber(1);
                                                        setEnable(true);
                                                        enableEditing(1);

                                                    }} >
                                                    {cot1 ? `${cot1} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef1}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 1 && (
                                                        <Input
                                                            value={cot1}
                                                            ref={inputRefFound1}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot1(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}
                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 2
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(2);
                                                        setEnable(true);
                                                        enableEditing(2);

                                                    }} >
                                                    {cot2 ? `${cot2} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef2}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 2 && (
                                                        <Input
                                                            value={cot2}
                                                            ref={inputRefFound2}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot2(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 3
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(3);
                                                        setEnable(true);
                                                        enableEditing(3);

                                                    }} >
                                                    {cot3 ? `${cot3} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef3}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 3 && (
                                                        <Input
                                                            value={cot3}
                                                            ref={inputRefFound3}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot3(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 4
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(4);
                                                        setEnable(true);

                                                    }} >
                                                    {cot4 ? `${cot4} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef4}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 4 && (
                                                        <Input
                                                            value={cot4}
                                                            ref={inputRefFound4}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot4(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 5
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(5);
                                                        setEnable(true);

                                                    }} >
                                                    {cot5 ? `${cot5} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef5}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 5 && (
                                                        <Input
                                                            value={cot5}
                                                            ref={inputRefFound5}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot5(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 6
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(6);
                                                        setEnable(true);

                                                    }} >
                                                    {cot6 ? `${cot6} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef6}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 6 && (
                                                        <Input
                                                            value={cot6}
                                                            ref={inputRefFound6}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot6(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 7
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(7);
                                                        setEnable(true);

                                                    }} >
                                                    {cot7 ? `${cot7} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef7}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 7 && (
                                                        <Input
                                                            value={cot7}
                                                            ref={inputRefFound7}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot7(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 8
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(8);
                                                        setEnable(true);

                                                    }} >
                                                    {cot8 ? `${cot8} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef8}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 8 && (
                                                        <Input
                                                            value={cot8}
                                                            ref={inputRefFound8}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot8(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 9
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(9);
                                                        setEnable(true);

                                                    }} >
                                                    {cot9 ? `${cot9} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef9}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 9 && (
                                                        <Input
                                                            value={cot9}
                                                            ref={inputRefFound9}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot9(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }

                                            {divNumber !== 10
                                                ?
                                                <div
                                                    onClick={() => {
                                                        setDivNumber(10);
                                                        setEnable(true);

                                                    }} >
                                                    {cot10 ? `${cot10} mm` : <div className="text-xm text-muted-foreground">_._mm</div>}
                                                </div>
                                                :
                                                <form
                                                    ref={formRef10}
                                                    action={handleSubmit}
                                                >
                                                    {divNumber === 10 && (
                                                        <Input
                                                            value={cot10}
                                                            ref={inputRefFound10}
                                                            onBlur={() => {
                                                                onBlur()
                                                            }}
                                                            onChange={(e) => { setCot10(e.target.value) }}
                                                            className="text-sm px-[7px] py-1 h-5 w-16 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                                                            type="number"
                                                        />
                                                    )}

                                                    <button type="submit" hidden />
                                                </form>
                                            }
                                        </div>
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
                            <div className="p-2">
                                <Button onClick={() => {  }}>
                                    Salvar relatorio
                                </Button>
                            </div>
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

