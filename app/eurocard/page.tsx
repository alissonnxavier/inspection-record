
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth';
import { redirect } from 'next/navigation';
import FormEurocard from '@/components/eurocard-form';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react'

export const Page = async () => {

  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={
      <div className="flex py-20 w-full items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <FormEurocard />
    </Suspense>
  )
};

export default Page;
