'use client'
import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api'

type Booking = { id:number, unit_id:number, start_date:string, end_date:string }
function addDays(d: Date, days:number){ const nd = new Date(d); nd.setDate(nd.getDate()+days); return nd }
function fmt(d:Date){ return d.toISOString().slice(0,10) }

export default function Bookings(){
  const [items, setItems] = useState<Booking[]>([])
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(addDays(new Date(), 14))

  useEffect(()=>{
    api<Booking[]>(`/api/bookings?start=${fmt(start)}&end=${fmt(end)}`).then(setItems).catch(console.error)
  },[start, end])

  const days = useMemo(()=>{
    const arr: Date[] = []
    let d = new Date(start)
    while(d <= end){ arr.push(new Date(d)); d = addDays(d,1) }
    return arr
  },[start, end])

  const unitIds = Array.from(new Set(items.map(i=>i.unit_id))).sort()

  return (
    <div className="card">
      <h1 style={{marginTop:0}}>Bookings</h1>
      <div className="row" style={{marginBottom:12}}>
        <label>Start <input className="input" type="date" value={fmt(start)} onChange={e=>setStart(new Date(e.target.value))}/></label>
        <label>End <input className="input" type="date" value={fmt(end)} onChange={e=>setEnd(new Date(e.target.value))}/></label>
      </div>
      <div className="calendar">
        <div className="grid">
          <div></div>
          {days.map(d=>(<div key={d.toISOString()} className="cell" style={{padding:4, fontSize:12}}>{fmt(d).slice(5)}</div>))}
          {unitIds.map(u=> (
            <>
              <div key={`u-${u}`} className="cell" style={{display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>Unit {u}</div>
              {days.map(d=>{
                const dateStr = fmt(d)
                const active = items.some(b => b.unit_id===u && b.start_date<=dateStr && b.end_date>=dateStr)
                return <div key={`c-${u}-${dateStr}`} className="cell" style={{background: active?'#0f204a':'transparent'}} />
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
