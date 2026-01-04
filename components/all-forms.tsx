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
import FormSteelPlate from "./form-steel-plate";
import FormSerigraphy from "./form-serigraphy";
import FormNc from "./form-nc";
import { useEditForm } from "@/hooks/use-edit-form";
import { Form } from "react-hook-form";

export function AllForms() {

    const handleEditForm = useEditForm();

   /*  if (handleEditForm.id.length > 2) {
        return (
            <div className="flex items-center ">
                <Tabs defaultValue={handleEditForm.tab} className="w-[410px]">
                    <TabsList className="grid w-full grid-cols-3 h-28 gap-">
                        <TabsTrigger value="PlateSteel">
                            Chapas
                        </TabsTrigger>
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
                        <TabsTrigger value="Soldier">
                            Solda
                        </TabsTrigger>
                        <TabsTrigger value="Finishing">
                            Acabamento
                        </TabsTrigger>
                        <TabsTrigger value="Serigraphy">
                            Serigrafia
                        </TabsTrigger>
                    </TabsList>
                    <FormSteelPlate tab="PlateSteel" id={handleEditForm.id} />
                    <FormPress tab="Press" id={handleEditForm.id} />
                    <FormPunchingMachine tab='PunchingMachine' id={handleEditForm.id} />
                    <FormThreader tab='Threader' id={handleEditForm.id} />
                    <FormFold tab='Fold' id={handleEditForm.id} />
                    <FormSolder tab='Soldier' id={handleEditForm.id} />
                    <FormFinishing tab='Finishing' id={handleEditForm.id} />
                    <FormSerigraphy tab="Serigraphy" id={handleEditForm.id} />
                </Tabs>
            </div>
        )
    } */

    return (
        <div className="flex items-center ">
            <Tabs defaultValue={handleEditForm.tab} className="w-[410px]">
                <TabsList className="grid w-full grid-cols-3 h-28 gap-">
                    <TabsTrigger value="PlateSteel">
                        Chapas
                    </TabsTrigger>
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
                    <TabsTrigger value="Soldier">
                        Solda
                    </TabsTrigger>
                    <TabsTrigger value="Finishing">
                        Acabamento
                    </TabsTrigger>
                    <TabsTrigger value="Serigraphy">
                        Serigrafia
                    </TabsTrigger>
                     <TabsTrigger value="Nc">
                        NC
                    </TabsTrigger>
                </TabsList>
                <FormSteelPlate tab="PlateSteel" id={handleEditForm.id} />
                <FormPress tab="Press" id={handleEditForm.id} />
                <FormPunchingMachine tab='PunchingMachine' id={handleEditForm.id} />
                <FormThreader tab='Threader' id={handleEditForm.id} />
                <FormFold tab='Fold' id={handleEditForm.id} />
                <FormSolder tab='Soldier' id={handleEditForm.id} />
                <FormFinishing tab='Finishing' id={handleEditForm.id} />
                <FormSerigraphy tab="Serigraphy" id={handleEditForm.id} />
                <FormNc tab="Nc" id={handleEditForm.id} />
            </Tabs>
        </div>
    )
}
