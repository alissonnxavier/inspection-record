'use client';

//@ts-ignore
import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { punchingColumns } from "@/components/dataTable/punching-columns";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { GridLoader } from 'react-spinners';
import { format } from "date-fns";
import ExportToExcel from "@/components/export-to-excell";

const Table = () => {
  const { data: session, status } = useSession();
  const [isnpectionData, setInspectionData] = useState([]);

  const handleSubmit = async () => {
    try {
      axios.get('/api/register/punching')
        .then((response) => { setInspectionData(response.data) });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleSubmit();
  }, [setInspectionData]);

  const editedData: string[][] = [];
  isnpectionData.forEach((element, index) => {
    editedData.push(
      [
        format(new Date(element['createdAt']), "dd/MM/yyyy HH:mm"),
        element['item'],
        element['version'],
        element['odf'],
        element['amount'],
        element['qtd'],
        element['thickness'],
        element['machine'],
        element['cnc'],
        element['result'],
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
      'Espessura',
      'Maquina',
      'CNC',
      'Resultado',
      'Qualidade',
    ]
  );
  editedData.reverse();

  /*   const csvData = [
      ["Data", "item", "Revisão", "ODF", "quantidade ODF", "Qtd isnpecionada", "Espessura", "Maquina", "CNC", "Resultado", "Qualidade"],
      ...usersData.map(({ createdAt, item, version, odf, amount, qtd, thickness, machine, cnc, result, inspector }) => [
        format(new Date(createdAt), "dd/MM/yyyy HH:mm"),
        item,
        version,
        odf,
        amount,
        qtd,
        thickness,
        machine,
        cnc,
        result,
        inspector,
      ]),
    ];
   */
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
    <div className="w-screen h-screen align-middle items-center ">
      <div className="flex justify-center p-10">
        <Navbar />
      </div>
      <div className="p-10">
        <div className=" flex justify-center ">
          <div className="">
            <Button className="p-10 ">
              {/*  <CSVLink className="" filename="my-file.csv" data={csvData}>
                Baixar planilha
              </CSVLink> */}
              <div>
                <ExportToExcel apiData={editedData} fileName='planilha puncionadeira' />
              </div>
            </Button>
          </div>
        </div>
        <DataTable
          searchKey='item'
          columns={punchingColumns}
          data={isnpectionData}
        />
      </div>
    </div>
  );
}

export default Table;