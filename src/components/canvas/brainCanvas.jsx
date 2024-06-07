import useBrainCanvas from "../../hooks/useBrainCanvas.jsx";
import './canvas.css';

const BrainCanvas = (props) => {
  
  const ref = useBrainCanvas();
  
  return (
    <div>
      <canvas className="myBrainCanvas" ref={ref} {...props} />
    </div>
  )
}

export default BrainCanvas;