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

const chartConfig = {
    aprovado: {
        label: "",
        color: "var(--chart-1)",
    },
    reprovado: {
        label: "",
        color: "red",
    },
} satisfies ChartConfig;

interface Data {
    data: any;
    tableName?: string;
};

const BarChartComponent = ({ data, tableName }: Data) => {




    return (
        <Card className="w-[24rem] m-4">
            <CardHeader>
                <CardTitle>{tableName} </CardTitle>
                <CardDescription>Janeiro - Dezembro 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart className="w-40" accessibilityLayer data={data} >
                        <CartesianGrid vertical={true} />
                        <XAxis
                            dataKey="month"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={true}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            className="fill-green-700"
                            dataKey="aprovado"
                            stackId="a"
                            fill=""
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            className="fill-red-700"
                            dataKey="reprovado"
                            stackId="a"
                            fill=""
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">

            </CardFooter>
        </Card>
    )
};

export default BarChartComponent;
