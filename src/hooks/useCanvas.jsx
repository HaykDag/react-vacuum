import { useEffect, useRef } from "react";
import Room from '../jsCode/room.js';


export const size = {width:1000,height:600};
export const room = new Room(size);

const useCanvas = (setIsClean) => {

  const ref = useRef();

  useEffect(()=>{
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    
    room.createWalls(canvas);

    let animationID = null;
    const animate = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      
      room.update();
      room.draw(ctx);

      if(room.garbage.length === 0) setIsClean(true);
      
      animationID = requestAnimationFrame(animate);
    }
    animate();

  
    return () => cancelAnimationFrame(animationID);
  },[]);

  return ref;
}


export default useCanvas;