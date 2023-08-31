import type { GetServerSidePropsContext } from 'next';

import DisplayPicture from "@/components/DisplayPicture";
import ThoughtContainer from "@/components/ThoughtContainer";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import type { Like, Thoughts, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { TbExclamationCircle, TbLoader3, TbMail } from "react-icons/tb";
import { DatePickerWithRange } from '@/components/DatePicker';
import type { DateRange } from 'react-day-picker';
import FollowersCount from '@/components/analytics/FollowersCount';
import ThoughtsCount from '@/components/analytics/ThoughtsCount';
import FollowingsCount from '@/components/analytics/FollowingCount';
import ViewsCount from '@/components/analytics/ViewsCount';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';

interface UserProfileProps{
    id: string;
    thoughts: Thoughts[];
    name: string | null;
    email: string | null;
    image: string | null;
    createdAt: Date;
    likes: Like[];
    followers: User[];
    follows: User[];
    isMine?: boolean,
    isFollowed?: boolean
}

export default function Page(){
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const router = useRouter();
    const trpcUtils = api?.useContext();
    const {id} = router?.query ?? '';
    const {data: user, isLoading, isError} = api?.usersRouter?.get?.useQuery({
        userId: (typeof id === 'string') ? id : '',
        from: date?.from?.toISOString(),
        to: date?.to?.toISOString()
    },{
        refetchOnWindowFocus: false,
    })
    const {mutateAsync, isLoading: followLoader} = api?.usersRouter?.follow.useMutation({});
    async function toggleFollow(){
        await mutateAsync({userId: id as string},{
            onSuccess: () => {
                trpcUtils?.usersRouter?.get?.invalidate({userId: id as string}).catch(err => console.log(err));
            }
        })
    }

    if(isLoading){
        return <div className='h-full w-full grid place-content-center text-3xl'>
            <TbLoader3 className='animate-spin duration-[2000]'/>
        </div>
    }
    if(isError){
        return <div className='h-full w-full grid place-content-center text-3xl'>
            <div className='grid place-items-center gap-2 text-red-400'>
                <TbExclamationCircle className='animate-pulse duration-[2000]'/> An Error Occured
            </div>
        </div>     
    }

    return <>
    {
        <div>
            <header className="flex flex-col gap-5 bg-slate-50 border p-5 rounded">
                <div className="flex items-center gap-5">
                    <DisplayPicture className="w-36 h-36 text-5xl" src={user?.image} fallbackText={user?.name}/>
                    <div className="grid gap-1">
                        <h1 className="text-xl">
                            {user?.name}
                        </h1>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <TbMail /> {user?.email}
                        </p>
                        {
                            !user?.isMine && <Button disabled={followLoader} onClick={() => void toggleFollow()} size={"sm"} className={`mt-2 text-white hover:text-white flex items-center justify-between w-fit gap-5 ${user?.isFollowed ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-700  hover:bg-blue-800'}`}>
                                {user?.isFollowed ? 'Unfollow' : 'Follow'}
                            </Button>
                        }
                    </div>
                </div>
                <div className="flex flex-auto gap-1 items-center justify-end">
                    <ThoughtsCount isMine={user?.isMine ?? false} count={user?._count?.thoughts ?? 0} />
                    <FollowersCount isMine={user?.isMine ?? false} count={user?._count?.followers ?? 0} followers={user?.followers}/>
                    <FollowingsCount isMine={user?.isMine ?? false} count={user?._count?.follows ?? 0} following={user?.follows}/>
                    <ViewsCount isMine={user?.isMine ?? false} />
                </div>
            </header>
            <div className='my-6 flex justify-between items-center'>
                <h1 className='text-xl font-bold flex gap-2 items-center'>
                    Thoughts
                    {isLoading && <TbLoader3 className="animate-spin duration-[2000]" />}
                </h1>
                <div>
                    <DatePickerWithRange selector={setDate} />
                </div>
            </div>
            {user?.id && <ThoughtContainer data={user?.thoughts} />}
        </div>
    }
        
    </>
}

Page.layout = 'folder'


export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) {
      return { redirect: { destination: "/auth/login" } };
    }
    return {
      props: {},
    }
}
  