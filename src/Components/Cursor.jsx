import React, { useEffect } from 'react'
import gsap from 'gsap';

const Cursor = ({ isCanvasActive }) => {
    useEffect(()=>{
        const handleMouseMove = (e) =>{
            const { clientX, clientY } = e;
            gsap.to("#cursor", {
                x: clientX - 18 / 2,
                y: clientY - 18 / 2,
                duration: 1,
                delay: 0,
                ease: "power4.out",

            })
        }
        window.addEventListener("mousemove", handleMouseMove);
        
        return(()=>{
            window.removeEventListener("mousemove", handleMouseMove);
        });
    }, []);

    const baseClasses = 'fixed h-[18px] w-[18px] rounded-full z-10 pointer-events-none transition-colors duration-300';

    const style = isCanvasActive
        ? { backgroundColor: '#ffffff' }
        : { backgroundColor: '#000000', mixBlendMode: 'difference' };

  return (
    <div
      id='cursor'
      className={baseClasses}
      style={style}
    />
  )
}

export default Cursor