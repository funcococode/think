import { TbArrowWaveRightUp, TbEye } from "react-icons/tb";

interface ViewsAnalyticsCardProps{
    isMine: boolean
}

export default function ViewsCount({isMine}: ViewsAnalyticsCardProps) {
    return isMine && <div className="bg-white flex-1 p-3 rounded border">
        <div className="flex flex-row items-center justify-between">
            <div className="text-xs font-medium text-slate-800">
                Views
            </div>
            <TbEye />
        </div>
        <div>
            <div className="text-lg font-medium">
                20
            </div>
            <Analytics />
        </div>
    </div>
}


function Analytics(){
    return <p className="text-xs text-muted-foreground flex justify-between items-center text-green-500">
        +20.1% <TbArrowWaveRightUp />
    </p>
}