import React, { useEffect } from 'react'
import { Skeleton } from './ui/skeleton';
import Thought from './Thought';
interface ThoughtContainerPropsType{
    data?: Thought[] | void,
    isLoading? : boolean
}
interface Thought {
    id: string;
    title: string | null,
    content: string;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
    likes: {
        userId: string;
        thoughtId: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    updatedAt: Date;
}
export default function ThoughtContainer({data, isLoading, refetch} : ThoughtContainerPropsType) {
    return (
        <div className='flex flex-col gap-5'>
            {isLoading && 
                <Skeleton className="w-full border py-4 px-5 rounded grid gap-5 divide-y mt-3">
                    <Skeleton className='w-2/3 h-[10px] rounded' />
                    <div className='mt-4 grid gap-3'>
                        <Skeleton className='w-1/3 h-[10px] rounded' />
                        <Skeleton className='w-1/2 h-[10px] rounded' />
                        <Skeleton className='w-1/4 h-[10px] rounded' />
                    </div>
                </Skeleton>
            }
            {data?.map(thought => <Thought key={thought?.id} thought={thought} refetch={refetch}/>)}
        </div>
    )
}
