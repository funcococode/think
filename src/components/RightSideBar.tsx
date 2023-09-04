import { useState } from "react"
import { DatePickerWithRange } from "./DatePicker"
import { Label } from "./ui/label"

export default function RightSideBar() {
  return <aside className='border-l h-screen sticky top-0 p-3 w-1/4 flex flex-col gap-5'>
    {/* <h1 className="text-slate-700">Filters</h1>
    <div className="grid gap-1">
      <Label className="text-slate-700 text-xs">Select a date</Label>
      <DatePickerWithRange />
    </div> */}
  </aside>
}
