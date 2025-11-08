// src/components/Countdown.tsx
import React, { useEffect, useState } from 'react'
import { diffHuman } from '../utils/ui'

export default function Countdown({ until }:{ until: Date | null }){
  const [txt,setTxt] = useState('—')
  useEffect(()=>{
    if(!until) { setTxt('—'); return }
    const tick = () => setTxt(diffHuman(until))
    tick()
    const id = setInterval(tick, 15_000)
    return ()=>clearInterval(id)
  },[until])
  return <span className="meta">{txt}</span>
}
