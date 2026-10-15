import {HashRouter,NavLink,Route,Routes,useLocation} from 'react-router-dom'
import {useEffect,useState} from 'react'
import {useApp} from './store'
import {Dashboard,MallPage,StoresPage,VisitorsPage,ParkingPage,FoodPage,OpsPage,SettingsPage} from './pages'
const R=[['/','Overview','speedometer2',Dashboard],['/mall','3D Mall Explorer','box',MallPage],['/stores','Store Directory','shop',StoresPage],['/visitors','Visitor Analytics','graph-up',VisitorsPage],['/parking','Parking Management','p-square',ParkingPage],['/food-court','Food Court','cup-hot',FoodPage],['/operations','Operations','tools',OpsPage],['/settings','Settings','gear',SettingsPage]] as const
function Shell(){const[open,setOpen]=useState(false),loc=useLocation(),a=useApp(),title=R.find(r=>r[0]===loc.pathname)?.[1]||'MegaMall 3D',[q,setQ]=useState('')
 useEffect(()=>{document.documentElement.setAttribute('data-bs-theme',a.dark?'dark':'light');setOpen(false)},[a.dark,loc.pathname])
 useEffect(()=>{if(!a.running)return;const t=setInterval(()=>useApp.setState(s=>({entered:s.entered+Math.round((3+Math.random()*4)*s.speed),left:s.left+Math.round((2+Math.random()*4)*s.speed)})),a.refresh*1000/a.speed);return()=>clearInterval(t)},[a.running,a.speed,a.refresh])
 const hits=q?a.stores.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())).slice(0,5):[]
 return <div className="app"><aside className={'side'+(open?' open':'')}><div className="brand"><i className="bi bi-buildings"/> MegaMall 3D<small>Explore. Shop. Experience.</small></div>{R.map(r=><NavLink key={r[0]} to={r[0]} end className="nav-l"><i className={'bi bi-'+r[2]}/> {r[1]}</NavLink>)}</aside>
 <div className="main"><header className="top"><button className="btn btn-light d-lg-none" aria-label="Menu" onClick={()=>setOpen(!open)}><i className="bi bi-list"/></button><h1 className="h5 mb-0 me-auto">{title}</h1>
  <div className="position-relative d-none d-md-block"><input aria-label="Global search" className="form-control form-control-sm" placeholder="Search stores…" value={q} onChange={e=>setQ(e.target.value)}/>{hits.length>0&&<div className="list-group position-absolute w-100" style={{zIndex:20}}>{hits.map(s=><a key={s.id} className="list-group-item list-group-item-action small" href={'#/stores?q='+s.id} onClick={()=>setQ('')}>{s.name}</a>)}</div>}</div>
  <span className={'badge text-bg-'+(a.running?'success':'warning')}>Sim {a.running?'running':'paused'}</span><span className="position-relative" title="Notifications"><i className="bi bi-bell fs-5"/><span className="badge text-bg-danger rounded-pill">{a.alerts.filter(x=>x.state==='Open').length}</span></span>
  <button className="btn btn-sm btn-outline-secondary" aria-label="Toggle theme" title="Toggle theme" onClick={()=>useApp.setState({dark:!a.dark})}><i className={'bi bi-'+(a.dark?'sun':'moon')}/></button><span title="Facility Manager"><i className="bi bi-person-circle fs-4"/></span></header>
 <main className="p-3"><Routes>{R.map(r=><Route key={r[0]} path={r[0]} element={<Pg c={r[3]}/>}/>)}</Routes></main></div>
 <div className="toasts">{a.toasts.map(t=><div key={t.id} className={'alert shadow py-2 alert-'+(t.ok?'success':'danger')} role="status">{t.msg}</div>)}</div></div>}
const Pg=({c:C}:{c:()=>JSX.Element})=><C/>
export default function App(){return <HashRouter><Shell/></HashRouter>}
