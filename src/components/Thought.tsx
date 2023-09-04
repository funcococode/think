import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import moment from 'moment';
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { TbHeart, TbHeartFilled, TbShare } from 'react-icons/tb';
import { LiaComments } from 'react-icons/lia';
import { Button } from './ui/button';
import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import DisplayPicture from './DisplayPicture';
import ThoughtHeaderControls from './ThoughtHeaderControls';
import CommentSection from './CommentSection';
import { CONSTANTS } from 'fe_constants';
interface ThoughtPropsType{
    thought: Thought,
    refetch?: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<void | {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            password: string | null;
            emailVerified: Date | null;
            image: string | null;
        };
        likes: {
            userId: string;
            thoughtId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        id: string;
        content: string;
        updatedAt: Date;
    }[]>>
}
interface Thought {
    id: string;
    title: string | null,
    comments?: Comment[]
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
interface Comment{
    id: string;
    userId: string;
    thoughtId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function Thought({thought, refetch} : ThoughtPropsType) {
    const {data:session} = useSession();
    const userId = session?.user?.id ?? '';
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [commentSectionOpen,setCommentSectionOpen] = useState(false);
    const likeHandler = api?.thoughtsRouter?.like?.useMutation({});
    useEffect(() => {
        setLikesCount(thought?.likes?.length);
        const myLikeIdx = thought?.likes?.findIndex(item => ({...item, userId: userId, thoughtId: thought?.id}));
        if(myLikeIdx !== -1){
            setIsLiked(true);
        }
    },[])

    const handleLike = async () => {
        const {likeAdded} = await likeHandler?.mutateAsync({thoughtId: thought?.id});
        if(likeAdded){
            setIsLiked(true);
            setLikesCount(prev => prev + 1)
        }else{
            setIsLiked(false);
            setLikesCount(prev => prev - 1)
        }
    }
    return (
        <Card className='shadow-none divide-y'>
            <CardHeader className='flex flex-row items-center gap-3 py-4 space-y-0'>
                <Link href={`${CONSTANTS?.SOCIAL_URL}/${thought?.user?.id}`}>
                    <DisplayPicture  fallbackText={thought?.user?.name} src={thought?.user?.image ? thought?.user?.image : ''} />
                </Link>
                <div className='flex w-full justify-between'>
                    <CardTitle  className='gap-2 flex items-center'>
                        <Link href={`home/${thought?.user?.id}`}>
                            <div className='flex gap-1 flex-1 items-center'>
                                {thought?.user?.name} 
                            </div>
                        </Link>
                        <div className='text-xs font-light text-slate-400'>
                            {moment(thought?.updatedAt).fromNow()}
                        </div>
                    </CardTitle>
                    {thought?.user?.id === userId && <CardDescription className='capitalize flex items-center gap-2'>
                        <ThoughtHeaderControls title={thought?.title} thought={thought?.content} thoughtId={thought?.id} refetch={refetch}/>
                    </CardDescription>}
                </div>
            </CardHeader>
            <CardContent className='py-3 border-none grid gap-5 pl-20 relative'>
                <div className='absolute top-0 bottom-4 border-l border-gray-200 left-11'>
                </div>
                {thought?.title && <h1 className='text-3xl font-semibold'>
                    {thought?.title}
                </h1>}
                <p>
                    {thought?.content}
                </p>
                <div className='flex gap-2 mt-4'>
                    <Button size={'sm'} onClick={() => void handleLike()} variant={'ghost'} type='button' className={`transition-all duration-200 flex  py-1 px-4 items-center justify-between gap-5 bg-slate-100 hover:text-red-500 text-xs ${isLiked && 'text-red-500 bg-red-100 hover:bg-red-200'}`}>
                        <span className='flex items-center gap-1'>
                            {isLiked ? <TbHeartFilled /> : <TbHeart />}Likes
                        </span>
                        {likesCount != 0 && <span>
                            {likesCount} 
                        </span>}
                    </Button>
                    <Button onClick={() => setCommentSectionOpen(prev => !prev)} size={'sm'} variant={'ghost'} type='button' className={`transition-all duration-200 flex py-1 px-4 items-center justify-between gap-5 bg-slate-100 hover:bg-slate-200 text-xs`}>
                        <span className='flex items-center gap-1'>
                            <LiaComments /> Comments
                        </span>
                        {thought?.comments?.length != 0 && <span>
                            {thought?.comments?.length}
                        </span>}
                    </Button>
                    <Button size={'sm'} variant={'ghost'} type='button' className={`transition-all duration-200 flex py-1 px-4 items-center justify-between gap-5 bg-slate-100 hover:bg-slate-200 text-xs`}>
                        <span className='flex items-center gap-1'>
                            <TbShare /> Share
                        </span>
                        <span>
                            1.4k
                        </span>
                    </Button>
                </div>
            </CardContent>
            {commentSectionOpen && <CardFooter className='grid gap-3 border-none pt-4'>
                <CommentSection thoughtId={thought?.id} />
            </CardFooter>}
        </Card>
    )
}