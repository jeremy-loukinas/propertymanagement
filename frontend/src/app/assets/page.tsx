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
  const addUnit = async ()=>{
    await api('/api/assets/units',{method:'POST', body: JSON.stringify({...uform, property_id: Number(uform.property_id), beds:Number(uform.beds), baths:Number(uform.baths)})})
    setUForm({property_id:'1', unit_code:'', beds:'1', baths:'1'}); refresh()
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h1 style={{marginTop:0}}>Add Property</h1>
        <div className="row">
          <input className="input" placeholder="Name" value={pform.name} onChange={e=>setPForm({...pform, name:e.target.value})}/>
          <input className="input" placeholder="Timezone" value={pform.timezone} onChange={e=>setPForm({...pform, timezone:e.target.value})}/>
        </div>
        <div className="row"><input className="input" style={{flex:1}} placeholder="Address" value={pform.address} onChange={e=>setPForm({...pform, address:e.target.value})}/></div>
        <div className="row">
          <input className="input" placeholder="City" value={pform.city} onChange={e=>setPForm({...pform, city:e.target.value})}/>
          <input className="input" placeholder="State" value={pform.state} onChange={e=>setPForm({...pform, state:e.target.value})}/>
          <input className="input" placeholder="Zip" value={pform.zip} onChange={e=>setPForm({...pform, zip:e.target.value})}/>
        </div>
        <button className="btn" onClick={addProp}>Save</button>
      </div>

      <div className="card" style={{gridColumn:'span 6'}}>
        <h1 style={{marginTop:0}}>Add Unit</h1>
        <div className="row">
          <select className="select" value={uform.property_id} onChange={e=>setUForm({...uform, property_id:e.target.value})}>
            {props.map(p=> (<option key={p.id} value={p.id}>{p.name} (#{p.id})</option>))}
          </select>
          <input className="input" placeholder="Unit Code" value={uform.unit_code} onChange={e=>setUForm({...uform, unit_code:e.target.value})}/>
          <input className="input" type="number" placeholder="Beds" value={uform.beds} onChange={e=>setUForm({...uform, beds:e.target.value})}/>
          <input className="input" type="number" placeholder="Baths" value={uform.baths} onChange={e=>setUForm({...uform, baths:e.target.value})}/>
        </div>
        <button className="btn" onClick={addUnit}>Save</button>
      </div>

      <div className="card" style={{gridColumn:'span 12'}}>
        <h1 style={{marginTop:0}}>Properties & Units</h1>
        <table className="table">
          <thead><tr><th>Property</th><th>Unit</th><th>Beds</th><th>Baths</th></tr></thead>
          <tbody>
            {units.map(u=>{
              const prop = props.find(p=>p.id===u.property_id)
              return <tr key={u.id}><td>{prop?.name} (#{prop?.id})</td><td>{u.unit_code} (#{u.id})</td><td>{u.beds}</td><td>{u.baths}</td></tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
