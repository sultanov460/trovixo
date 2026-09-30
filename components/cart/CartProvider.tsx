"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { PublicCart } from "@/lib/types/cart";
type CartContextValue = {cart:PublicCart|null;isLoading:boolean;isInitializing:boolean;error:string|null;addToCart:(variantId:string,quantity?:number)=>Promise<PublicCart|null>;removeLine:(lineId:string)=>Promise<void>;updateLine:(lineId:string,quantity:number)=>Promise<void>;checkout:()=>Promise<void>};
const Context=createContext<CartContextValue|undefined>(undefined);
export function CartProvider({children}:{children:React.ReactNode}) {
 const [cart,setCart]=useState<PublicCart|null>(null),[isLoading,setLoading]=useState(false),[isInitializing,setInitializing]=useState(true),[error,setError]=useState<string|null>(null);
 const busy=useRef(false);
 useEffect(()=>{let active=true;fetch("/api/cart",{cache:"no-store"}).then(async r=>{if(!active)return;if(r.ok)setCart(await r.json());else if(r.status!==503)setError("Your bag could not be loaded. Please refresh to try again.");}).catch(()=>{if(active)setError("Your bag could not be loaded. Please check your connection.");}).finally(()=>{if(active)setInitializing(false);});return()=>{active=false;};},[]);
 const mutate=useCallback(async(method:string,payload:Record<string,unknown>):Promise<PublicCart|null>=>{
  if(busy.current)return null;busy.current=true;setLoading(true);setError(null);
  try{const response=await fetch("/api/cart",{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await response.json();if(!response.ok)throw new Error(data.error || "Please try again.");setCart(data);return data;}
  catch(e){setError(e instanceof Error ? e.message : "Unable to reach your bag. Please try again.");return null;}
  finally{busy.current=false;setLoading(false);}
 },[]);
 const addToCart=useCallback((variantId:string,quantity=1)=>mutate("POST",{variantId,quantity}),[mutate]);
 const removeLine=useCallback(async(lineId:string)=>{await mutate("DELETE",{lineId});},[mutate]);
 const updateLine=useCallback(async(lineId:string,quantity:number)=>{await mutate("PATCH",{lineId,quantity});},[mutate]);
 const checkout=useCallback(async()=>{if(busy.current)return;busy.current=true;setLoading(true);setError(null);try{const response=await fetch("/api/checkout",{method:"POST"});const data=await response.json();if(!response.ok)throw new Error(data.error || "Unable to open checkout.");window.location.assign(data.checkoutUrl);}catch(e){setError(e instanceof Error ? e.message : "Unable to open checkout. Please try again.");}finally{busy.current=false;setLoading(false);}},[]);
 return <Context.Provider value={{cart,isLoading,isInitializing,error,addToCart,removeLine,updateLine,checkout}}>{children}</Context.Provider>;
}
export function useCart(){const context=useContext(Context);if(!context)throw new Error("Cart provider missing");return context;}
