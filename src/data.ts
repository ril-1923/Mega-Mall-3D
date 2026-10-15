export type Store={id:string;name:string;cat:string;floor:number;open:boolean;occ:number;visitors:number;sales:number;color:string;k:number}
export type Spot={id:string;zone:string;type:string;status:string;vehicle:string;updated:string}
export type Vendor={id:number;name:string;cuisine:string;open:boolean;orders:number;sales:number;prep:number;seats:number}
export type Alert={id:number;sev:string;cat:string;msg:string;state:string}
export type Equip={id:string;name:string;loc:string;cat:string;status:string;last:string;next:string}
export const rnd=(s:number)=>{const x=Math.sin(s*9301+49297)*233280;return x-Math.floor(x)}
export const CATS=['Fashion','Electronics','Beauty','Lifestyle','Grocery','Sports','Jewelry','Books','Toys','Restaurants','Cafés','Entertainment']
const L=[['Fashion','Electronics','Grocery','Sports','Fashion','Electronics','Grocery','Books','Toys','Sports','Jewelry','Lifestyle'],
['Fashion','Lifestyle','Beauty','Beauty','Jewelry','Fashion','Lifestyle','Books','Toys','Sports','Electronics','Beauty'],
['Restaurants','Restaurants','Restaurants','Cafés','Cafés','Cafés','Entertainment','Entertainment','Entertainment','Restaurants','Cafés','Entertainment']]
const N='Nova Urban Zenith Aster Vertex Luna Orion Pulse Mosaic Cedar Alto Brio Delta Echo Fjord Gala Helix Ivy Jade Kite Lumen Maple Nimbus Opal Prism Quill Ridge Sol Terra Unity Vivid Willow Xenon Yarrow Zephyr Atlas'.split(' ')
const COL=['#2563eb','#db2777','#059669','#d97706','#7c3aed','#0891b2','#dc2626','#65a30d','#ea580c','#0d9488','#c026d3','#4f46e5']
export const mkStores=():Store[]=>L.flatMap((cs,f)=>cs.map((cat,k)=>{const n=f*12+k,r=rnd(n+1);return{id:'S'+String(n+1).padStart(2,'0'),name:`${N[n]} ${cat}`,cat,floor:f,open:n%9!==4,occ:Math.round(20+r*70),visitors:Math.round(200+r*900),sales:Math.round(8000+rnd(n+50)*72000),color:COL[CATS.indexOf(cat)],k}}))
export const mkSpots=():Spot[]=>{const o=[...Array(500).keys()].sort((a,b)=>rnd(a)-rnd(b)),occ=new Set(o.slice(0,342))
 return [...Array(500).keys()].map(i=>{const z='ABCDE'[Math.floor(i/100)],m=i%100,type=m<60?'General':m<66?'Accessible':m<80?'EV':m<92?'Premium':'Two-wheeler'
  let status=occ.has(i)?(type==='EV'?'EV charging':'Occupied'):i%25===0?'Reserved':i%47===0?'Unavailable':'Available'
  return{id:`${z}-${String(m+1).padStart(3,'0')}`,zone:z,type,status,vehicle:status==='Occupied'||status==='EV charging'?['Car','SUV','EV','Van'][i%4]:'—',updated:'08:00'}})}
export const vendors0:Vendor[]=['Burger Barn|Burgers','Slice House|Pizza','Dosa Corner|South Indian','Punjab Grill|North Indian','Wok Express|Chinese','Bean & Brew|Café','Sweet Tooth|Dessert','Frosty Scoops|Ice cream'].map((s,i)=>{const[n,c]=s.split('|');return{id:i+1,name:n,cuisine:c,open:i!==6,orders:Math.round(120+rnd(i+9)*300),sales:Math.round(900+rnd(i+3)*2400)*10,prep:5+i%5*2,seats:30+i*6}})
export const alerts0:Alert[]=[['Warning','Escalators','Escalator E-02 requires inspection'],['Warning','Parking','Parking Zone B is nearing capacity'],['Info','Waste','Food court waste collection is due'],['Critical','HVAC','HVAC unit H-03 requires maintenance'],['Info','Lighting','Atrium lighting schedule updated'],['Warning','Security','Camera C-14 offline']].map((a,i)=>({id:i+1,sev:a[0],cat:a[1],msg:a[2],state:i===4?'Resolved':'Open'}))
export const equip0:Equip[]=['Escalators|Escalator E-01','Escalators|Escalator E-02','Elevators|Elevator L-01','HVAC|HVAC H-03','Lighting|Atrium Lighting','Security|CCTV Hub','Fire Safety|Sprinkler Loop A','Cleaning|Floor Scrubber','Waste|Compactor W-1'].map((s,i)=>{const[c,n]=s.split('|');return{id:'EQ-'+(100+i),name:n,loc:['Ground','Ground','Atrium','Roof','Atrium','Security Rm','Floor 1','Floor 2','Basement'][i],cat:c,status:i===1||i===3?'Needs attention':'Operational',last:'2026-09-0'+(i%9+1),next:'2026-11-1'+(i%9)}})
