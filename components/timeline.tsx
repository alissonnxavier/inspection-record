"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    Database,
    FileText,
    Users,
    Settings,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    Trash2,
    Edit3,
} from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"

export interface DatabaseRecord {
    id: string;
    inspector: any;
    item: string;
    version: string;
    odf: string;
    amount: string;
    qtd: string;
    result: string;
    createdAt: string
}

interface DatabaseTimelineProps {
    inspectionData: any
    className?: string
}

const getItemPosition = (
    itemId: string,
    itemIdPositions: Map<string, "left" | "right">,
    lastSide: "left" | "right",
): { position: "left" | "right"; newLastSide: "left" | "right" } => {
    // Check if we've already assigned a position for this item ID
    if (itemIdPositions.has(itemId)) {
        return { position: itemIdPositions.get(itemId)!, newLastSide: lastSide }
    }

    // For new item IDs, alternate sides
    const position = lastSide === "left" ? "right" : "left"

    // Store the position for this item ID
    itemIdPositions.set(itemId, position)
    return { position, newLastSide: position }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Aprovado":
            return "text-green-500"
        case "warning":
            return "text-secondary"
        case "Reprovado":
            return "text-destructive "
        case "pending":
            return "text-muted-foreground"
        default:
            return "text-foreground"
    }
}

// Get status badge variant
const getStatusBadge = (status: string) => {
    switch (status) {
        case "Aprovado":
            return "default border-green-800/50 border-[0.03rem]"
        case "warning":
            return "secondary"
        case "Reprovado":
            return "default border-red-800/50 border-[0.03rem]"
        case "pending":
            return "outline"
        default:
            return "outline"
    }
}

export function DatabaseTimeline({ inspectionData }: DatabaseTimelineProps) {
    const itemIdPositions = new Map<string, "left" | "right">()
    let lastSide: "left" | "right" = "right" // Track the last used side for alternating

    return (
        <ScrollArea className="h-[47rem] m-auto mb-80 ">
            <div className={cn("relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8")}>
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border" />
                <div className="space-y-4">
                    {Array.from(inspectionData).map((record: any, index: any) => {
                        const { position, newLastSide } = getItemPosition(record.inspector, itemIdPositions, lastSide)
                        lastSide = newLastSide

                        //const Icon = getItemIcon(record.id)
                        const isLeft = position === "left"

                        return (
                            <div key={record.id} className="relative flex items-center">
                                {/* Timeline dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 ">
                                    <div
                                        className={cn(
                                            "xl:w-4 xl:h-4 lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-0 sm:h-0 rounded-full border-4 border-background ",
                                            getStatusColor(record.result),
                                            "bg-current",
                                        )}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        "xl:w-5/12 lg:w-5/12 md:w-5/12 sm:w-full transition-all duration-300 hover:scale-105",
                                        isLeft ? "mr-auto pr-1" : "ml-auto pl-1",
                                    )}
                                >
                                    <Card className={cn("border-2 hover:border-accent transition-all duration-300", "hover:shadow-lg",
                                        getStatusBadge(record.result)
                                    )}>
                                        <CardContent className="p-2">
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "p-2 rounded-lg",
                                                            record.result === "success"
                                                                ? "bg-primary/10"
                                                                : record.result === "warning"
                                                                    ? "bg-secondary/10"
                                                                    : record.result === "error"
                                                                        ? "bg-destructive/10"
                                                                        : "bg-muted",
                                                        )}
                                                    >
                                                        <Users className={cn("w-4 h-4", getStatusColor(record.result))} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-card-foreground text-balance">{record.inspector}</h3>
                                                        <p className="text-sm text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex flex-row gap-4 items-center">
                                                    <p className="text-card-foreground text-pretty">{record.item}</p> -
                                                    <p className="text-card-foreground text-pretty">Rev: {record.version}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                    <span className="bg-muted px-2 py-1 rounded text-xs">Quantidade: {record.amount}</span>
                                                    {record.inspector && <span className="bg-muted px-2 py-1 rounded text-xs">OP: {record.odf}</span>}
                                                    <div className="flex w-full justify-between">
                                                        <Badge variant="outline" className={cn("text-xs", getStatusColor(record.result))}>
                                                            {record.result.toUpperCase()}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-md border-none">
                                                            Processo: <span className="bg-muted px-2 py-1 rounded text-xs text-muted-foreground">{record.process}</span>
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-border">
                                                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                        Observações:
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </ScrollArea>
    )
}
