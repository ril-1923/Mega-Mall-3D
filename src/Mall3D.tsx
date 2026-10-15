import {Canvas,useFrame,useThree} from '@react-three/fiber'
import {OrbitControls,Text,Line} from '@react-three/drei'
import * as THREE from 'three'
import {Component,ReactNode,useEffect,useMemo,useRef} from 'react'
import {useApp} from './store'
import {rnd} from './data'
const FH=5,geo=new THREE.BoxGeometry(1,1,1)
export const VIEWS:Record<string,[number,number,number]>={iso:[30,24,30],top:[0,58,0.1],front:[0,10,46]}
const B=({p,s,c,o=1,r}:{p:[number,number,number];s:[number,number,number];c:string;o?:number;r?:[number,number,number]})=><mesh geometry={geo} position={p} scale={s} rotation={r}><meshStandardMaterial color={c} transparent={o<1} opacity={o}/></mesh>
const vis=(f:number,sf:number)=>sf===-1||sf===f
function StoreUnit({st}:{st:ReturnType<typeof useApp.getState>['stores'][0]}){
 const sel=useApp(s=>s.sel===st.id),labels=useApp(s=>s.labels),side=st.k<6?-1:1,x=(st.k%6-2.5)*5
 return <group position={[x,st.floor*FH,side*9.5]} onClick={e=>{e.stopPropagation();useApp.setState({sel:st.id})}}>
  <mesh geometry={geo} position={[0,1.6,0]} scale={[4.4,3.2,5]}><meshStandardMaterial color={st.open?st.color:'#9ca3af'} emissive={sel?'#22d3ee':'#000'} emissiveIntensity={sel?.7:0}/></mesh>
  <B p={[0,1.4,-side*2.55]} s={[3.6,2.2,.1]} c="#bae6fd" o={.5}/><B p={[0,3.35,-side*2.6]} s={[4.4,.5,.3]} c={sel?'#22d3ee':'#1e293b'}/>
  {labels&&<Text position={[0,3.35,-side*2.8]} rotation={[0,side<0?0:Math.PI,0]} fontSize={.3} color="#fff" anchorX="center" anchorY="middle">{st.name}</Text>}</group>}
function Shopper({i,floorSel}:{i:number;floorSel:number}){
 const g=useRef<THREE.Group>(null),st=useRef({f:i%3,lane:i%2?5.5:-5.5,x:(rnd(i)-.5)*26,tx:0,w:rnd(i+5)*3,mf:-1,y:(i%3)*FH}),col=useMemo(()=>new THREE.Color().setHSL(rnd(i+2),.6,.5),[i])
 useFrame((_,dt)=>{const s=st.current,a=useApp.getState();const v=a.showShoppers&&vis(s.f,floorSel);if(g.current){g.current.visible=v}
  const sp=a.anim&&a.running?a.speed:0;if(!sp||dt>.2)return;const d=dt*sp
  if(s.w>0)s.w-=d;else{const dx=s.tx-s.x;if(Math.abs(dx)<.1){if(s.mf>=0&&Math.abs(s.tx)<.2){s.f=s.mf;s.mf=-1}s.w=1+rnd(i+s.x)*3;if(rnd(i*3+s.x)<.25){s.mf=Math.floor(rnd(i+s.w)*3);s.tx=0}else s.tx=(Math.floor(rnd(i+s.x*7)*6)-2.5)*5;s.lane=rnd(i+s.tx)<.5?-5.5:5.5}else s.x+=Math.sign(dx)*1.6*d}
  s.y+=(s.f*FH-s.y)*Math.min(1,d*3);if(g.current){g.current.position.set(s.x,s.y,s.lane);g.current.rotation.y=Math.sign(s.tx-s.x)>0?Math.PI/2:-Math.PI/2;g.current.children[0].position.y=1+(s.w<=0&&sp?Math.abs(Math.sin(performance.now()/150))*.05:0)}})
 return <group ref={g}><group><mesh geometry={geo} position={[0,.5,0]} scale={[.35,.9,.2]}><meshStandardMaterial color="#334155"/></mesh><mesh geometry={geo} position={[0,.1,0]} scale={[.3,.5,.2]}><meshStandardMaterial color="#1e293b"/></mesh><mesh geometry={geo} position={[0,.65,0]} scale={[.45,.6,.25]}><meshStandardMaterial color={col}/></mesh><mesh geometry={geo} position={[0,1.1,0]} scale={[.28,.28,.28]}><meshStandardMaterial color="#f5c9a4"/></mesh></group></group>}
