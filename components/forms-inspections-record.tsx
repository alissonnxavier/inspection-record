'use client';

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import FormPress from "./form-press";
import FormPunchingMachine from "./form-punching-machine";
import FormThreader from "./form-threader";
import FormFold from "./form-fold";
import FormSolder from "./form-solder";
import FormFinishing from "./from-finishing";
import { Navbar } from "./navbar";
import { GridLoader } from 'react-spinners';
import { useSession } from "next-auth/react";

export  function FormsInspectionRecords() {

    const { data: session, status } = useSession();

    const test = {
        id: '',
        name: ''
    }

    return (
        <div className="flex items-center ">
            <Tabs defaultValue="Press" className="w-[410px]">
                <TabsList className="grid w-full grid-cols-3 h-20 gap-">
                    <TabsTrigger value="Press">
                        Prensa
                    </TabsTrigger>
                    <TabsTrigger value="PunchingMachine">
                        Puncionadeira
                    </TabsTrigger>
                    <TabsTrigger value="Threader">
                        Rorqueadeira
                    </TabsTrigger>
                    <TabsTrigger value="Fold">
                        Dobra
                    </TabsTrigger>
                    <TabsTrigger value="Solder">
                        Solda
                    </TabsTrigger>
                    <TabsTrigger value="Finishing">
                        Acabamento
                    </TabsTrigger>
                </TabsList>
                <FormPress tab="Press" />
                <FormPunchingMachine tab='PunchingMachine' />
                <FormThreader tab='Threader' />
                <FormFold tab='Fold' />
                <FormSolder tab='Solder' />
                <FormFinishing tab='Finishing' />
            </Tabs>
        </div>
    )
}
