import { useRef } from "react";
import { room } from "../hooks/useCanvas";

const DropDown = ({rooms,contolTypes,control,setControl,...rest}) => {

  const ref = useRef();

  const handleChange = (e)=>{
    ref.current.blur();
    if(rooms){
      room.currRoom = e.target.value;
      
      room.changeRoom();
      room.changeControl(control);
    }else{
      setControl(e.target.value);
      room.changeControl(e.target.value);
    }
  } 

  
  return (
  <select className="dropdown" {...rest} onChange={handleChange} ref={ref} >
    {rooms ? rooms.map((r)=>
      <option key={r} value={r} >{r}</option>
    ) : 
    contolTypes.map((type)=>
      <option key={type} value={type} >{type}</option>
    )}
  </select>
  )
}

export default DropDown