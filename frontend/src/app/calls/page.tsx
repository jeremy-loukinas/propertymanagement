'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'

type Call = { id:number; booking_id:number|null; guest_name:string; phone:string|null; issue:string; notes:string|null; priority:string; status:string; created_at:string; resolved_at:string|null }

export default function Calls(){
  const [items, setItems] = useState<Call[]>([])
  const [form, setForm] = useState({booking_id:'', guest_name:'', phone:'', issue:'', notes:'', priority:'P2'})
  const refresh = ()=> api<Call[]>('/api/calls').then(setItems).catch(console.error)
  useEffect(()=>{ refresh() },[])

  const submit = async ()=>{
    await api('/api/calls',{method:'POST', body: JSON.stringify({...form, booking_id: form.booking_id?Number(form.booking_id):null})})
    setForm({booking_id:'', guest_name:'', phone:'', issue:'', notes:'', priority:'P2'})
    refresh()
  }
  const resolve = async (id:number)=>{ await api(`/api/calls/${id}?status=Resolved`, {method:'PATCH'}); refresh() }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 5'}}>
        <h1 style={{marginTop:0}}>Log Service Call</h1>
        <div className="row">
          <input className="input" placeholder="Booking ID (optional)" value={form.booking_id} onChange={e=>setForm({...form, booking_id:e.target.value})} />
          <select className="select" value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
            <option>P0</option><option>P1</option><option>P2</option><option>P3</option>
          </select>
        </div>
        <div className="row"><input className="input" style={{flex:1}} placeholder="Guest name" value={form.guest_name} onChange={e=>setForm({...form, guest_name:e.target.value})} /></div>
        <div className="row"><input className="input" style={{flex:1}} placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} /></div>
        <div className="row"><input className="input" style={{flex:1}} placeholder="Issue" value={form.issue} onChange={e=>setForm({...form, issue:e.target.value})} /></div>
        <div className="row"><textarea className="textarea" style={{width:'100%', minHeight:100}} placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} /></div>
        <button className="btn" onClick={submit}>Create</button>
      </div>

      <div className="card" style={{gridColumn:'span 7'}}>
        <h1 style={{marginTop:0}}>Recent Calls</h1>
        <table className="table">
          <thead><tr><th>ID</th><th>When</th><th>Guest</th><th>Issue</th><th>Priority</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map(c=> (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
                <td>{c.guest_name}</td>
                <td>{c.issue}</td>
                <td><span className={`badge ${c.priority.toLowerCase()}`}>{c.priority}</span></td>
                <td>{c.status}</td>
                <td>{c.status!=='Resolved' && <button className="btn" onClick={()=>resolve(c.id)}>Resolve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
