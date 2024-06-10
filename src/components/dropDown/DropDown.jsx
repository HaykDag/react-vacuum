import { useEffect, useState, useContext } from "react";
import { room } from "../../hooks/useCanvas";
import ListItem from "./ListItem";
import './dropDown.css';
import { AppContext } from "../../context/AppContext";
const controlTypes = ['KEYS','AI','ALGO'];

const DropDown = ({isRoom}) => {

  const [showList,setShowList] = useState(false);
  const {currRoom,control,rooms,dispatch} = useContext(AppContext);

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

    dispatch({type:'SET_CURRROOM',payload:item});
    setShowList(false);
  }

  const onChooseKey = (item)=>{
    room.changeControl(item);

    dispatch({type:'SET_CONTROL',payload:item});
    setShowList(false);
  }


  return(
    <div className="dropDown">
      <div className="dropHeader" onClick={onOpenList}>{isRoom ? currRoom : control}</div>
      <div className={`dropList ${showList ? 'active' : ''}`} >
        {isRoom ? rooms?.map((r,i)=>
          <ListItem  
            key={r} 
            onClick={()=>onChooseRoom(r)} 
            val={r} 
            isRoom={i>2} 
          />
        ):
        controlTypes.map((type)=>
          <ListItem key={type} onClick={()=>onChooseKey(type)} val={type} />
        )}
        
      </div>
    </div>
  )

}

export default DropDown