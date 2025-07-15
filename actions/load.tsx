"use server";

import { db } from "@/lib/prismadb";
import { readFile } from "fs/promises";

export const loadUniqueSerigraphyRegister = async (id: string) => {

    let inspections = [] as any;

    const serigraphyRegister = await db.serigraphy.findFirst({
        where: {
            id
        }
    });

    if (serigraphyRegister?.images) {
        let imagesArray = [];
        for (let i = 0; serigraphyRegister?.images.length > i; i++) {
            let str = '';
            let img = await readFile(`C:/Users/aliss/Documents/imagens/serigrafia/${serigraphyRegister.images[i]}`);
            str = img.toString('base64');
            imagesArray.push("data:image/png;base64," + str);
        }
        let arrayOfBase64 = { base64: imagesArray };
        inspections.push({ ...serigraphyRegister, ...arrayOfBase64 });
    }

    return inspections;
}

export const loadUniquePlateRegister = async (id: string) => {

    let inspections = [] as any;

    const serigraphyRegister = await db.plate.findFirst({
        where: {
            id
        }
    });
    if (serigraphyRegister?.images) {
        let imagesArray = [];
        for (let i = 0; serigraphyRegister?.images.length > i; i++) {
            let str = '';
            let img = await readFile(`C:/Users/aliss/Documents/imagens/chapas/${serigraphyRegister.images[i]}`);
            str = img.toString('base64');
            imagesArray.push("data:image/png;base64," + str);
        }
        let arrayOfBase64 = { base64: imagesArray };
        inspections.push({ ...serigraphyRegister, ...arrayOfBase64 });
    }

    return inspections;
}

export const loadUniquePressRegister = async (id: string) => {
    const pressRegister = await db.press.findFirst({
        where: {
            id
        }
    });
    return pressRegister;
}

export const loadUniquePunchingMachineRegister = async (id: string) => {
    const punchingMachineRegister = await db.punching.findFirst({
        where: {
            id
        }
    });
    return punchingMachineRegister;
}

export const loadUniqueThreaderRegister = async (id: string) => {
    const threaderRegister = await db.threader.findFirst({
        where: {
            id
        }
    });
    return threaderRegister;
}

export const loadUniqueFoldRegister = async (id: string) => {
    const foldRegister = await db.fold.findFirst({
        where: {
            id
        }
    });
    return foldRegister;
}

export const loadUniqueSoldierRegister = async (id: string) => {
    const soldierRegister = await db.soldier.findFirst({
        where: {
            id
        }
    });
    return soldierRegister;
}

export const loadUniqueFinishingRegister = async (id: string) => {
    const finishingRegister = await db.finishing.findFirst({
        where: {
            id
        }
    });
    return finishingRegister;
};

export const loadUniqueReportRegister = async (id: string) => {
  try {
    const report = await db.report.findFirst({
      where: {
        id,
      },
    });

    if (!report) {
      return null;
    }

    return report;
  } catch (error) {
    console.error("Error loading report register:", error);
    return null;
  }
};
