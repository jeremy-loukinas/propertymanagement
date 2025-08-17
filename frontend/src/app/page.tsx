'use client'
import { useEffect, useState } from 'react'
import api from '../lib/api'
type Overview = { arrivals:number; departures:number; inhouse:number; open_tickets:number; overdue_tickets:number; open_by_priority: Record<string,number>; day: string }
type PropertyRow = { property_id:number; property_name:string; inhouse:{booking_id:number; unit_id:number; guest_name:string|null; guest_photo_url:string|null}[] }
export default function Page(){
  const [m, setM] = useState<Overview | null>(null)
  const [props, setProps] = useState<PropertyRow[]>([])
  useEffect(()=>{ api<Overview>('/api/metrics/overview').then(setM).catch(console.error); api<PropertyRow[]>('/api/metrics/properties-overview').then(setProps).catch(console.error) },[])
  return (
    <div className="grid" style={{gap:16}}>
      <div className="kpis" style={{gridColumn:'span 12'}}>
        <div className="card kpi"><h3>Arrivals (today)</h3><div className="num">{m?.arrivals ?? '—'}</div></div>
        <div className="card kpi"><h3>Departures (today)</h3><div className="num">{m?.departures ?? '—'}</div></div>
        <div className="card kpi"><h3>In House (today)</h3><div className="num">{m?.inhouse ?? '—'}</div></div>
        <div className="card kpi"><h3>Open Tickets</h3><div className="num">{m?.open_tickets ?? '—'}</div></div>
      </div>
      <div className="card" style={{gridColumn:'span 12'}}>
        <h2 style={{marginTop:0}}>Today's Bookings by Property</h2>
        <div className="row" style={{flexWrap:'wrap', gap:18}}>
          {props.map(p => (
            <div key={p.property_id} className="card" style={{minWidth:260}}>
              <div style={{fontWeight:700, marginBottom:6}}>{p.property_name}</div>
              {p.inhouse.length===0 ? <div style={{color:'#8fa0b6'}}>No guests in-house</div> :
                p.inhouse.map(b => (
                  <div key={b.booking_id} className="row" style={{marginBottom:6}}>
                    {b.guest_photo_url ? <img className="avatar" src={b.guest_photo_url} alt="avatar"/> : <div className="avatar" />}
                    <div>{b.guest_name || 'Guest'}</div>
                    <div style={{marginLeft:'auto', opacity:.8}}>Unit #{b.unit_id}</div>
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
