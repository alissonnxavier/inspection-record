"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface DatabaseRecord {
    id: string;
    inspector: any;
    item: string;
    version: string;
    odf: string;
    amount: string;
    qtd: string;
    result: string;
    createdAt: string;
    process?: string;
}

interface DatabaseTimelineProps {
    inspectionData: DatabaseRecord[]
    className?: string
}

// Helpers originais mantidos
const getItemPosition = (
    itemId: string,
    itemIdPositions: Map<string, "left" | "right">,
    lastSide: "left" | "right",
): { position: "left" | "right"; newLastSide: "left" | "right" } => {
    if (itemIdPositions.has(itemId)) {
        return { position: itemIdPositions.get(itemId)!, newLastSide: lastSide }
    }
    const position = lastSide === "left" ? "right" : "left"
    itemIdPositions.set(itemId, position)
    return { position, newLastSide: position }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Aprovado": return "text-green-500"
        case "warning": return "text-secondary"
        case "Reprovado": return "text-destructive"
        case "pending": return "text-muted-foreground"
        default: return "text-foreground"
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "Aprovado": return "default border-green-800/50 border-[0.03rem]"
        case "warning": return "secondary"
        case "Reprovado": return "default border-red-800/50 border-[0.03rem]"
        case "pending": return "outline"
        default: return "outline"
    }
}

export function DatabaseTimeline({ inspectionData }: DatabaseTimelineProps) {
    const itemIdPositions = new Map<string, "left" | "right">()
    let lastSide: "left" | "right" = "right"

    return (
        /* Ajuste de Altura Responsiva:
           h-screen: Ocupa 100% da altura da janela.
           overflow-hidden: Evita barra de rolagem dupla no navegador.
        */
        <div className="w-full h-screen overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 w-full">
                <div className={cn("relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10")}>
                    
                    {/* Linha da Timeline - Responsiva: 
                        No mobile fica na esquerda (left-6), no desktop centraliza (md:left-1/2) 
                    */}
                    <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-border" />
                    
                    <div className="space-y-8">
                        {Array.from(inspectionData).map((record: DatabaseRecord) => {
                            const { position, newLastSide } = getItemPosition(record.inspector, itemIdPositions, lastSide)
                            lastSide = newLastSide
                            const isLeft = position === "left"

                            return (
                                <div key={record.id} className="relative flex items-center">
                                    
                                    {/* Ponto da Timeline (Dot) */}
                                    <div className="absolute left-2 md:left-1/2 transform md:-translate-x-1/2 z-10">
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded-full border-4 border-background transition-transform duration-300 hover:scale-125",
                                                getStatusColor(record.result),
                                                "bg-current"
                                            )}
                                        />
                                    </div>

                                    {/* Card Container: 
                                        Mobile: Ocupa largura total com padding lateral.
                                        Desktop: Ocupa 5/12 e alterna esquerda/direita.
                                    */}
                                    <div
                                        className={cn(
                                            "w-full md:w-5/12 transition-all duration-300",
                                            "pl-10 md:pl-0", 
                                            isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                                        )}
                                    >
                                        <Card className={cn(
                                            "border-2 hover:border-accent transition-all duration-300 hover:shadow-xl",
                                            getStatusBadge(record.result)
                                        )}>
                                            <CardContent className="p-4">
                                                {/* Header do Card */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "p-2 rounded-lg",
                                                            record.result === "Aprovado" ? "bg-green-500/10" : 
                                                            record.result === "Reprovado" ? "bg-destructive/10" : "bg-muted"
                                                        )}>
                                                            <Users className={cn("w-4 h-4", getStatusColor(record.result))} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-semibold text-card-foreground text-sm md:text-base truncate">
                                                                {record.inspector}
                                                            </h3>
                                                            <p className="text-[10px] md:text-xs text-muted-foreground">
                                                                {new Date(record.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Conteúdo das Informações */}
                                                <div className="space-y-3">
                                                    <div className="flex flex-wrap items-center gap-1 text-sm">
                                                        <p className="text-card-foreground font-medium">{record.item}</p>
                                                        <span className="text-muted-foreground hidden sm:inline">-</span>
                                                        <p className="text-card-foreground">Rev: {record.version}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="bg-muted px-2 py-1 rounded text-[10px] md:text-xs text-muted-foreground">
                                                            Qtd: {record.amount}
                                                        </span>
                                                        <span className="bg-muted px-2 py-1 rounded text-[10px] md:text-xs text-muted-foreground">
                                                            OP: {record.odf}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2 pt-2 border-t border-border/50">
                                                        <Badge variant="outline" className={cn("text-[10px] py-0 px-2 h-5", getStatusColor(record.result))}>
                                                            {record.result?.toUpperCase()}
                                                        </Badge>
                                                        <div className="text-[10px] md:text-xs text-muted-foreground italic">
                                                            Processo: <span className="font-medium text-foreground">{record.process || "N/A"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-border/30">
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                                            Observações
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground/80 mt-1 italic">
                                                            Nenhuma observação registrada.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/* Padding extra no final para o scroll não cortar o último card */}
                    <div className="h-20" />
                </div>
            </ScrollArea>
        </div>
    )
}