'use client';

//@ts-ignore
import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { pressColumns } from "@/components/dataTable/press-columns";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { GridLoader } from 'react-spinners';
import { format } from "date-fns";
import ExportToExcel from '@/components/export-to-excell';
import { DataTableNew } from "../data-table-new";
import { ColumnsPress } from "./columns-data-table/columns-press";


const Table = () => {
  const { data: session, status } = useSession();
  const [isnpectionData, setInspectionData] = useState([]);
  const handleSubmit = async () => {
    try {
      axios.get('/api/register/press')
        .then((response) => {
          setInspectionData(response.data)
        });
    } catch (error) {
      console.error(error);
    }
  };
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
      'Resultado',
      'Qualidade',
    ]
  );
  editedData.reverse();

  /*   const csvData = [
      ["Data", "item", "Revisão", "ODF", "quantidade ODF", "Qtd isnpecionada", "Resultado", "Qualidade"],
      ...usersData.map(({ createdAt, item, version, odf, amount, qtd, result, inspector }) => [
        format(new Date(createdAt), "dd/MM/yyyy HH:mm"),
        item,
        version,
        odf,
        amount,
        qtd,
        result,
        inspector,
      ]),
    ]; */
  if (status === "loading") {
    return (
      <>
        <div className="flex justify-center p-10">
        </div>
        <div className="flex h-5/6 justify-center items-center">
          <GridLoader color="#9e0837" size={100} />
        </div>
      </>
    )
  };

  if (status === 'authenticated') {

  } else {
    redirect('/login')
  };
  return (
    <div className="w-screen  align-middle items-center ">
      <div className="flex justify-center">
      </div>
      <div className="">
        <div className=" flex justify-center ">
          <div className="p-4">
            <Button className="p-10 shadow-xl hover:shadow-sm">
              {/* <CSVLink className="" filename="my-file.csv" data={csvData}>
                Baixar planilha
              </CSVLink> */}
              <div>
                <ExportToExcel apiData={editedData} fileName='planilha prensa' />
              </div>
            </Button>
          </div>
        </div>
        <div className="p-5">
          <DataTableNew
            columns={ColumnsPress()}
            data={isnpectionData}
            tableName="Prensa"
            searchKey="item"
          />
        </div>
      </div>
    </div>
  );
}

export default Table;