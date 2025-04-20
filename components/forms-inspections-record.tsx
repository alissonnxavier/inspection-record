'use client';


import { useEditForm } from "@/hooks/use-edit-form";
import { AllForms } from "./all-forms";
import { useEffect } from "react";

export function FormsInspectionRecords() {

    const handleEditForm = useEditForm();

    const Forms = ()=>{
        return (
            <AllForms/>
        )
    };

    useEffect(()=>{
        Forms();
    },[handleEditForm])

    return (
        <div>
            <Forms />
        </div>
    );
};
