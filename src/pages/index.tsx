'use client'

import { Button } from "@/components/ui/button";
import { authOptions } from "@/server/auth";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router"

export default function Home() {
  const router =  useRouter();
  return <div className="h-screen grid place-content-center">
    <div className="grid place-items-center gap-10">
      <h1 className='text-5xl font-bold '>Think.</h1>
      <div className="">
        <Button onClick={() => void router.push('/auth/login')} variant={'default'} size={'lg'} className="border-r-0 rounded-r-none">Login</Button>
        <Button onClick={() => void router.push('/auth/login')} variant={'outline'} className='border-l-0 rounded-l-none border-slate-400' size={'lg'}>Signup</Button>
      </div>
    </div>
  </div> 
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return { redirect: { destination: "/home" } };
  }
  return {
    props: {},
  }
}