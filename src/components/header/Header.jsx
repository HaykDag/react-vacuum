import Button from "../Button";
import Input from "../Input";
import DropDown from "../dropDown/DropDown.jsx";
import './header.css'
import { useEffect, useState, useContext } from "react";
import {room,size} from '../../hooks/useCanvas.jsx';
import Vacuum from "../../jsCode/vacuum.js";
import { AppContext } from "../../context/AppContext.jsx";


const Header = () => {

  const {headerStatus,control,rooms,currRoom,dispatch} = useContext(AppContext);

  const [info,setInfo] = useState('Press "Space_bar" to turn on the vacuum.')
  const [roomName,setRoomName] = useState('');
  const [speed,setSpeed] = useState(2);

  const newRoom = ()=>{
    dispatch({type:'SET_HEADERSTATUS'});
    room.vacuum = new Vacuum(size.width-50,size.height-50,40,"KEYS");
    room.walls.length = 4;
    room.edit = true;
    room.garbage.length = 0;
    dispatch({type:"SET_CONTROL",payload:"KEYS"});
  }

  useEffect(()=>{

    const data = localStorage.getItem("rooms");
    const roomData = data ? JSON.parse(data) : {};
    const newRooms = Object.keys(roomData);
    dispatch({type:'ADD_ROOMS',payload:newRooms});
    
    document.addEventListener("keydown", spaceAction);

    room.vacuum.speed = speed;

    function spaceAction(e){
      if (e.code !== "Space") return;
      room.vacuum.turned = !room.vacuum.turned;
      room.vacuum.turned ? 
        setInfo('Great, Now Enjoy Cleaning the Room!') : 
        setInfo('Press "Space_bar" to turn on the vacuum.')
      
    }

    return ()=>{
      dispatch({type:'RESET_ROOMS'});
      document.removeEventListener('keydown',spaceAction);
    }

  },[]);

  const changeSpeed = (e)=>{
    setSpeed(e.target.value);
    e.target.blur()
    room.vacuum.speed = Number(e.target.value);
  }

  const save = ()=>{
    if(headerStatus==='edit'){
      if (!roomName) {
        setInfo("You must enter a name for the room");
        setTimeout(()=>{
          setInfo('Press "Space_bar" to turn on the vacuum.');
        },3000);
        return;
      }
      
      //save the room
      room.saveRoom(roomName);
      room.generateGarbage(150);
      room.edit = false;
      if(rooms.indexOf(roomName)=== -1){
        dispatch({type:'ADD_ROOM',payload:roomName});
      }
      dispatch({type:'SET_CURRROOM',payload:roomName});
      dispatch({type:'SET_HEADERSTATUS'});
      setRoomName('');
    }else{
      //saving the brain
      room.saveBrain(currRoom);
    }
  }

  const cancel = ()=>{
    dispatch({type:'SET_HEADERSTATUS'});
    room.changeRoom();
  }

  return (
    <header>
      <div className="btns">
        <Button name='New Room' onClick={newRoom} />
        {headerStatus==='edit' && <Input placeholder='Name' value={roomName} setRoomName={setRoomName} />}
        {headerStatus!=='edit' && <DropDown isRoom={true}/>}
        {headerStatus!=='edit' && <DropDown />}
        {(control==='AI' || headerStatus==='edit') && <Button name='Save' onClick={save} />}
        {headerStatus==='edit' && <Button name='cancel' onClick={cancel} />}
        {control==='AI' && <Button name='Train AI' onClick={()=>dispatch({type:'SWITCH_TRAINING'})} />}
        {headerStatus!=='edit' && (
          <div className="speed-cnt">
            <label>speed</label>
            <input className="speedRange" type="range" max={5} min={1} value={speed} onChange={changeSpeed} step={0.5} />
          </div>
        )}
      </div>
      <div className="info" style={info[0]==='Y' ? {color:'red', fontSize:'20px'} : {color:'white'}}>{info}</div>
    </header>
  )
}

export default Header;