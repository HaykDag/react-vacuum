import useCanvas from "../../hooks/useCanvas.jsx";
import './canvas.css';

const Canvas = (props) => {
  const {setIsClean,...rest} = props;
  
  const ref = useCanvas(setIsClean);
  
  return (
    <div>
      <canvas className="myCanvas" ref={ref} {...rest} />
    </div>
  )
}

export default Canvas;