'use client';

import { DatabaseTimeline, type DatabaseRecord } from "@/components/timeline"
import axios from "axios"
import { useEffect, useState } from "react"



export default function Home() {

  const [inspectionData, setInspectionData] = useState<any>([]);
  const handleSubmit = async () => {
    try {
      axios.get('/api/load/timeline')
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



  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Linha do tempo</h1>
        </div>

        <DatabaseTimeline inspectionData={inspectionData} />
      </div>
    </main>
  )
}