function Rig({view,mini}:{view:{k:string;n:number};mini?:boolean}){
 const {camera,controls}=useThree(s=>({camera:s.camera,controls:s.controls as any})),mv=useRef(true)
 useEffect(()=>{mv.current=true},[view.n])
 useFrame(()=>{if(mv.current){const t=new THREE.Vector3(...VIEWS[view.k]);camera.position.lerp(t,.08);if(camera.position.distanceTo(t)<.1)mv.current=false;camera.lookAt(0,5,0)}controls?.update?.()})
 return null}
function Scene({mini,view}:{mini?:boolean;view:{k:string;n:number}}){
 const a=useApp(),sf=a.floor,cars=useRef<THREE.InstancedMesh>(null)
 useEffect(()=>{const m=cars.current;if(!m)return;const o=new THREE.Object3D(),c=new THREE.Color();for(let i=0;i<120;i++){o.position.set(-22+(i%30)*1.5,.4,22+Math.floor(i/30)*4);o.updateMatrix();m.setMatrixAt(i,o.matrix);m.setColorAt(i,c.setHSL(rnd(i),.5,.5))}m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true},[])
 const fl=[0,1,2]
 return <>
  <color attach="background" args={[a.dark?'#0b1220':'#dbeafe']}/><ambientLight intensity={.7}/><directionalLight position={[20,30,10]} intensity={1.1}/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.2,0]} onClick={()=>useApp.setState({sel:null})}><planeGeometry args={[120,120]}/><meshStandardMaterial color={a.dark?'#1e293b':'#e2e8f0'}/></mesh>
  {a.grid&&<gridHelper args={[100,50]} position={[0,0,0]}/>}
  {fl.filter(f=>vis(f,sf)).map(f=><group key={f}>
   {[-1,1].map(s=><B key={s} p={[0,f*FH-.15,s*8]} s={[32,.3,8]} c="#f1f5f9"/>)}{f===0&&<B p={[0,-.15,0]} s={[32,.3,8]} c="#e0f2fe"/>}
   {f>0&&[-1,1].map(s=><B key={s} p={[0,f*FH+.6,s*4]} s={[32,1.1,.08]} c="#67e8f9" o={.4}/>)}
   <B p={[0,f*FH+1.2,0]} s={[.1,.1,.1]} c="#fff"/>
   {a.paths&&[-5.5,5.5].map(z=><Line key={z} points={[[-15,f*FH+.1,z],[15,f*FH+.1,z]]} color="#22d3ee" lineWidth={2}/>)}
   {[-8,8].map(x=><group key={x}><mesh geometry={geo} position={[x,f*FH+.3,0]} scale={[.8,.6,.8]}><meshStandardMaterial color="#16a34a"/></mesh><B p={[x,f*FH+.9,0]} s={[1,.9,1]} c="#22c55e"/></group>)}
   <B p={[0,f*FH+2.6,-16.5]} s={[31,.1,.1]} c="#cbd5e1"/>
   {a.stores.filter(s=>s.floor===f).map(s=><StoreUnit key={s.id} st={s}/>)}</group>)}
  <B p={[-3,2.5,0]} s={[2,.3,9]} c="#475569" r={[Math.atan(FH/9)*0,0,0]}/><B p={[3,2.5,0]} s={[1.6,.25,8]} c="#64748b" r={[0.5,0,0]}/>
  <B p={[0,FH*3,0]} s={[34,.2,26]} c="#bae6fd" o={.15}/>
  {Array.from({length:a.count},(_,i)=><Shopper key={i} i={i} floorSel={sf}/>)}
  {a.parking&&<group><B p={[0,-.1,26]} s={[50,.1,12]} c="#475569"/><instancedMesh ref={cars} args={[geo,undefined,120]} scale={[1,.8,1.8]}><meshStandardMaterial/></instancedMesh></group>}
  <OrbitControls makeDefault enablePan={!mini} enableZoom={!mini} minDistance={10} maxDistance={90} maxPolarAngle={Math.PI/2.05} autoRotate={mini&&a.anim} autoRotateSpeed={.6} target={[0,5,0]}/>
  <Rig view={view} mini={mini}/></>}
class EB extends Component<{children:ReactNode},{e:boolean}>{state={e:false};static getDerivedStateFromError(){return{e:true}};render(){return this.state.e?<div className="alert alert-warning m-3">3D view unavailable (WebGL failed to initialize). All dashboards still work.</div>:this.props.children}}
export default function Mall3D({mini,view,onClick}:{mini?:boolean;view:{k:string;n:number};onClick?:()=>void}){
 return <EB><div style={{height:'100%',minHeight:mini?280:420}} onClick={onClick}><Canvas dpr={[1,1.5]} camera={{position:VIEWS.iso,fov:45}} gl={{antialias:true}}><Scene mini={mini} view={view}/></Canvas></div></EB>}
