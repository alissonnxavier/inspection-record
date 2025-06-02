import { db } from "@/lib/prismadb"


export const saveReport = async (
    id: string,
    item: string,
    version: string,
    odf: string,
    amount: string,
    inspected: string,
    result: string,
    inspector: string,
    measurements: any,

) => {
    const report = await db.report.create({
        data: {
            item,
            itemId: id,
            version,
            odf,
            amount,
            inspected,
            result,
            inspector,
            measurements,
        }
    });
}