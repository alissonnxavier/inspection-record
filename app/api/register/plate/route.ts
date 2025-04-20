import { NextResponse } from "next/server";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { converBase64ToImage } from 'convert-base64-to-image';
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/prismadb";


export const POST = async (req: Request,) => {
  const body = await req.json();
  const { item, supplier, lot, invoice, inspector, rir, hbOne, hbTwo, hbThree, images } = body;
  const product = `CH.${item}`;
  let imagesName = [];

  try {
    for (let i = 0; images?.length > i; i++) {
      const name = uuidv4();
      imagesName.push(`${name}.jpg`);
      const p = converBase64ToImage(images[i], `/home/alisson/Documents/imagens/chapas/${name}.jpg`)
    }
    const plate = await db.plate.create({
      data: {
        item: product,
        supplier,
        lot,
        invoice,
        rir,
        hbOne,
        hbTwo,
        hbThree,
        inspector,
        images: imagesName,
      }
    });
    return NextResponse.json(plate);
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

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  let inspections = [] as any;


  try {
    const res = await db.plate.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    });

    for (let i = 0; res.length > i; i++) {
      let t = [] as any;
      let imagesArray = [];
      for (let n = 0; res[i]?.images.length > n; n++) {
        let str = '';
        let img = await readFile(`/home/alisson/Documents/imagens/chapas/${res[i].images[n]}`);
        str = img.toString('base64');
        imagesArray.push("data:image/png;base64," + str);
      }
      let arrayOfBase64 = { base64: imagesArray }
      inspections.push({ ...res[i], ...arrayOfBase64 });
    }

    /*  for (let i = 0; res[0]?.images.length > i; i++) {
       let str = '';
       let img = await readFile(`/home/alisson/Documents/${res[0].images[i]}`);
 
       str = img.toString('base64');
       array.push("data:image/png;base64," + str);
     } */


    return NextResponse.json(inspections);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }

};
