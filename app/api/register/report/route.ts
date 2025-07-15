import { NextResponse } from "next/server";
import { db } from "@/lib/prismadb";


export const POST = async (req: Request,) => {
  const body = await req.json();
  const {
    id,
    especifiedMeasure,
    especifiedMeasureNumber,
    foundMeasure,
    foundMeasureNumber,
    especifiedThickness,
    especifiedThicknessNumber,
    foundThickness,
    foundThicknessNumber,
    foundSurface,
    foundSurfaceNumber,
    reportStatus,
    status,
  } = body.control._formValues;

  try {

    const handle = await db.report.findUnique({
      where: {
        id
      },
    })

    if (handle?.status === 'closed') {
      return NextResponse.json("Report already closed", { status: 400 });
    };


    if (especifiedMeasure && especifiedMeasureNumber === 'em0') {
      const plate = await db.report.upsert({
        //@ts-ignore
        where: {
          id
        },
        update: {
          measurement1: especifiedMeasure
        },
        create: {
          measurement1: especifiedMeasure,
          id
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em1') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement2: especifiedMeasure
        },
        create: {
          id,
          measurement2: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em2') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement3: especifiedMeasure
        },
        create: {
           id,
          measurement3: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em3') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement4: especifiedMeasure
        },
        create: {
           id,
          measurement4: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em4') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement5: especifiedMeasure
        },
        create: {
           id,
          measurement5: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em5') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement6: especifiedMeasure
        },
        create: {
           id,
          measurement6: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em6') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement7: especifiedMeasure
        },
        create: {
           id,
          measurement7: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em7') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement8: especifiedMeasure
        },
        create: {
           id,
          measurement8: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em8') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement9: especifiedMeasure
        },
        create: {
           id,
          measurement9: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em9') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          measurement10: especifiedMeasure
        },
        create: {
           id,
          measurement10: especifiedMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm0') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement1: foundMeasure,
        },
        create: {
           id,
          foundMeasurement1: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm1') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement2: foundMeasure,
        },
        create: {
           id,
          foundMeasurement2: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm2') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement3: foundMeasure,
        },
        create: {
           id,
          foundMeasurement3: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm3') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement4: foundMeasure,
        },
        create: {
           id,
          foundMeasurement4: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm4') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement5: foundMeasure,
        },
        create: {
           id,
          foundMeasurement5: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm5') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement6: foundMeasure,
        },
        create: {
           id,
          foundMeasurement6: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm6') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement7: foundMeasure,
        },
        create: {
           id,
          foundMeasurement7: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm7') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement8: foundMeasure,
        },
        create: {
           id,
          foundMeasurement8: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm8') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement9: foundMeasure,
        },
        create: {
           id,
          foundMeasurement9: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm9') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundMeasurement10: foundMeasure,
        },
        create: {
           id,
          foundMeasurement10: foundMeasure,
        }
      });
    }
    else if (especifiedThickness && especifiedThicknessNumber === 'et0') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          especifiedThickness: especifiedThickness,
        },
        create: {
           id,
          especifiedThickness: especifiedThickness,
        }
      });
    } else if (foundThickness && foundThicknessNumber === 'ft0') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          foundThickness: foundThickness,
        },
        create: {
           id,
          foundThickness: foundThickness,
        }
      });
    } else if (foundSurface && foundSurfaceNumber === 'sf0') {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          surface: foundSurface,
        },
        create: {
           id,
          surface: foundSurface,
        }
      });
    } else if (reportStatus === "rs" && status === "closed") {
      const plate = await db.report.upsert({
        where: {
          id,
        },
        update: {
          status: status,
        },
        create: {
           id,
          status: status,
        }
      });
    }
    return NextResponse.json("plate");
  } catch (error) {
    console.log(error)
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const body = await req.json();
  const { id } = body.control._formValues;

  try {
    const res = await db.report.findUnique({
      where: {
        id
      },

    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

};

