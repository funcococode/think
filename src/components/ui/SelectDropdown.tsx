"use client"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRef, useState } from "react"
import { LuCog, LuFileCog, LuFileEdit, LuFilePlus, LuFolder, LuFolderCog, LuFolderPlus, LuHome, LuLoader, LuPlus, LuSettings2 } from "react-icons/lu"
import { Separator } from "./separator"
import { Input } from "./input"
import { api } from "@/utils/api"
import { useToast } from "./use-toast"
import type { TRPCClientErrorLike } from "@trpc/client"
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query"

interface DropdownProps {
  className?: string,
  name: string,
  options?: OptionProps[],
  refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<void | {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[], TRPCClientErrorLike>>,
  isFetching: boolean
}
interface OptionProps {
  value: string,
  label: string
}
export function SelectDropdown({ className = '', name, options, refetch, isFetching }: DropdownProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [newWFD, setNewWFD] = useState('');
  const workspaceRouter = api?.workspaceRouter?.create?.useMutation({});
  const { isLoading } = workspaceRouter;
  const handleCreateNew = async () => {
    if (!newWFD) {
      toast({
        variant: 'destructive',
        title: 'Name must not be empty'
      })
      return;
    }

    const result: unknown = await workspaceRouter.mutateAsync({ name: newWFD });
    toast({
      title: 'Workspace Created!'
    })
    setNewWFD('');
    await refetch();
    return result;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between items-center flex gap-3"
        >
          {name == 'Workspace' && (isFetching ? <LuLoader className="animate animate-spin" /> : <LuHome />)}
          {name == 'Folder' && (isFetching ? <LuLoader className="animate animate-spin" /> : <LuFolder />)}
          {name == 'Document' && (isFetching ? <LuLoader className="animate animate-spin" /> : <LuFileEdit />)}
          {value
            ? options?.find((option) => { return option.label.toLowerCase() === value })?.label
            : name}

        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Dialog>
          <Command>
            <CommandInput placeholder={`Search ${name}`} className="h-9" />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup className='max-h-[200px] overflow-y-scroll'>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue.toLowerCase())
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <Separator />
            <CommandGroup className="">
              <CommandItem className="py-0">
                <DialogTrigger asChild>
                  <Button variant={'ghost'} className="text-blue-700 text-xs flex justify-between p-0 gap-2 w-full ">
                    <span>
                      Create {name}
                    </span>
                    <LuPlus />
                  </Button>
                </DialogTrigger>
              </CommandItem>
            </CommandGroup>
          </Command>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex gap-5 flex-row">
              <div className="border border-slate-700 border-dashed w-fit p-2 rounded">
                {name == 'Workspace' && <LuHome className="text-4xl text-slate-700" />}
                {name == 'Folder' && <LuFolderPlus className="text-4xl text-slate-700" />}
                {name == 'Document' && <LuFilePlus className="text-4xl text-slate-700" />}
              </div>
              <div className="grid gap-1">
                <DialogTitle>
                  Create new {name.toLowerCase()}
                </DialogTitle>
                <DialogDescription>
                  Click create when you're done.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <form className="grid grid-cols-4 items-center gap-4">
                <Input id="name" name="name" value={newWFD} onChange={(e) => setNewWFD(e.target.value)} className="col-span-4" placeholder={`Your Awesome ${name}'s Name`} />
              </form>
            </div>
            <DialogFooter>
              <Button disabled={isLoading} onClick={() => void handleCreateNew()} className="bg-blue-700" type="submit">
                {isLoading ? <div className="flex gap-3 items-center">
                  <LuLoader className="animate-spin animate" />
                  Creating...
                </div>
                  : `Create ${name}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  )
}
