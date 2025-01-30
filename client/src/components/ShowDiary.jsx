import React from 'react'
import diarylogo from "../assets/dailythought.png"
import { Link } from 'react-router-dom'
export default function ShowDiary({diary}) {
  return (
    <Link to={`/diary/${diary.diaryId}`} className='sm:w-40 w-36 relative overflow-hidden rounded-md shadow-md shadow-black'>
        <img className='w-full' src={diarylogo} alt="" />
        <span className='absolute text-[10px] text-slate-300 font-bold sm:top-[103px] sm:left-[54px] top-[95px] left-[47px] '>{diary.date}</span>
    </Link>
  )
}
