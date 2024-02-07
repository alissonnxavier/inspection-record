"use client"

import { FoldInterface } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const foldColumns: ColumnDef<FoldInterface>[] = [
    {
        accessorKey: 'createdAt',
        header: 'Data'
    },
    {
        accessorKey: "item",
        header: "Item",
    },
    {
        accessorKey: "machine",
        header: "Maquina",
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
        header: "Qtd inspecionada",
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