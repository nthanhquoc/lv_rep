import { createContext, useContext, useEffect, useState } from "react";
import { getDataCart } from "../services/CartService";

const CartContext = createContext();

export const CartProvider = ({children})=>{
    const [cartCount,setCartCount]= useState(0);
    
    const fetchCartCount = async()=>{
        try{
            const cart = await getDataCart();
            const count = cart.reduce((acc,item)=>acc+item.quantity,0);
            setCartCount(count);
        }catch(error){
            console.error(error);
        }
    }

    useEffect(()=>{
        fetchCartCount()
    },[])

    return (
        <CartContext.Provider value={{cartCount,fetchCartCount}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = ()=> useContext(CartContext);