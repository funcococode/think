import React from 'react'
import { TbExclamationCircle, TbLoader3 } from 'react-icons/tb'

export default function Error() {
  return (
    <div className='w-full h-full grid place-items-center text-red-500 gap-4'>
        <TbExclamationCircle className={`animate-pulse duration-[2000]`} />
        <span className='text-lg'>
          Something went wrong
        </span>
    </div>
  )
}
