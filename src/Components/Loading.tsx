"use client"

import {easeInOut, motion} from 'framer-motion';
import React from 'react';
import Image from 'next/image';

export default function Loading() {
    return(
        <motion.div 
        className="flex justify-center items-center min-h-screen"
  
        animate={{ scale: [1, 1.5, 1]}}
        transition={{
           
            scale:{duration:2, repeat:Infinity, ease:easeInOut}
        }}
        
        >
            <Image src="/ZenCart.png" alt="ZenCart logo" className='object-cover' width={40} height={60}/>
        </motion.div>
    )
}