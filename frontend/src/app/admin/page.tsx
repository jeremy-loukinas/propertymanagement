'use client'
import { useState } from 'react'
import api from '../../lib/api'

export default function Admin(){
  const [url, setUrl] = useState('')
  const [unit, setUnit] = useState('1')
  const [propertyId, setPropertyId] = useState('1')
  const [resp, setResp] = useState<any>()
  return (
    <div className="card">
      <h1 style={{marginTop:0}}>Integrations</h1>
      <h2>Add Airbnb iCal URL</h2>
      <div className="row">
        <input className="input" placeholder="Property ID" value={propertyId} onChange={e=>setPropertyId(e.target.value)} />
        <input className="input" placeholder="Unit ID" value={unit} onChange={e=>setUnit(e.target.value)} />
      </div>
      <div className="row">
        <input className="input" placeholder="iCal URL" value={url} onChange={e=>setUrl(e.target.value)} style={{flex:1}}/>
      </div>
      <button className="btn" onClick={async()=>{
        const r = await api('/api/integrations/airbnb/ical',{method:'POST', body: JSON.stringify({property_id:Number(propertyId), unit_id:Number(unit), ical_url:url})})
        setResp(r)
      }}>Save</button>
      {resp && <pre>{JSON.stringify(resp,null,2)}</pre>}
    </div>
  )
}
