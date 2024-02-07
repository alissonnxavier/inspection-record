import { FormsInspectionRecords } from '@/components/forms-inspections-record'
import { Navbar } from '@/components/navbar'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import { authConfig } from '@/lib/auth'

export default async function Home() {

  //@ts-ignore
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className='h-full'>
      <div className='flex pb-10 pt-10 '>
      <Navbar />
      </div>
      <div className='
          flex 
          align-middle
          justify-center
          items-center 
      '>
        
        <FormsInspectionRecords />
      </div>
    </div>
  )
}