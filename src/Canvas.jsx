import React, { useEffect, useRef, useState } from 'react';
import canvasImages from './canvasImages';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Canvas = ({ details }) => {
    const { startIndex, numImages, duration, size, top, left, zIndex } = details;
    const [index, setIndex] = useState({value: startIndex})
    const canvasRef = useRef(null);
    useGSAP(() => {
        gsap.to(index, {
            value: startIndex + (numImages - 1),
            duration: duration,
            ease: "linear",
            repeat: -1,
            onUpdate: () => {
                setIndex({value: Math.round(index.value)})
            },
        })
    });

  useEffect(() => {
    const scale = window.devicePixelRatio;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    img.onload = function() {
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
    ctx.scale(scale, scale);  
    ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    };
    img.src = canvasImages[index.value];
  }, [index]);

  return (
    <div>
      <canvas
            ref={canvasRef}    
            data-scroll
            data-scroll-speed = {Math.random().toFixed(1)}
            id="canvas"
            className='absolute'
            style={{width: `${size*1.5}px`,
                    height: `${size*1.5}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                    zIndex: `${zIndex}`
              }}>
      </canvas>
    </div>
  );
};

export default Canvas;