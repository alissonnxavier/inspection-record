'use client';

//@ts-ignore
import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { foldColumns } from "@/components/dataTable/fold-columns";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { GridLoader } from 'react-spinners';
import { format } from "date-fns";
import ExportToExcel from "@/components/export-to-excell";
import { DataTableNew } from "../data-table-new";
import { ColumnsSerigraphy } from "./columns-data-table/columns-serigraphy";

const Table = () => {
  const { data: session, status } = useSession();
  const [inspectionData, setInspectionData] = useState([]);
  const handleSubmit = async () => {
    try {
      axios.get('/api/register/serigraphy')
        .then((response) => {
          setInspectionData(response.data)
        });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    handleSubmit();
  }, [setInspectionData]);

  const editedData: string[][] = [];
  inspectionData.forEach((element, index) => {
    editedData.push(
      [
        format(new Date(element['createdAt']), "dd/MM/yyyy HH:mm"),
        element['item'],
        element['version'],
        element['odf'],
        element['amount'],
        element['qtd'],
        element['result'],
        //@ts-ignore
        element?.images?.length,
        element['inspector'],
      ]
    );
  });
  editedData.push(
    [
      'Data',
      'Item',
      'Revisao',
      'ODF',
      'Quantidade ODF',
      'Quantidade inspecionado',
      'Resultado',
      'Imagens',
      'Qualidade',
    ]
  );
  editedData.reverse();

  /*  const csvData = [
     ["Data", "item", "Maquina", "Revisão", "ODF", "quantidade ODF", "isnpecionado", "Resultado", "Qualidade"],
     ...usersData.map(({ createdAt, item, machine, version, odf, amount, qtd, result, inspector }) => [
       format(new Date(createdAt), "dd/MM/yyyy HH:mm"),
       item,
       machine,
       version,
       odf,
       amount,
       qtd,
       result,
       inspector,
     ]),
   ]; */

  /* const f = format(new Date(createdAt), "MM/dd/yyyy HH:mm");
  console.log(f) */

  if (status === "loading") {
    return (
      <>
        <div className="flex justify-center p-10">
          <Navbar />
        </div>
        <div className="flex h-5/6 justify-center items-center">
          <GridLoader color="#9e0837" size={100} />
        </div>
      </>
    )
  }
  if (status === 'authenticated') {

  } else {
    redirect('/login')
  }

  return (
    <div className="w-screen  align-middle items-center ">
      <div className="flex justify-center p-0">
      </div>
      <div className="">
        <div className=" flex justify-center ">
          <div className="p-4">
            <Button className="p-10 shadow-xl hover:shadow-sm">
              {/* <CSVLink className="" filename="my-file.csv" data={csvData}>
              Baixar planilha
            </CSVLink> */}
              <div>
                <ExportToExcel apiData={editedData} fileName='planilha serigrafia' />
              </div>
            </Button>
          </div>
        </div>
        <div className="p-5">
          <DataTableNew
            tableName="Serigrafia"
            searchKey='item'
            columns={ColumnsSerigraphy()}
            data={inspectionData}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;