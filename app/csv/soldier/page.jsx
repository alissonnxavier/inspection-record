'use client';

import { CSVLink } from "react-csv";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { soldierColumns } from "@/components/dataTable/soldier-columns copy";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { GridLoader } from 'react-spinners';
import { format, compareAsc } from "date-fns";

const Table = () => {

  const { data: session, status } = useSession();
  const [usersData, setUsersData] = useState([]);
  const handleSubmit = async () => {
    try {
      axios.get('/api/register/soldier')
        .then((response) => { setUsersData(response.data) });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleSubmit();
  }, [setUsersData]);

  // Contains the column headers and table data in the required format for CSV
  const csvData = [
    [ "Data", "item", "Revisão", "ODF", "Quantidade ODF", "Qtd inspecionada", "Processo", "Resultado", ],
    ...usersData.map(({ createdAt, item, version, odf, amount, qtd, process, result }) => [
      format(new Date(createdAt), "dd/MM/yyyy HH:mm"),
      item,
      version,
      odf,
      amount,
      qtd,
      process,
      result,
    ]),
  ];

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
          <Button className="p-10 ">
            <CSVLink className="" filename="my-file.csv" data={csvData}>
              Baixar planilha
            </CSVLink>
          </Button>
        </div>
        <DataTable
          searchKey='item'
          columns={soldierColumns}
          data={usersData}
        />
      </div>
      <div className="">
      </div>
    </div>
  );
}

export default Table;