'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'

type Ticket = { id:number; title:string; description:string; priority:string; status:string; category:string; created_at:string }
function Pri({p}:{p:string}){ return <span className={`badge ${p.toLowerCase()}`}>{p}</span> }

export default function Tickets(){
  const [items, setItems] = useState<Ticket[]>([])
  const [form, setForm] = useState({property_id:1, unit_id:'', booking_id:'', priority:'P2', category:'Maintenance', title:'', description:''})

  const refresh = ()=> api<Ticket[]>('/api/tickets').then(setItems).catch(console.error)
  useEffect(()=>{ refresh() },[])

  const updateStatus = async (id:number, status:string)=>{
    await api(`/api/tickets/${id}?status=${encodeURIComponent(status)}`, {method:'PATCH'}); refresh();
  }

  const submit = async ()=>{
    await api('/api/tickets/', {method:'POST', body: JSON.stringify({...form, property_id: Number(form.property_id), unit_id: form.unit_id?Number(form.unit_id):null, booking_id: form.booking_id?Number(form.booking_id):null})})
    setForm({property_id:1, unit_id:'', booking_id:'', priority:'P2', category:'Maintenance', title:'', description:''})
    refresh()
  }

  const byStatus = (s:string)=> items.filter(i=>i.status===s)

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 5'}}>
        <h1 style={{marginTop:0}}>New Ticket</h1>
        <div className="row"><label>Property ID <input className="input" value={form.property_id} onChange={e=>setForm({...form, property_id: Number(e.target.value)})}/></label></div>
        <div className="row">
          <input className="input" placeholder="Unit ID (optional)" value={form.unit_id} onChange={e=>setForm({...form, unit_id: e.target.value})}/>
          <input className="input" placeholder="Booking ID (optional)" value={form.booking_id} onChange={e=>setForm({...form, booking_id: e.target.value})}/>
          <select className="select" value={form.priority} onChange={e=>setForm({...form, priority: e.target.value})}>
            <option>P0</option><option>P1</option><option>P2</option><option>P3</option>
          </select>
          <select className="select" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
            <option>Maintenance</option><option>Cleaning</option><option>Guest Support</option><option>Other</option>
          </select>
        </div>
        <div className="row"><input className="input" style={{flex:1}} placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></div>
        <div className="row"><textarea className="textarea" style={{width:'100%', minHeight:100}} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></div>
        <button className="btn" onClick={submit}>Create Ticket</button>
      </div>

      <div className="card" style={{gridColumn:'span 7'}}>
        <h1 style={{marginTop:0}}>Kanban</h1>
        <div className="kanban">
          {['New','In Progress','Waiting','Done'].map(col=> (
            <div key={col} className="col">
              <div style={{fontWeight:700, marginBottom:6}}>{col}</div>
              {byStatus(col).map(t=> (
                <div className="ticket" key={t.id}>
                  <div className="row" style={{justifyContent:'space-between'}}>
                    <div><Pri p={t.priority}/> {t.category}</div>
                    <small>{new Date(t.created_at).toLocaleString()}</small>
                  </div>
                  <div style={{fontWeight:700}}>{t.title}</div>
                  <div style={{color:'#b6c3d6'}}>{t.description}</div>
                  <div className="row" style={{marginTop:8}}>
                    {['New','In Progress','Waiting','Done'].filter(s=>s!==t.status).map(s=> (
                      <button key={s} className="btn" onClick={()=>updateStatus(t.id, s)}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
