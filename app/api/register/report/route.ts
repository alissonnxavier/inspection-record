import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";


export const POST = async (req: Request,) => {
  const body = await req.json();
  const { id, especifiedMeasure, especifiedMeasureNumber } = body.control._formValues;

  const a = 'measurement1';

  try {

    const plate = await db.report.upsert({
      where: {
        id: '682f37ffbd3a38efc8dd83b6',
      },
      update: {
        measurement1: especifiedMeasure
      },
      create: {
        measurement1: especifiedMeasure,
      }
    });


    /*  const plate = await db.report.create({
       data: {
         measurement1: especifiedMeasure,
       }
       
     }); */
    return NextResponse.json(plate);
  } catch (error) {
    console.log(error)
  }
};

