import { TbArrowRightTail, TbArrowWaveRightUp } from "react-icons/tb";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "../ui/card";
import DisplayPicture from "../DisplayPicture";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { CONSTANTS } from "fe_constants";
interface FollowingsAnalyticsCardProps{
    count: number, 
    following: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    }[] | undefined,
    isMine: boolean
}

export default function FollowingsCount({count, following, isMine}: FollowingsAnalyticsCardProps) {
    const router = useRouter();
    const {data:session} = useSession();

    return <AlertDialog>
        <AlertDialogTrigger className="flex-1">
            <div className="bg-white p-3 rounded border hover:border-slate-500">
                <div className="flex flex-row items-center justify-between">
                    <div className="text-xs font-medium text-slate-800">
                        Followings
                    </div>
                    <TbArrowRightTail />
                </div>
                <div>
                    <div className="text-lg font-medium text-left">
                        {count}
                    </div>
                    {isMine && <Analytics />}
                </div>
            </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex flex-row items-center justify-between">
                    Followings
                    <TbArrowRightTail />
                </AlertDialogTitle>
                <AlertDialogDescription>
                    <ScrollArea className="w-full py-4 h-80 ">
                        {following?.map(following => <div className="justify-stretch w-full p-0 flex h-16 border-none shadow-none hover:bg-transparent"  key={following?.id} >
                            <Card onClick={() => void router.push(`${CONSTANTS?.SOCIAL_URL}/${following?.id}`)} className="flex-1 flex gap-3 items-center p-2 border-none shadow-none">
                            <DisplayPicture src={following?.image} fallbackText={following?.name}/>
                            <div className="flex justify-between items-center flex-1">
                                <AlertDialogCancel style={{all: 'unset'}}>
                                    <p className="font-bold text-slate-800 text-left">{following?.name}</p>
                                    <p className="text-slate-400">{following?.email}</p>
                                </AlertDialogCancel>
                                {isMine && <Button variant="destructive" size='sm'>remove</Button>}
                            </div>
                        </Card></div>)}
                    </ScrollArea>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}


function Analytics(){
    return <p className="text-xs text-muted-foreground flex justify-between items-center text-green-500">
        +20.1% <TbArrowWaveRightUp />
    </p>
}