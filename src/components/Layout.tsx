import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

export default function Layout({children}) {
    const {data:session} = useSession();
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="w-full p-3 bg-slate-50">
                {children}
                <Toaster />
            </main>
            {session && <RightSideBar/>}
        </div>
    )
}
