"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import BarChartComponent from "@/components/charts/bar-chart"
import { ScrollArea } from "../ui/scroll-area"


type Data = {
    month: string
    aprovado: number
    reprovado: number
}

type InspectionData = {
    press: Data[]
    punching: Data[]
    threader: Data[]
    fold: Data[]
    soldier: Data[]
    finishing: Data[]
    // add other properties if needed
}

const ChartsPage = () => {

    const [inspectionData, setInspectionData] = useState<InspectionData[]>([])

    useEffect(() => {
        axios.get('/api/load/indicator')
            .then(response => {
                setInspectionData(response.data)
            })
            .catch(error => {
                console.error('Error fetching inspection data:', error)
            })
    }, []);

    return (
        <ScrollArea className="h-[50rem] mt-10">
            <div className="flex flex-row flex-wrap justify-center items-center">
                <BarChartComponent data={inspectionData[0]?.press || []} tableName="Prensa" />
                <BarChartComponent data={inspectionData[1]?.punching || []} tableName="Puncionadeira" />
                <BarChartComponent data={inspectionData[2]?.threader || []} tableName="Rosqueadeira" />
                <BarChartComponent data={inspectionData[3]?.fold || []} tableName="Dobra" />
                <BarChartComponent data={inspectionData[4]?.soldier || []} tableName="Solda" />
                <BarChartComponent data={inspectionData[5]?.finishing || []} tableName="Acabamento" />
            </div>
        </ScrollArea>
    )
};
export default ChartsPage;
