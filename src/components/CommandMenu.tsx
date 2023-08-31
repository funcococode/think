import {
  CommandDialog,
  CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator
} from "@/components/ui/command";
import { type Dispatch, type SetStateAction, useEffect, useState, type KeyboardEvent, type FormEvent } from "react";
import { TbCommand, TbLoader3, TbSearch } from "react-icons/tb";
import { api } from "@/utils/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { Button } from "./ui/button";

interface SearchResultProps{
  name: string | null;
  email: string | null;
  id: string;
}

export function CommandMenu() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResultProps[] | void | []>([]);
  const [searchType, setSearchType] = useState('philosophers');
  const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
      const down = (ev: KeyboardEvent<Element>) => {
        if (ev.key === "k" && (ev.metaKey || ev.ctrlKey)) {
          ev.preventDefault()
          setCommandOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, []);

    const {isFetching, refetch} = api?.usersRouter?.find?.useQuery({query},{
      enabled: false,
      _optimisticResults: "optimistic"
    })
  
    function handleChange(e: FormEvent<HTMLInputElement>){
      e.preventDefault();
      const value:string = (e.target as HTMLInputElement).value;
      setQuery(value);
    }
    useEffect(() =>{
      if(searchType === 'users'){
        if(query === ''){
          setSearchResult([]);
        }else{
            refetch().then(res => {
              setSearchResult(res?.data);
            }).catch(err => {
              console.log(err)
            })
        }
      }
    },[query]);
    
    return (
      <>
        <Button onClick={() => setCommandOpen(true)} variant={'outline'} className="flex justify-between items-center px-3 py-5 hover:bg-transparent hover:border-slate-800">
            <span className='flex items-center gap-2'>
                <TbSearch />
                Search
            </span>
            <span className='flex items-center text-sm text-slate-400'>
                <TbCommand /> + k
            </span>
        </Button>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandGroup>
            <div className="flex divide-x-4">
              <Select onValueChange={setSearchType} defaultValue="philosophers">
                <SelectTrigger className="w-48 gap-2 border-none shadow-none rounded-none">
                  <SelectValue placeholder="Search for" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="philosophers">Philosophers</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                </SelectContent>
              </Select>
              <Input onChange={(e) => handleChange(e)} placeholder="Type your search here" className="border-none rounded-none shadow-none"/>
            </div>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <h3 className="pl-3 font-medium text-sm py-3 text-slate-400 flex items-center gap-2">
              Results {isFetching && <TbLoader3 className="animate-spin duration-[2000]"/>}
            </h3>
            <ScrollArea className="max-h-64 w-full">
              {searchResult?.length != 0 && searchResult?.map(item => <Link href={`${item?.id}`} key={item?.id} className="cursor-pointer">
                <CommandItem>
                  {item?.name}
                </CommandItem>
              </Link>)}
            </ScrollArea>
          </CommandGroup>
          <CommandEmpty>{query != '' && 'Nothing found'}</CommandEmpty>
        </CommandDialog>
      </>
    )
  }
  