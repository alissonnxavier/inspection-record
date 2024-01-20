'use client';

import { CSVLink } from "react-csv";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { threaderColumns } from "@/components/dataTable/threader-columns";
import { Navbar } from "@/components/navbar";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { GridLoader } from 'react-spinners';
import { format } from "date-fns";

const Table = () => {
  const { data: session, status } = useSession();
  const [usersData, setUsersData] = useState([]);

  const handleSubmit = async () => {
    try {
      axios.get('/api/register/threader')
        .then((response) => { setUsersData(response.data) });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleSubmit();
  }, [setUsersData]);

  console.log(usersData)

  const csvData = [
    ["Data", "item", "Revisão", "ODF", "quantidade ODF", "Qtd isnpecionada", "Processo", "Resultado", "Qualidade"],
    ...usersData.map(({ createdAt, item, version, odf, amount, qtd, process, result, inspector }) => [
      format(new Date(createdAt), "dd/MM/yyyy HH:mm"),
      item,
      version,
      odf,
      amount,
      qtd,
      process,
      result,
      inspector,
    ]),
  ];

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
              <CSVLink className="" filename="my-file.csv" data={csvData}>
                Baixar planilha
              </CSVLink>
            </Button>
          </div>
        </div>
        <DataTable
          searchKey='item'
          columns={threaderColumns}
          data={usersData}
        />
      </div>
    </div>
  );
}

export default Table;