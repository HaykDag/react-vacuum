import { useEffect, useRef } from "react";
import Visualizer from "../jsCode/visualizer";
import { room } from "./useCanvas";

const useBrainCanvas = () => {

  const ref = useRef();

  useEffect(()=>{
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let animationID = null;

    const visualizer = new Visualizer(ctx,room.vacuum.brain);
    
    const animate = ()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      
      Visualizer.drawNetwork(ctx, room.vacuum.brain);
      visualizer.showInfo(ctx);
      animationID = requestAnimationFrame(animate);
    }

    animate();
    
    return () => cancelAnimationFrame(animationID);
  },[]);

  return ref;
}


export default useBrainCanvas;