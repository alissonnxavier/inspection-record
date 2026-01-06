"use client"

import * as React from "react"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns";
import { deleteRegisterNc, deleteRegisterPunching } from "@/actions/delete-registers"
import { useAdminHook } from "@/hooks/use-admin"
import { useDrawerNcSeeMore } from "@/hooks/use-nc-see-more-drawer"



export type PunchingTypes = {
    id: string;
    inspector: String;
    item: string;
    version: string;
    odf: string;
    amount: string;
    thickness: String;
    cnc: String;
    qtd: string;
    result: string;
    createdAt: string
}

export const ColumnsNc = () => {

    const handleAdmin = useAdminHook();
    const handleDrawerSeeMore = useDrawerNcSeeMore();

    const columns: ColumnDef<PunchingTypes>[] = [
        /* {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        }, */
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="link"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{format(new Date(row.getValue('createdAt')), "dd/MM/yyyy HH:mm:ss")}</div>,
        },
        {
            accessorKey: "item",
            header: "Item",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("item")}</div>
            ),
        },
        {
            accessorKey: "version",
            header: "Revisão",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("version")}</div>
            ),
        },
        {
            accessorKey: "odf",
            header: "ODF",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("odf")}</div>
            ),
        },
        {
            accessorKey: "amount",
            header: "Quantidade ODF",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("amount")}</div>
            ),
        },
        {
            accessorKey: "thickness",
            header: "Espessura",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("thickness")}</div>
            ),
        },
        {
            accessorKey: "cnc",
            header: "CNC",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("cnc")}</div>
            ),
        },
        {
            accessorKey: "machine",
            header: "Maquina",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("machine")}</div>
            ),
        },
        /*   {
              accessorKey: "amount",
              header: () => <div className="text-right">Amount</div>,
              cell: ({ row }) => {
                  const amount = parseFloat(row.getValue("amount"))
      
                  // Format the amount as a dollar amount
                  const formatted = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                  }).format(amount)
      
                  return <div className="text-right font-medium">{formatted}</div>
              },
          }, */
        {
            accessorKey: "inspector",
            header: "Qualidade",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("inspector")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                function handleDelete(id: string) {
                    deleteRegisterNc(id);
                    location.reload();
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Açoẽs</DropdownMenuLabel>
                            {handleAdmin.admin &&
                                <>
                                    <DropdownMenuItem
                                        onClick={() => { handleDrawerSeeMore.onOpen(row.original.id) }}
                                    >
                                        Ver mais
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Button variant='delete' onClick={() => {
                                            handleDelete(row.original.id)
                                        }}>
                                            Deletar
                                        </Button>
                                    </DropdownMenuItem>
                                </>
                            }
                            <DropdownMenuSeparator />

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    return columns;
}