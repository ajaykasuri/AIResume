import React, { useState, useEffect } from 'react';
let notifyRef = null;
export function notify(msg, type='info'){
  if(notifyRef) notifyRef(msg, type);
}
export default function Toast(){ 
  const [msg, setMsg] = useState(null);
  useEffect(()=>{ notifyRef = (m) => setMsg(m); return ()=>{ notifyRef = null } },[]);
  if(!msg) return null;
  return (
    <div style={{position:'fixed',right:20,bottom:20,background:'#111',color:'#fff',padding:'10px 14px',borderRadius:6,boxShadow:'0 6px 18px rgba(0,0,0,0.12)'}}>
      {msg}
      <button onClick={()=>setMsg(null)} style={{marginLeft:12,background:'transparent',color:'#fff',border:0}}>✕</button>
    </div>
  );
}