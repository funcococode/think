import React, { useRef, useState } from 'react';
import {TbArchive, TbChevronDown, TbChevronUp, TbPencil, TbTrash} from 'react-icons/tb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
  
import { api } from '@/utils/api';
import { useToast } from './ui/use-toast';
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { DialogClose } from '@radix-ui/react-dialog';

interface ThoughtHeaderControlPropsType {
    title: string | null,
    thought: string,
    thoughtId: string,
    refetch?: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<void | {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            password: string | null;
            emailVerified: Date | null;
            image: string | null;
        };
        id: string;
        content: string;
        updatedAt: Date;
    }[]>>
}
export default function ThoughtHeaderControls({title, thought, thoughtId, refetch}: ThoughtHeaderControlPropsType) {
    const [menuOpen,setMenuOpen] = useState(false);
    const [currentDialog, setCurrentDialog] = useState<string | null>(null);
    const updateThoughtRef = useRef<HTMLTextAreaElement>(null);
    const updateThoughtTitleRef = useRef<HTMLTextAreaElement>(null);
    const {toast} = useToast();
    
    const thoughtDeleteHandler = api.thoughtsRouter?.delete?.useMutation({});
    const thoughtEditHandler = api.thoughtsRouter?.update?.useMutation({});

    const handleDelete = async () => {
        await thoughtDeleteHandler?.mutateAsync({thoughtId}).catch(err => {
            console.log(err);
            toast({
                variant:'destructive',
                title: 'Something went wrong.',
                description: 'Unable to delete thought at the moment.'
            })
        });
        toast({
            title: 'Thought Deleted Successfully',
        })
        await refetch();
    }

    const handleUpdate = async () => {
        const updatedThought = updateThoughtRef?.current?.value;
        const updatedThoughtTitle = updateThoughtTitleRef?.current?.value ?? undefined;
        if(updatedThought === '') return;
        await thoughtEditHandler?.mutateAsync({
            title: updatedThoughtTitle,
            content: updatedThought!,
            thoughtId: thoughtId
        }).catch(err => {
            console.log(err);
            toast({
                variant:'destructive',
                title: 'Something went wrong.',
                description: 'Unable to update thought at the moment.'
            })
        });
        toast({
            title: 'Thought Updated Successfully',
        })
        await refetch();
    }

    return (
        <Dialog>
            <DropdownMenu onOpenChange={() => setMenuOpen(prev => !prev)}>
                <DropdownMenuTrigger className={`p-2 cursor-pointer rounded-full hover:bg-slate-200 outline-none ${menuOpen && 'bg-slate-300'}`}>
                    {menuOpen ? <TbChevronUp /> : <TbChevronDown />}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DialogTrigger asChild onClick={() => setCurrentDialog('edit')}>
                        <DropdownMenuItem className='flex gap-2 items-center'>
                            <TbPencil />Edit
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem className='flex gap-2 items-center'>
                        <TbArchive />Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild onClick={() => setCurrentDialog('delete')}>
                        <DropdownMenuItem className='flex gap-2 items-center text-red-500 hover:bg-red-500 hover:text-red-100'>
                            <TbTrash />Delete
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                {
                    currentDialog === 'delete' && <>
                        <DialogHeader>
                            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Are you sure you want to permanently
                                delete this thought from our servers?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => void handleDelete()} className='bg-red-500 text-red-50 hover:bg-red-600'> Delete</Button>
                        </DialogFooter>
                    </>
                }
                
                {
                    currentDialog === 'edit' && <>
                        <DialogHeader>
                            <DialogTitle>Edit thought</DialogTitle>
                            <DialogDescription>
                                Alter your thought here. Click update when you are done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                {title && <div className='col-span-12' >
                                    <Label className='text-sm text-slate-400 mb-1'>Title</Label>
                                    <Input defaultValue={title} id="editTitle" ref={updateThoughtTitleRef} />
                                </div>
                                }
                                <div className="col-span-12">
                                    <Label className='text-sm text-slate-400 mb-1'>Thought</Label>
                                    <Textarea id="editThought" defaultValue={thought} ref={updateThoughtRef} className="h-96" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button onClick={() => void handleUpdate()} className='bg-blue-700 text-blue-50 hover:bg-blue-800'>Update</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                }
                
            </DialogContent>
        </Dialog>
    )
}
