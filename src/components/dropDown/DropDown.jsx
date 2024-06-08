import { useEffect, useState } from "react";
import { room } from "../../hooks/useCanvas";
import ListItem from "./ListItem";
import './dropDown.css';

const DropDown = ({rooms,contolTypes,control,setControl,currRoom,setCurrRoom,setRooms}) => {

  const [showList,setShowList] = useState(false);

  const onOpenList = ()=>{
    setShowList(!showList);
  }


  useEffect(()=>{
    document.addEventListener('click',handleClick);

    function handleClick(e){
      if(e.target.className !== 'dropHeader'){
        setShowList(false);
      }
    }

    return ()=> document.removeEventListener('click',handleClick)
  },[]);
  
  const onChooseRoom = (item)=>{
    room.currRoom = item;
    room.changeRoom();
    room.changeControl(control);

    setCurrRoom(item)
    setShowList(false);
  }

  const onChooseKey = (item)=>{
    room.changeControl(item);

    setControl(item);
    setShowList(false);
  }

  return(
    <div className="dropDown">
      <div className="dropHeader" onClick={onOpenList}>{currRoom ? currRoom : control}</div>
      <div className={`dropList ${showList ? 'active' : ''}`} >
        {rooms ? rooms.map((r,i)=>
          <ListItem  
            key={r} 
            onClick={()=>onChooseRoom(r)} 
            val={r} 
            isRoom={i>2} 
            setRooms={setRooms}
            currRoom={currRoom}
            setCurrRoom={setCurrRoom}
          />
        ):
        contolTypes.map((type)=>
          <ListItem key={type} onClick={()=>onChooseKey(type)} val={type} />
        )}
        
      </div>
    </div>
  )

}

export default DropDown