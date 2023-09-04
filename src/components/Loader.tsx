import React from 'react'
import { TbLoader3 } from 'react-icons/tb'

export default function Loader() {
  return (
    <div className='w-full h-full grid place-content-center'>
        <TbLoader3 className={`animate-spin duration-[2000]`} />
    </div>
  )
}
