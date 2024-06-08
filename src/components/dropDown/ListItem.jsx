import { room } from "../../hooks/useCanvas";


const ListItem = ({val,isRoom,setRooms,currRoom,setCurrRoom,...rest}) => {

  const deleteRoom = ()=>{
    setRooms((rooms)=>rooms.filter((r)=>r!==val));
    if(val===currRoom){
      setCurrRoom('room1');
      room.currRoom = 'room1';
      room.changeRoom();
    } 
    const data = localStorage.getItem('rooms');
    if(data){
      const roomData = JSON.parse(data);
      delete roomData[val];
      localStorage.setItem('rooms',JSON.stringify(roomData));
    }
  }

  return (
    <div className="dropListItem-cnt" >
      <span className="dropListItem" {...rest}>{val}</span>
      {isRoom && <span className="dropListBin" onClick={deleteRoom}>🗑️</span>}
    </div>
  )
}

export default ListItem