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
    foundSurfaceNumber
  } = body.control._formValues;

  try {
    if (especifiedMeasure && especifiedMeasureNumber === 'em0') {
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
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em1') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement2: especifiedMeasure
        },
        create: {
          measurement2: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em2') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement3: especifiedMeasure
        },
        create: {
          measurement3: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em3') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement4: especifiedMeasure
        },
        create: {
          measurement4: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em4') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement5: especifiedMeasure
        },
        create: {
          measurement5: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em5') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement6: especifiedMeasure
        },
        create: {
          measurement6: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em6') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement7: especifiedMeasure
        },
        create: {
          measurement7: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em7') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement8: especifiedMeasure
        },
        create: {
          measurement8: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em8') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement9: especifiedMeasure
        },
        create: {
          measurement9: especifiedMeasure,
        }
      });
    } else if (especifiedMeasure && especifiedMeasureNumber === 'em9') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          measurement10: especifiedMeasure
        },
        create: {
          measurement10: especifiedMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm0') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement1: foundMeasure,
        },
        create: {
          foundMeasurement1: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm1') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement2: foundMeasure,
        },
        create: {
          foundMeasurement2: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm2') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement3: foundMeasure,
        },
        create: {
          foundMeasurement3: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm3') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement4: foundMeasure,
        },
        create: {
          foundMeasurement4: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm4') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement5: foundMeasure,
        },
        create: {
          foundMeasurement5: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm5') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement6: foundMeasure,
        },
        create: {
          foundMeasurement6: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm6') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement7: foundMeasure,
        },
        create: {
          foundMeasurement7: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm7') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement8: foundMeasure,
        },
        create: {
          foundMeasurement8: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm8') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement9: foundMeasure,
        },
        create: {
          foundMeasurement9: foundMeasure,
        }
      });
    } else if (foundMeasure && foundMeasureNumber === 'fm9') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundMeasurement10: foundMeasure,
        },
        create: {
          foundMeasurement10: foundMeasure,
        }
      });
    }
    else if (especifiedThickness && especifiedThicknessNumber === 'et0') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          especifiedThickness: especifiedThickness,
        },
        create: {
          especifiedThickness: especifiedThickness,
        }
      });
    } else if (foundThickness && foundThicknessNumber === 'ft0') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          foundThickness: foundThickness,
        },
        create: {
          foundThickness: foundThickness,
        }
      });
    } else if (foundSurface && foundSurfaceNumber === 'sf0') {
      const plate = await db.report.upsert({
        where: {
          id: '682f37ffbd3a38efc8dd83b6',
        },
        update: {
          surface: foundSurface,
        },
        create: {
          surface: foundSurface,
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
  try {
    const res = await db.report.findUnique({
      where: {
        id: '682f37ffbd3a38efc8dd83b6',
      },
  
    });

    return NextResponse.json(res);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

};

