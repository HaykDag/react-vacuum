import { room } from "../../hooks/useCanvas";
import { AppContext } from "../../context/AppContext";
import { useContext } from "react";

const ListItem = ({val,isRoom,...rest}) => {

  const {dispatch,currRoom} = useContext(AppContext);

  const deleteRoom = ()=>{
    dispatch({type:'DELETE_ROOM',payload:val})
    if(val===currRoom){
      dispatch({type:'SET_CURRROOM',payload:'room1'});
      room.currRoom = 'room1';
      room.changeRoom();
    } 
    room.deleteRoom(val);
  }

  return (
    <div className="dropListItem-cnt" >
      <span className="dropListItem" {...rest}>{val}</span>
      {isRoom && <span className="dropListBin" onClick={deleteRoom}>🗑️</span>}
    </div>
  )
}

export default ListItem