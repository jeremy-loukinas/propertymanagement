'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
type Vendor = { id:number; name:string; phone:string|null; email:string|null; insurance_expires_on:string|null; notes:string|null }
export default function Vendors(){
  const [items, setItems] = useState<Vendor[]>([])
  const [form, setForm] = useState({name:'', phone:'', email:'', insurance_expires_on:'', notes:''})
  const refresh = ()=> api<Vendor[]>('/api/vendors').then(setItems).catch(console.error)
  useEffect(()=>{ refresh() },[])
  const submit = async ()=>{ await api('/api/vendors',{method:'POST', body: JSON.stringify({...form, insurance_expires_on: form.insurance_expires_on || null})}); setForm({name:'', phone:'', email:'', insurance_expires_on:'', notes:''}); refresh() }
  const remove = async (id:number)=>{ if(!confirm('Delete this vendor?')) return; await api(`/api/vendors/${id}`, {method:'DELETE'}); refresh() }
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 5'}}>
        <h1 style={{marginTop:0}}>Add Vendor</h1>
        <div className="help">Vendors are external partners like cleaning, maintenance, or HVAC.</div>
        <div className="row"><label>Name<input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></label></div>
        <div className="row">
          <label>Phone<input className="input" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></label>
          <label>Email<input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></label>
        </div>
        <div className="row">
          <label>Insurance expires<input className="input" type="date" value={form.insurance_expires_on} onChange={e=>setForm({...form, insurance_expires_on:e.target.value})}/></label>
        </div>
        <div className="row"><label>Notes<textarea className="textarea" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/></label></div>
        <button className="btn" onClick={submit}>Save</button>
      </div>
      <div className="card" style={{gridColumn:'span 7'}}>
        <h1 style={{marginTop:0}}>Vendors</h1>
        <table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Insurance</th><th></th></tr></thead>
          <tbody>
            {items.map(v=> (<tr key={v.id}><td>{v.name}</td><td>{v.phone}</td><td>{v.email}</td><td>{v.insurance_expires_on || '—'}</td><td><button className="btn" onClick={()=>remove(v.id)}>Delete</button></td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
