/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { use, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";

import { TbBell, TbBellRinging2Filled, TbCircle0Filled, TbCircleFilled, TbHeart, TbMessage, TbNotification, TbUserPlus } from "react-icons/tb";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "./ui/card";
import { api } from "@/utils/api";
import Loader from "./Loader";
import Error from "./Error";
import { useRouter } from "next/router";
import { CONSTANTS } from "../../fe_constants";

interface EventProps{
    type: EventTypes,
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
    } & {
        id: string;
    }
}
enum EventTypes{
    follow = 'follow',
    like = 'like'
}
export default function NotificationCenter() {
    const {data: session} = useSession();
    const router = useRouter();
    const {data, isLoading, isError, refetch} = api?.notificationRouter?.list.useQuery({userId: session?.user?.id ?? ''})
    const {mutateAsync: markAsReadMutation} = api?.notificationRouter?.markRead.useMutation({});
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        if(data?.length){
            setUnreadCount(data?.filter(item => !item.seen).length);
        }
    },[data])
    useEffect(() => {
        const pusher = new Pusher('84844ae39290b7376c77', {
          cluster: process.env.PUSHER_API_CLUSTER! ?? 'ap2',
        });
    
        const channel = pusher.subscribe(session?.user?.id ?? '');
    
        channel.bind("fe", function (data:EventProps) {
            if(data){
                refetch().catch(err => console.log(err));
            }
        });
        channel.bind("le", function (data:EventProps) {
            if(data){
                refetch().catch(err => console.log(err));
            }
        });
        channel.bind("ce", function (data:EventProps) {
            if(data){
                refetch().catch(err => console.log(err));
            }
        });
    
        return () => {
          pusher.unsubscribe(session?.user?.id ?? "");
        };
    }, []);
    const handleOpenChange = async() => {
        const unreadNotifs = data?.filter(item => !item.seen)?.map(item => item.id);
        if(unreadCount === 0) return;

        unreadNotifs && await markAsReadMutation({
            notifId: unreadNotifs
        }).catch(err => console.log(err));

        await refetch();
    }
    return (
        <AlertDialog onOpenChange={() => void handleOpenChange()}>
            <AlertDialogTrigger>
                <div className={`flex items-center justify-between ${data && unreadCount > 0 ? 'bg-teal-50 border-teal-50 text-teal-500': 'bg-white'} p-3 rounded border hover:border-slate-500`}>
                    <div className="flex items-center gap-2">
                        {unreadCount ? <TbBellRinging2Filled /> : <TbBell />}
                        <div className="text-sm font-medium">
                            Notifications
                        </div>
                    </div>
                    <div>
                        <div className="text-xs">
                            {data && unreadCount > 0 && unreadCount}
                        </div>
                    </div>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex flex-row items-center justify-between">
                        Notifications
                        <TbNotification />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <ScrollArea className="w-full py-4 h-80">
                            {isLoading && <div className="text-3xl"><Loader /></div>}
                            {isError && <div className="text-3xl"><Error /></div>}
                            {data?.map((item,idx) => <AlertDialogCancel className="justify-stretch w-full p-0 flex h-12 border-none shadow-none hover:bg-transparent"  key={idx}>
                                <Card onClick={() => void router.push(`${CONSTANTS?.SOCIAL_URL}/${item?.sender?.id}`)} className="flex-1 flex gap-3 items-center p-2 border-none shadow-none">
                                    {item?.type === 'follow' && <TbUserPlus className="text-green-600"/> }
                                    {item?.type === 'like' && <TbHeart className='text-red-500' /> }
                                    {item?.type === 'comment' && <TbMessage className='text-blue-500' /> }
                                    <div className="flex justify-between items-center flex-1">
                                        <div className="">
                                            <p className="text-slate-800 text-left font-light">
                                                <span className='font-semibold'>{item?.sender?.name}</span>
                                                {item?.type === 'follow' && " started following you"}
                                                {item?.type === 'like' && " liked your thought"}
                                                {item?.type === 'comment' && " commented on your thought"}
                                            </p>
                                        </div>
                                        {!item?.seen && <TbCircleFilled className="text-blue-500 text-xs"/>}
                                    </div>
                                </Card>
                            </AlertDialogCancel>)}
                        </ScrollArea>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
