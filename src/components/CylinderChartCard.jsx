// src/components/CylinderChartCard.jsx
"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.jsx"

const chartConfig = {
    count: {
        label: "Cars",
        color: "var(--primary)"
    }
}
export function CylinderDistributionChart({ data }) {
    // Format the data passed from the parent
    const formattedData = data.map((item) => ({
        cylinders: `cc:${item.cylinders}`,
        count: item.count,
    }))

    return (
        <Card className="shadow-none border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest text-zinc-500">Cylinder Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[120px] w-full">
                    <BarChart data={formattedData} margin={{ top: 10 }}>
                        <XAxis dataKey="cylinders" tickLine={false} axisLine={false} fontSize={10} />
                        <YAxis hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        {/* 2. This fill will now correctly resolve to your Teal OKLCH color */}
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}