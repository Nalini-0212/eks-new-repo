import React, {useEffect, useState} from 'react';
const API = process.env.REACT_APP_API_URL || '/api';
export default function App() {
  const [tasks,setTasks]=useState([]), [title,setTitle]=useState(''), [error,setError]=useState(''), [busy,setBusy]=useState(false);
  async function refresh(){try {const r=await fetch(`${API}/tasks`);if(!r.ok)throw Error('Cannot load tasks');setTasks(await r.json());setError('');}catch(e){setError(e.message);}}
  useEffect(()=>{refresh();const timer=setInterval(refresh,3000);return ()=>clearInterval(timer);},[]);
  async function add(e){e.preventDefault();if(!title.trim())return;setBusy(true);try{const r=await fetch(`${API}/tasks`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:title.trim()})});if(!r.ok)throw Error((await r.json()).error||'Could not create task');setTitle('');await refresh();}catch(e){setError(e.message);}finally{setBusy(false);}}
  return <main style={{fontFamily:'system-ui',maxWidth:720,margin:'48px auto',padding:20}}><h1>DevOps Task Dashboard</h1><p>React frontend · Express API · background worker</p><form onSubmit={add}><input aria-label="Task title" placeholder="Enter a task" maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} style={{padding:12,width:'65%'}}/> <button disabled={busy} style={{padding:12}}>Add task</button></form>{error&&<p role="alert" style={{color:'crimson'}}>{error}</p>}<h2>Tasks</h2><ul>{tasks.map(t=><li key={t.id} style={{padding:10}}>{t.title} — <strong>{t.status}</strong></li>)}</ul></main>;
}
