import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {mkStores,mkSpots,vendors0,alerts0,equip0,Store,Spot,Vendor,Alert,Equip} from './data'
const D={dark:false,defSpeed:1,defFloor:-1,defView:'iso',labels:true,showShoppers:true,anim:true,refresh:5,paths:false,grid:false,parking:true}
export type S=typeof D&{stores:Store[];spots:Spot[];vendors:Vendor[];alerts:Alert[];equip:Equip[];orders:string[];sel:string|null;floor:number;speed:number;count:number;running:boolean;entered:number;left:number;toasts:{id:number;msg:string;ok:boolean}[];hv:number|null}
const data=()=>({stores:mkStores(),spots:mkSpots(),vendors:vendors0,alerts:alerts0,equip:equip0,orders:[] as string[]})
export const useApp=create<S>()(persist(()=>({...D,...data(),sel:null,floor:-1,speed:1,count:30,running:true,entered:0,left:0,toasts:[],hv:null}) as S,
 {name:'megamall3d',version:1,partialize:s=>{const{sel,toasts,running,entered,left,hv,...r}=s;return r},merge:(p:any,c)=>({...c,...(p&&typeof p==='object'&&Array.isArray(p.stores)&&Array.isArray(p.spots)?p:{})})}))
export const toast=(msg:string,ok=true)=>{const id=Date.now()+Math.random();useApp.setState(s=>({toasts:[...s.toasts,{id,msg,ok}]}));setTimeout(()=>useApp.setState(s=>({toasts:s.toasts.filter(t=>t.id!==id)})),3000)}
export const resetData=()=>useApp.setState({...data(),entered:0,left:0,count:30})
export const restoreDefaults=()=>useApp.setState({...D,floor:D.defFloor,speed:1})
export const DEFAULTS=D
