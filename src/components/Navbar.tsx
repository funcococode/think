/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { LuChevronRight} from "react-icons/lu"
import { SelectDropdown } from "./ui/SelectDropdown";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]
interface OptionProps{
  value: string,
  label: string
}
export default function Navbar() {
  const {data: session} = useSession();
  const [workspaces, setWorkspaces] = useState<OptionProps[] | undefined>([]);
  const {data:workspaceData, isFetching, refetch} =  api?.workspaceRouter?.getAll?.useQuery({userId: session?.user?.id ?? ''},{
    refetchOnWindowFocus: false
  })
  useEffect(() => {
    const parsedData:OptionProps[] | undefined = workspaceData?.map(item => ({value: item?.id, label: item?.name}))
    setWorkspaces(parsedData);
  },[workspaceData])
  return <nav className="flex gap-2 items-center justify-center">
      <SelectDropdown isFetching={isFetching} refetch={refetch} name="Workspace" options={workspaces} /><LuChevronRight className="text-slate-300"/>
      <SelectDropdown isFetching={isFetching} refetch={refetch} name="Folder" options={frameworks} /><LuChevronRight className="text-slate-300"/>
      <SelectDropdown isFetching={isFetching} refetch={refetch} name="Document" options={frameworks} />
  </nav>
}
