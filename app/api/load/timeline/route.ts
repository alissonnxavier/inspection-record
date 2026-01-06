import { db } from "@/lib/prismadb";
import { NextResponse } from "next/server";



export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    const press = await db.press.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const punching = await db.punching.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const trheader = await db.threader.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const fold = await db.fold.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const solder = await db.soldier.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const finishing = await db.finishing.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    const timeline =
      [
        ...press,
        ...punching,
        ...trheader,
        ...fold,
        ...solder,
        ...finishing
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    //const timeline = [...press, ...fold].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());


    if (!timeline) {
      return new NextResponse("No timeline data found", { status: 404 });
    };
    return NextResponse.json(timeline);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

};