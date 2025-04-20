import { NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { converBase64ToImage } from 'convert-base64-to-image';
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/prismadb";


export const POST = async (req: Request,) => {
  const body = await req.json();
  const { id } = body;
  console.log(id);

  try {
   
    const serigraphy = await db.serigraphy.findFirst({
      where: {
        id
      }
    });
    return NextResponse.json(serigraphy);
  } catch (error) {
    console.log(error)
  }
  //const buffer = Buffer.from(await images[0].arrayBuffer());

  /*   const base64 = await fetch(images[0]);
  
    //const base64Response = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob = await base64.blob();
    console.log(blob);
  
    const bytes = await blob.arrayBuffer();
    const buffer = Buffer.from(bytes);
  
    console.log(buffer);
  
    const path = `./public/images/jksdlafjk.jpg`
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`); */

  /*   try {
      await writeFile(
        path.join(process.cwd(), "public/uploads/" + images[0].name, buffer)
      )
    } catch (error) {
      console.log("Error occured ", error);
      return NextResponse.json({ Message: "Failed", status: 500 });
    }
   */

  //const buffer = Buffer.from(await images[0].arrayBuffer())
}

