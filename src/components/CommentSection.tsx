import { api } from "@/utils/api";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TbMessageCircle2Filled } from "react-icons/tb";
import DisplayPicture from "./DisplayPicture";
import { ScrollArea } from "./ui/scroll-area";
import moment from "moment";
import { LiaClock } from "react-icons/lia";
import { useSession } from "next-auth/react";

interface CommentSectionProps{
    thoughtId: string, 
};

export default function CommentSection({thoughtId}: CommentSectionProps){
    const [newComment, setNewComment] = useState('');
    const {data:session} = useSession();
    const {data: comments, isLoading, refetch} = api?.commentsRouter?.getAll?.useQuery({thoughtId},{
        refetchOnWindowFocus: false
    })
    const addHandler = api?.commentsRouter?.create?.useMutation({});
    const deleteHandler = api?.commentsRouter?.delete?.useMutation({});
    async function add(){
        await addHandler?.mutateAsync({
            thoughtId,
            comment: newComment
        }).catch(err => {
            console.log(err);
        })
        await refetch();
        setNewComment('');
    };

    async function remove(commentId: string){
        await deleteHandler?.mutateAsync({commentId}).catch(err => console.log(err));
        await refetch();
    };

    return <>
        <div className="flex w-full items-center justi space-x-2">
            <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} type="text" placeholder="Share your views on this thought" className='flex-1'/>
            <Button onClick={() => void add()} type="submit" className="shadow-none border-none flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-500">
                <TbMessageCircle2Filled /> Add
            </Button>
        </div>
        <h1 className='text-xs font-semibold text-slate-600 mt-5'>All Comments</h1>
        <ScrollArea className="bg-slate-50 rounded p-5 max-h-[300px]">
            {!isLoading && !comments?.length && <p className="text-center text-sm text-slate-400">Be the first one to comment</p>}
            {isLoading && 'Loading...'}
            {
                comments?.length !== 0 && comments?.map(comment => <div key={comment?.id} className="group flex items-center gap-2 mb-5 last:mb-0">
                    <div>
                        <DisplayPicture src={comment?.user?.image} fallbackText={comment?.user?.name}/>
                    </div>
                    <div className="flex-1 grid">
                        <h1 className="text-xs text-slate-500">{comment?.user?.name}</h1>
                        <p className='text-sm'>{comment?.comment}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        {
                            (comment?.user?.id === session?.user?.id) && <Button onClick={() => void remove(comment?.id)} className="text-xs p-0 bg-transparent hover:bg-transparent hover:text-red-700 text-red-500 border-none shadow-none outline-none">remove</Button>
                        }
                        <p className='text-xs flex items-center gap-1 text-slate-400'>
                            <LiaClock />
                            {moment(comment?.createdAt?.toISOString()).fromNow()}
                        </p>
                    </div>
                </div>)
            }
        </ScrollArea>
    </>
}