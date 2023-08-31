import { signOut, useSession } from "next-auth/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { LuAtSign, LuLogOut, LuSettings, LuUser } from "react-icons/lu";
import { CommandMenu } from "./CommandMenu";
import { Button } from "./ui/button";
import DisplayPicture from "./DisplayPicture";
import { PopoverClose } from "@radix-ui/react-popover";
import NotificationCenter from "./NotificationCenter";
import { Separator } from "./ui/separator";

export default function Sidebar() {
    const {data: session, status} = useSession();
    
    return (
        <>
            {status === 'authenticated' && <aside className="border-r h-screen sticky top-0 p-3 w-1/4 flex flex-col gap-5">
                <Link href={'/'} className="font-bold">Think.</Link>
                <Popover>
                    <PopoverTrigger className='text-left flex items-center gap-2 px-3 py-1 rounded text-sm border'>
                        <DisplayPicture fallbackText={session?.user?.name} src={session?.user?.image ? session?.user?.image : ''} />
                        {session?.user?.name}
                    </PopoverTrigger>
                    <PopoverContent className="translate-x-3 divide-y p-0">
                        <header className="text-xs p-3 flex flex-col gap-2">
                            <p className="flex gap-3  items-center">
                                <LuAtSign /> {session?.user?.email}
                            </p>
                            {/* <Badge variant={'outline'} className="w-fit text-slate-300 text-xs font-light border-orange-300 text-orange-300">Free plan</Badge> */}
                        </header>
                        <main className="grid text-xs">
                            <PopoverClose>
                                <Link className="p-3 hover:bg-slate-50 flex gap-3 items-center" href={`home/${session?.user?.id}`}>
                                    <LuUser /> Profile
                                </Link>
                            </PopoverClose>
                            <PopoverClose>
                                <Link className="p-3 hover:bg-slate-50 flex gap-3 items-center" href="/profile">
                                    <LuSettings /> Settings
                                </Link>
                            </PopoverClose>
                            <button className="rounded-none text-left p-3 text-red-500 hover:text-white hover:bg-red-500 flex gap-3 items-center" onClick={() => void signOut()}>
                                <LuLogOut /> Logout
                            </button>
                        </main>
                    </PopoverContent>
                </Popover>
                <CommandMenu />
                <NotificationCenter />
            </aside>}
            
            {status === 'unauthenticated' && <aside className="border-r h-screen sticky top-0 p-3 w-1/4 flex flex-col gap-5">
                <div className='flex-1 grid place-content-center gap-3'>
                    <Link href={'/'} className="font-bold">Think.</Link>
                    <div>
                        <Button className="w-full">Login to Continue</Button>
                    </div>
                    <p className="text-xs text-slate-400 text-center relative my-4">
                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 block px-2 bg-white">||</span>
                        <Separator />
                    </p>
                    <div>
                        <Button variant={'outline'}>Create a new account</Button>
                    </div>
                </div>
            </aside>}
        </>
    )
}
