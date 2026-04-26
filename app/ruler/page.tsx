import Ruler from '@/components/ruler';
import React from 'react'
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <Ruler />
    </div>
  )
};

export default Page;


