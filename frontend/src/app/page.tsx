'use client'
import { useEffect, useState } from 'react'
import api from '../lib/api'

type Overview = {
  arrivals:number; departures:number; inhouse:number; open_tickets:number;
  overdue_tickets:number; open_by_priority: Record<string,number>; day: string
}
export default function Page(){
  const [m, setM] = useState<Overview | null>(null)
  useEffect(()=>{ api<Overview>('/api/metrics/overview').then(setM).catch(console.error) },[])
  return (
    <div className="grid" style={{gap:16}}>
      <div className="kpis" style={{gridColumn:'span 12'}}>
        <div className="card kpi"><h3>Arrivals</h3><div className="num">{m?.arrivals ?? '—'}</div></div>
        <div className="card kpi"><h3>Departures</h3><div className="num">{m?.departures ?? '—'}</div></div>
        <div className="card kpi"><h3>In House</h3><div className="num">{m?.inhouse ?? '—'}</div></div>
        <div className="card kpi"><h3>Open Tickets</h3><div className="num">{m?.open_tickets ?? '—'}</div></div>
      </div>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h2 style={{marginTop:0}}>Open Tickets by Priority</h2>
        <ul>
          {['P0','P1','P2','P3'].map(p=> (<li key={p}><span className={`badge ${p.toLowerCase()}`}>{p}</span> — {m?.open_by_priority?.[p] ?? 0}</li>))}
        </ul>
      </div>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h2 style={{marginTop:0}}>Overdue Tickets</h2>
        <div className="num">{m?.overdue_tickets ?? 0}</div>
      </div>
    </div>
  )
}
