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
import { deleteRegisterSerigraphy } from "@/actions/delete-registers"
import ButtonSeeMore from "@/components/button-handler";
import DeleteButton from "@/components/delete-button"
import ButtonEditInspection from "@/components/edit-inspection-button"
import { useAdminHook } from "@/hooks/use-admin"


type PlateTypes = {
    id: string;
    supplier: string;
    lot: string;
    invoice: string;
    rir: string;
    hgOne: string;
    hbTwo: string;
    hbThree: string;
    inspector: string;
    images: any;
    createdAt: string;
}

export const ColumnsPlate = () => {

    const handleAdmin = useAdminHook();

    const columns: ColumnDef<PlateTypes>[] = [
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
            accessorKey: "supplier",
            header: "Fornecedor",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("supplier")}</div>
            ),
        },
        {
            accessorKey: "lot",
            header: "Lote",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("lot")}</div>
            ),
        },
        {
            accessorKey: "invoice",
            header: "Nota fiscal",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("invoice")}</div>
            ),
        },
        {
            accessorKey: "rir",
            header: "RIR",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("rir")}</div>
            ),
        },
        {
            accessorKey: "hbOne",
            header: "HB 1",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hbOne")}</div>
            ),
        },
        {
            accessorKey: "hbTwo",
            header: "HB 2",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hbTwo")}</div>
            ),
        },
        {
            accessorKey: "hbThree",
            header: "HB 3",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("hbThree")}</div>
            ),
        },
        {
            accessorKey: "images",
            header: "Imagens",
            cell: ({ row }) => (

                <div className="capitalize">{row.original.images.length}</div>
            ),
        },

        /*  {
         accessorKey: "result",
         header: "Resultado",
         cell: ({ row }) => (
             <div className="capitalize">
                 {
                     row.getValue("result") == "Aprovado" ?
                         <Badge variant='secondary' className="bg-green-500 hover:bg-green-300">{row.getValue("result")}</Badge> :
                         <Badge variant='destructive' className="p-">{row.getValue("result")}</Badge>
                 }
             </div>
         ),
     }, */
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
                function HandleDelete(id: string, imagesName: []) {
                    deleteRegisterSerigraphy(id, imagesName);
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
                            <DropdownMenuItem>
                                <ButtonSeeMore data={row.original.id} drawer="plate" />
                            </DropdownMenuItem>
                            {handleAdmin.admin == true &&
                                <>
                                    <DropdownMenuItem>
                                        <ButtonEditInspection id={row.original.id} tab="PlateSteel" />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <DeleteButton id={row.original.id} images={row.original.images} />
                                    </DropdownMenuItem>
                                </>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];
    return columns;
}


