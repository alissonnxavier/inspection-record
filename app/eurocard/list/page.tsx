'use client';

import { useSession } from "next-auth/react";
import ListaEurocard from '@/components/eurocard-list';
import { Loader2 } from 'lucide-react';
import React, { Suspense } from 'react'
import { redirect } from "next/navigation";

export const Page = () => {

  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <Suspense fallback={
      <div className="flex py-20 w-full items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <ListaEurocard />
    </Suspense>
  )
};

export default Page;
