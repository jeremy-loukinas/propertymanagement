'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
type Property = { id:number; name:string; address:string; city:string; state:string; zip:string; timezone:string; active:boolean }
type Unit = { id:number; property_id:number; unit_code:string; beds:number; baths:number }
export default function Assets(){
  const [props, setProps] = useState<Property[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [pform, setPForm] = useState({name:'', address:'', city:'', state:'', zip:'', timezone:'America/New_York'})
  const [uform, setUForm] = useState({property_id:'1', unit_code:'', beds:'1', baths:'1'})
  const refresh = ()=>{ api<Property[]>('/api/assets/properties').then(setProps); api<Unit[]>('/api/assets/units').then(setUnits) }
  useEffect(()=>{ refresh() },[])
  const addProp = async ()=>{ await api('/api/assets/properties',{method:'POST', body: JSON.stringify(pform)}); setPForm({name:'', address:'', city:'', state:'', zip:'', timezone:'America/New_York'}); refresh() }
  const addUnit = async ()=>{ await api('/api/assets/units',{method:'POST', body: JSON.stringify({...uform, property_id: Number(uform.property_id), beds:Number(uform.beds), baths:Number(uform.baths)})}); setUForm({property_id:'1', unit_code:'', beds:'1', baths:'1'}); refresh() }
  const delProp = async (id:number)=>{ if(!confirm('Delete this property and its units/bookings/tickets?')) return; await api(`/api/assets/properties/${id}`, {method:'DELETE'}); refresh() }
  const delUnit = async (id:number)=>{ if(!confirm('Delete this unit and related bookings/tickets?')) return; await api(`/api/assets/units/${id}`, {method:'DELETE'}); refresh() }
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h1 style={{marginTop:0}}>Add Property</h1>
        <div className="help">Create a property, then add its units (e.g., A1, B2).</div>
        <div className="row">
          <label>Name<input className="input" value={pform.name} onChange={e=>setPForm({...pform, name:e.target.value})}/></label>
          <label>Timezone<input className="input" value={pform.timezone} onChange={e=>setPForm({...pform, timezone:e.target.value})}/></label>
        </div>
        <div className="row"><label>Address<input className="input" style={{flex:1}} value={pform.address} onChange={e=>setPForm({...pform, address:e.target.value})}/></label></div>
        <div className="row">
          <label>City<input className="input" value={pform.city} onChange={e=>setPForm({...pform, city:e.target.value})}/></label>
          <label>State<input className="input" value={pform.state} onChange={e=>setPForm({...pform, state:e.target.value})}/></label>
          <label>Zip<input className="input" value={pform.zip} onChange={e=>setPForm({...pform, zip:e.target.value})}/></label>
        </div>
        <button className="btn" onClick={addProp}>Save</button>
      </div>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h1 style={{marginTop:0}}>Add Unit</h1>
        <div className="help">Units belong to a property and can be booked individually.</div>
        <div className="row">
          <label>Property<select className="select" value={uform.property_id} onChange={e=>setUForm({...uform, property_id:e.target.value})}>{props.map(p=> (<option key={p.id} value={p.id}>{p.name} (#{p.id})</option>))}</select></label>
          <label>Unit code<input className="input" value={uform.unit_code} onChange={e=>setUForm({...uform, unit_code:e.target.value})}/></label>
          <label>Beds<input className="input" type="number" value={uform.beds} onChange={e=>setUForm({...uform, beds:e.target.value})}/></label>
          <label>Baths<input className="input" type="number" value={uform.baths} onChange={e=>setUForm({...uform, baths:e.target.value})}/></label>
        </div>
        <button className="btn" onClick={addUnit}>Save</button>
      </div>
      <div className="card" style={{gridColumn:'span 12'}}>
        <h1 style={{marginTop:0}}>Properties & Units</h1>
        <table className="table">
          <thead><tr><th>Property</th><th>Unit</th><th>Beds</th><th>Baths</th><th></th></tr></thead>
          <tbody>
            {units.map(u=>{
              const prop = props.find(p=>p.id===u.property_id)
              return <tr key={u.id}><td>{prop?.name} (#{prop?.id})</td><td>{u.unit_code} (#{u.id})</td><td>{u.beds}</td><td>{u.baths}</td><td><button className="btn" onClick={()=>delUnit(u.id)}>Delete Unit</button> <button className="btn" onClick={()=>delProp(prop!.id)}>Delete Property</button></td></tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
