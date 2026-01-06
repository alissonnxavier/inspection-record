"use server";

import { db } from "@/lib/prismadb";
import fs from 'fs';


export const deleteRegisterPress = async (id: string) => {
    try {
        const res = await db.press.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export const deleteRegisterNc = async (id: string) => {
    try {
        const res = await db.nc.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
};

export const deleteRegisterPunching = async (id: string) => {
    try {
        const res = await db.punching.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterThreader = async (id: string) => {
    try {
        const res = await db.threader.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterFold = async (id: string) => {
    try {
        const res = await db.fold.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterSoldier = async (id: string) => {
    try {
        const res = await db.soldier.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterFinishing = async (id: string) => {
    try {
        const res = await db.finishing.delete({
            where: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterPlate = async (id: string, imagesName: []) => {
    try {
        const res = await db.plate.delete({
            where: {
                id,
            }
        });
        for (let i = 0; imagesName.length > i; i++) {
            fs.unlinkSync(`/home/alisson/Documents/imagens/chapas/${imagesName[i]}`);
        }
    } catch (error) {
        console.log(error);
    }
}

export const deleteRegisterSerigraphy = async (id: string, imagesName: []) => {
    try {
        const res = await db.serigraphy.delete({
            where: {
                id,
            }
        });
        for (let i = 0; imagesName.length > i; i++) {
            fs.unlinkSync(`/home/alisson/Documents/imagens/serigrafia/${imagesName[i]}`);
        }
    } catch (error) {
        console.log(error);
    }
}
