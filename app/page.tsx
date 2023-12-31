import { FormsInspectionRecords } from '@/components/forms-inspections-record'
import { Navbar } from '@/components/navbar'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className='h-screen'>
        <div className='flex justify-end p-10'>
          <Navbar />
        </div>
        <div className='
          flex 
          align-middle
          justify-center
          items-center 
          h-5/6
      '>
          <FormsInspectionRecords />
        </div>
      </div>
    </>
  )
}