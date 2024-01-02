"use client";
import { CSVLink } from "react-csv";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { DataTable } from "@/components/dataTable/data-table";
import { columns } from "@/components/dataTable/colums";

const Table = () => {

  const [usersData, setUsersData] = useState([]);
  const [press, setPress] = useState([]);

  const handleSubmit = async () => {
    try {
      axios.get('/api/register')
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
    ["ID", "item", "version", "odf", "amount", "qtd", "result", "createdAt"],
    ...usersData.map(({ id, item, version, odf, amount, qtd, result, createdAt }) => [
      id,
      item,
      version,
      odf,
      amount,
      qtd,
      result,
      createdAt,
    ]),
  ];

  return (
    <div className="w-screen h-screen align-middle items-center ">
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
          columns={columns}
          data={usersData}
        />
      </div>
      <div className="">
      </div>
    </div>
  );
}

export default Table;