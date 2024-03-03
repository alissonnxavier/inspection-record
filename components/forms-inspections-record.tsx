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
import FormFinishing from "./form-finishing";

export  function FormsInspectionRecords() {
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
                        Rosqueadeira
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
