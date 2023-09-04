import { TbArrowWaveRightUp, TbCloud } from "react-icons/tb";

interface ThoughtsAnalyticsCardProps{
    count : number 
    isMine: boolean
}

export default function ThoughtsCount({count, isMine}: ThoughtsAnalyticsCardProps) {
    return <div className="bg-white flex-1 p-3 rounded border">
        <div className="flex flex-row items-center justify-between">
            <div className="text-xs font-medium text-slate-800">
                Thoughts
            </div>
            <TbCloud />
        </div>
        <div>
            <div className="text-lg font-medium">
                {count}
            </div>
            {isMine && <Analytics />}
        </div>
    </div>
}


function Analytics(){
    return <p className="text-xs text-muted-foreground flex justify-between items-center text-green-500">
        +20.1% <TbArrowWaveRightUp />
    </p>
}