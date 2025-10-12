"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"
import BarChartComponent from "@/components/charts/bar-chart"

export const description = "A stacked bar chart with a legend"

const chartConfig = {
  aprovado: {
    label: "Aprovado",
    color: "",
  },
  reprovado: {
    label: "Reprovado",
    color: "",
  },
} satisfies ChartConfig;

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

const ChartBarStacked = () => {

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

  console.log(inspectionData);

  return (

    <div className="flex flex-row flex-wrap">
      <BarChartComponent data={inspectionData[0]?.press || []} tableName="Prensa"/>
      <BarChartComponent data={inspectionData[1]?.punching || []} tableName="Puncionadeira"/>
      <BarChartComponent data={inspectionData[2]?.threader || []} tableName="Rosqueadeira"/>
      <BarChartComponent data={inspectionData[3]?.fold || []} tableName="Dobra"/>
      <BarChartComponent data={inspectionData[4]?.soldier || []} tableName="Solda"/>
      <BarChartComponent data={inspectionData[5]?.finishing || []} tableName="Acabamento"/>
    </div>

  )
};

export default ChartBarStacked;
