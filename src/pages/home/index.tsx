import MainContent from '@/components/MainContent'
import React from 'react'
import { authOptions } from "@/server/auth";
import { type GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function Main() {
  return <MainContent />
}
Main.layout = 'folder'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) {
      return { redirect: { destination: "/auth/login" } };
    }
    return {
      props: {},
    }
}
  