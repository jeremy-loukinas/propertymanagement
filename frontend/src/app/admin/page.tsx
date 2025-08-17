'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
type ICal = { id:number; type:string; label:string; config_json:string; status:string; last_sync_at:string|null }
type Stats = { ical_integrations:number; last_sync_at:string|null; total_bookings:number }
export default function Admin(){
  const [url, setUrl] = useState('')
  const [unit, setUnit] = useState('1')
  const [propertyId, setPropertyId] = useState('1')
  const [resp, setResp] = useState<any>()
  const [syncMsg, setSyncMsg] = useState<string>('')
  const [list, setList] = useState<ICal[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  const refresh = ()=> { api<ICal[]>('/api/integrations/airbnb/ical').then(setList); api<Stats>('/api/integrations/stats').then(setStats) }
  useEffect(()=>{ refresh() },[])

  const save = async()=>{
    const r = await api('/api/integrations/airbnb/ical',{method:'POST', body: JSON.stringify({property_id:Number(propertyId), unit_id:Number(unit), ical_url:url})})
    setResp(r); setUrl(''); refresh()
  }
  const syncNow = async()=>{
    setSyncMsg('Syncing...')
    try{ const r = await api<{synced:number, ids:number[]}>('/api/integrations/airbnb/sync-now', {method:'POST'}); setSyncMsg(`Synced ${r.synced} integration(s): ${r.ids.join(', ')}`); refresh() }catch(e:any){ setSyncMsg(e?.message || 'Sync failed') }
  }
  const remove = async(id:number)=>{ if(!confirm('Delete this iCal integration?')) return; await api(`/api/integrations/airbnb/ical/${id}`, {method:'DELETE'}); refresh() }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{gridColumn:'span 6'}}>
        <h1 style={{marginTop:0}}>Airbnb iCal Integration</h1>
        <div className="help">Connect an Airbnb calendar (.ics URL) per unit to import reservations into the Bookings calendar.</div>
        <div className="row">
          <label>Property ID<input className="input" value={propertyId} onChange={e=>setPropertyId(e.target.value)} /></label>
          <label>Unit ID<input className="input" value={unit} onChange={e=>setUnit(e.target.value)} /></label>
        </div>
        <div className="row">
          <label>iCal URL<span className="help">Paste the full .ics link from Airbnb.</span><input className="input" value={url} onChange={e=>setUrl(e.target.value)} style={{flex:1}}/></label>
        </div>
        <div className="row">
          <button className="btn" onClick={save}>Save iCal</button>
          <button className="btn" onClick={syncNow}>Sync now</button>
          {syncMsg && <span style={{marginLeft:10}}>{syncMsg}</span>}
        </div>
        {resp && <pre>{JSON.stringify(resp,null,2)}</pre>}
      </div>

      <div className="card" style={{gridColumn:'span 6'}}>
        <h2 style={{marginTop:0}}>Integration Stats</h2>
        <div className="row" style={{gap:24}}>
          <div><div className="help">Total iCal links</div><div style={{fontSize:24, fontWeight:800}}>{stats?.ical_integrations ?? '—'}</div></div>
          <div><div className="help">Total bookings</div><div style={{fontSize:24, fontWeight:800}}>{stats?.total_bookings ?? '—'}</div></div>
          <div><div className="help">Last sync time (UTC)</div><div style={{fontSize:14}}>{stats?.last_sync_at || '—'}</div></div>
        </div>
      </div>

      <div className="card" style={{gridColumn:'span 12'}}>
        <h2 style={{marginTop:0}}>Saved iCal Links</h2>
        <table className="table">
          <thead><tr><th>ID</th><th>Label</th><th>URL</th><th>Status</th><th>Last Sync</th><th></th></tr></thead>
          <tbody>
            {list.map(i=> (<tr key={i.id}><td>{i.id}</td><td>{i.label}</td><td style={{maxWidth:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}} title={i.config_json}>{i.config_json}</td><td>{i.status}</td><td>{i.last_sync_at || '—'}</td><td><button className="btn" onClick={()=>remove(i.id)}>Delete</button></td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
