import { useState } from "react";
import { room } from "../hooks/useCanvas";

const DropDown = ({rooms,contolTypes,control,setControl,currRoom,setCurrRoom}) => {

  const [showList,setShowList] = useState(false);

  const onOpenList = ()=>{
    setShowList(!showList);
  }

  
  const onChoose = (item)=>{
    if(rooms){
      room.currRoom = item;
      room.changeRoom();
      room.changeControl(control);
      setCurrRoom(item)
    }else{
      setControl(item);
      room.changeControl(item);
    }
    setShowList(false);
  }

  return(
    <div className="dropDown">
      <div className="dropHeader" onClick={onOpenList}>{currRoom ? currRoom : control}</div>
      <div className={`dropList ${showList ? 'active' : ''}`} >
        {rooms ? rooms.map((r)=>
          <div className="dropListItem" key={r} onClick={()=>onChoose(r)}>{r}</div>
        ):
        contolTypes.map((type)=>
          <div className="dropListItem" key={type} onClick={()=>onChoose(type)}>{type}</div>
        )}
        
      </div>
    </div>
  )

}

export default DropDown