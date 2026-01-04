import { DrawerPatter } from "../drawer-patter";
import { useDrawerNcSeeMore } from "@/hooks/use-nc-see-more-drawer";
import toast from 'react-hot-toast';
import { useEffect, useState } from "react";
import { loadUniqueNcRegister } from "@/actions/load";
import { GridLoader } from "react-spinners";
import { NcSeeMorePage } from "../nc-see-more-page";

export function DrawerNcSeeMore() {

    const handleDrawer = useDrawerNcSeeMore();

    return (
        <DrawerPatter
            isOpen={handleDrawer.isOpen}
            onClose={handleDrawer.onClose}
        >
            <NcSeeMorePage />
        </DrawerPatter>
    )
}