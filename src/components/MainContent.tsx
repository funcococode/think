/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { api } from '@/utils/api';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { useToast } from './ui/use-toast';
import ThoughtContainer from './ThoughtContainer';
import { useSession } from 'next-auth/react';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { TbBrain, TbHeading } from 'react-icons/tb';
import { Input } from './ui/input';

export default function MainContent() {
    const {toast} = useToast();
    const [thought, setThought] = useState('');
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [addTitle, setAddTitle] = useState(false);

    const queryClient = api?.useContext();
    const {data, isLoading, refetch} = api?.usersRouter?.feed?.useQuery();
    const {mutateAsync, isLoading: isThoughtCreating} = api.thoughtsRouter.create.useMutation({});
    const {isFetching: isFactLoading, refetch: refetchFact} = api.openAiRouter?.randomFact.useQuery({},{
        enabled: false
    });
    async function getRandomFact(){
        const {data} = await refetchFact();
        if(data?.choices.length){
            setThought(data?.choices?.[0]?.message?.content!);
        }
    }

    async function handleCreateThought(){
        if(thought === '') return; 
        const payload = {
            title,
            content: thought
        }
        await mutateAsync(payload).catch(err => {
            toast({
                variant: 'destructive',
                title: 'Something went wrong!',
                description: 'Unable to share your thought at the moment. Something went wrong at our end!',
            })
        })
        toast({
            variant: 'success',
            title: 'Your thoughts are great!',
            description: 'World will look through your eyes.',
        })
        setThought('');
        await queryClient?.usersRouter?.feed?.invalidate();
    }

    return (
        <>
            <Card className='grid gap-2 sticky top-0 shadow-none z-50 px-6 py-4'>
                <div className='flex gap-2 items-center mb-3'>
                    <Button onClick={() => void setAddTitle(prev => !prev)} className={`flex items-center gap-2 ${addTitle && 'border-blue-700 text-blue-700 bg-blue-50'}`} variant={'outline'} size={'sm'}>
                       <TbHeading /> {addTitle ? 'Remove' : 'Add'} Title
                    </Button>
                    <Button onClick={() => void getRandomFact()} className={`flex items-center gap-2 `} variant={'outline'} size={'sm'}>
                       <TbBrain /> {isFactLoading ? "Thinking..." : "Random Fact"}
                    </Button>
                </div>
                {addTitle && <Input value={title} onChange={(e) => void setTitle(e?.target?.value)}  placeholder='Add your title here' className='px-0 border-none rounded-none shadow-none focus-visible:ring-0'/>}
                <Textarea 
                    name='thoughts' 
                    id='thoughts' 
                    value={thought}
                    onChange={(e) => setThought(e.target.value)}
                    placeholder='What are you thinking?'
                    className='rounded outline-none border-none px-0 focus-visible:ring-0 shadow-none'
                ></Textarea>
                <Button disabled={isThoughtCreating} onClick={() => void handleCreateThought()} className='flex text-sm items-center gap-2  justify-self-start bg-blue-700 hover:bg-blue-800 text-white'>
                    <FaPaperPlane />Share
                </Button>
            </Card>
            <div className='my-6 flex justify-between items-center'>
                <h1 className='text-xl font-bold'>Thoughts Feed</h1>
            </div>
            <ThoughtContainer data={data} isLoading={isLoading} refetch={refetch} />
        </>
    )
}
