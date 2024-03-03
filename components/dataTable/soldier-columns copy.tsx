"use client"

import { SodierInterface } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const soldierColumns: ColumnDef<SodierInterface>[] = [
    {
        accessorKey: 'createdAt',
        header: 'Data'
    },
    {
        accessorKey: "item",
        header: "Item",
    },
    {
        accessorKey: "version",
        header: "Revisão",
    },
    {
        accessorKey: "odf",
        header: "ODF",
    },
    {
        accessorKey: "amount",
        header: "Qtd ODF",
    },
    {
        accessorKey: "qtd",
        header: "Qtd inspecionado",
    },
    {
        accessorKey: "process",
        header: "Processo",
    },
    {
        accessorKey: "result",
        header: "Resultado",
    },
    {
        accessorKey: 'inspector',
        header: 'Qualidade'
    },
]