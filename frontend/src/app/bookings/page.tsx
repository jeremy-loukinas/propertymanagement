'use client'
import { useEffect, useMemo, useState } from 'react'
import api from '../../lib/api'
type Guest = { id:number; first_name:string; last_name:string; photo_url:string|null }
type Row = { id:number; start_date:string; end_date:string; unit_id:number; unit_code:string; property_id:number; property_name:string; source:string; guest: Guest | null }
function addDays(d: Date, days:number){ const nd = new Date(d); nd.setDate(nd.getDate()+days); return nd }
function fmt(d:Date){ return d.toISOString().slice(0,10) }
export default function Bookings(){
  const [items, setItems] = useState<Row[]>([])
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(addDays(new Date(), 14))
  const [guests, setGuests] = useState<Guest[]>([])
  const [assign, setAssign] = useState({booking_id:'', guest_id:''})
  const [newGuest, setNewGuest] = useState({first_name:'', last_name:'', email:'', phone:'', photo_url:''})
  const refresh = ()=> { api<Row[]>(`/api/bookings/details?start=${fmt(start)}&end=${fmt(end)}`).then(setItems); api<Guest[]>('/api/guests').then(setGuests).catch(console.error) }
  useEffect(()=>{ refresh() },[start, end])
  const days = useMemo(()=>{ const arr: Date[]=[]; let d=new Date(start); while(d<=end){ arr.push(new Date(d)); d = addDays(d,1) } return arr },[start, end])
  const unitRows = useMemo(()=>{ const byUnit = new Map<number, Row[]>(); items.forEach(i=>{ if(!byUnit.has(i.unit_id)) byUnit.set(i.unit_id, []); byUnit.get(i.unit_id)!.push(i) }); return Array.from(byUnit.entries()).sort((a,b)=> a[0]-b[0]) },[items])
  const createGuest = async ()=>{ const g = await api<Guest>('/api/guests/', {method:'POST', body: JSON.stringify(newGuest)}); setNewGuest({first_name:'', last_name:'', email:'', phone:'', photo_url:''}); setGuests([g, ...guests]) }
  const linkGuest = async ()=>{ if(!assign.booking_id || !assign.guest_id) return; await api(`/api/bookings/${assign.booking_id}/assign-guest?guest_id=${assign.guest_id}`, {method:'PATCH'}); setAssign({booking_id:'', guest_id:''}); refresh() }
  const deleteBooking = async (id:number)=>{ if(!confirm('Delete this booking?')) return; await api(`/api/bookings/${id}`, {method:'DELETE'}); refresh() }
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 8'}}>
        <h1 style={{marginTop:0}}>Bookings</h1>
        <div className="row" style={{marginBottom:12}}>
          <label>Start date<span className="help">First day included in the calendar range.</span><input className="input" type="date" value={fmt(start)} onChange={e=>setStart(new Date(e.target.value))}/></label>
          <label>End date<span className="help">Last day included in the calendar range.</span><input className="input" type="date" value={fmt(end)} onChange={e=>setEnd(new Date(e.target.value))}/></label>
        </div>
        <div className="calendar">
          <div className="grid">
            <div></div>
            {days.map(d=>(<div key={d.toISOString()} className="cell" style={{padding:4, fontSize:12}}>{fmt(d).slice(5)}</div>))}
            {unitRows.map(([unitId, rows])=> (
              <div key={`row-${unitId}`} style={{display:'contents'}}>
                <div className="cell" style={{display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>
                  Unit {rows[0]?.unit_code || unitId}
                </div>
                {days.map(d=>{
                  const dateStr = fmt(d)
                  const active = rows.filter(b => b.start_date<=dateStr && b.end_date>=dateStr)
                  return (
                    <div key={`c-${unitId}-${dateStr}`} className="cell" style={{padding:4}}>
                      {active.map(a => (
                        <div key={`b-${a.id}-${dateStr}`} className="slot" title={`${a.property_name} • ${a.start_date}→${a.end_date}`}>
                          {a.guest?.photo_url ? <img className="avatar" src={a.guest.photo_url} alt="avatar"/> : <div className="avatar" />}
                          <div>{a.guest ? `${a.guest.first_name} ${a.guest.last_name}` : '—'}</div>
                          <button className="btn" style={{marginLeft:8}} onClick={()=>deleteBooking(a.id)}>Delete</button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{gridColumn:'span 4'}}>
        <h2 style={{marginTop:0}}>Assign Guest to Booking</h2>
        <div className="help">Enter a Booking ID and select a guest to link them.</div>
        <div className="row">
          <input className="input" placeholder="Booking ID" value={assign.booking_id} onChange={e=>setAssign({...assign, booking_id:e.target.value})}/>
          <select className="select" value={assign.guest_id} onChange={e=>setAssign({...assign, guest_id:e.target.value})}>
            <option value="">Select guest...</option>
            {guests.map(g=> (<option key={g.id} value={g.id}>{g.first_name} {g.last_name} (#{g.id})</option>))}
          </select>
          <button className="btn" onClick={linkGuest}>Link</button>
        </div>
        <h2>New Guest</h2>
        <div className="help">Quickly add a guest to link to future bookings.</div>
        <div className="row">
          <input className="input" placeholder="First name" value={newGuest.first_name} onChange={e=>setNewGuest({...newGuest, first_name:e.target.value})}/>
          <input className="input" placeholder="Last name" value={newGuest.last_name} onChange={e=>setNewGuest({...newGuest, last_name:e.target.value})}/>
        </div>
        <div className="row">
          <input className="input" placeholder="Email" value={newGuest.email} onChange={e=>setNewGuest({...newGuest, email:e.target.value})}/>
          <input className="input" placeholder="Phone" value={newGuest.phone} onChange={e=>setNewGuest({...newGuest, phone:e.target.value})}/>
        </div>
        <div className="row">
          <input className="input" placeholder="Photo URL (optional)" value={newGuest.photo_url} onChange={e=>setNewGuest({...newGuest, photo_url:e.target.value})} style={{flex:1}}/>
        </div>
        <button className="btn" onClick={createGuest}>Create Guest</button>
      </div>
    </div>
  )
}
