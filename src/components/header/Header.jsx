import Button from "../Button";
import Input from "../Input";
import DropDown from "../DropDown";
import './header.css'
import { useEffect, useState } from "react";
import {room,size} from '../../hooks/useCanvas.jsx';
import Vacuum from "../../jsCode/vacuum.js";

//const rooms = ['room1','room2','room3'];
const controlTypes = ['KEYS','AI','ALGO'];

const Header = ({setTraining,control,setControl}) => {

  const [headerStatus,setHeaderStatus] = useState('');//['edit']
  const [roomName,setRoomName] = useState('');
  const [currRoom,setCurrRoom] = useState('room1')
  const [info,setInfo] = useState('Press "Space_bar" to turn on the vacuum.')
  const [rooms,setRooms] = useState(['room1','room2','room3'])
  

  const newRoom = ()=>{
    setHeaderStatus('edit');
    room.vacuum = new Vacuum(size.width-50,size.height-50,40,"KEYS");
    room.walls.length = 4;
    setControl('KEYS');
  }

  useEffect(()=>{

    const data = localStorage.getItem("rooms");
    const roomData = data ? JSON.parse(data) : {};
    const newRooms = Object.keys(roomData);
    setRooms((currRooms)=>[...currRooms,...newRooms]);
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        room.vacuum.turned = !room.vacuum.turned;
        room.vacuum.turned ? setInfo('Great, Now Enjoy Cleaning the Room!') : setInfo('Press "Space_bar" to turn on the vacuum.')
      }
    });

    return ()=>setRooms(['room1','room2','room3']);

  },[]);

  const save = ()=>{
    if(headerStatus==='edit'){
      if (!roomName) {
        setInfo("You must enter a name for the room");
        setTimeout(()=>{
          setInfo('Press "Space_bar" to turn on the vacuum.');
        },3000);
        return;
      }
      
      ///save the room
      room.saveRoom(roomName);
      if(rooms.indexOf(roomName)!== -1){
        setRooms((curRooms)=>[...curRooms,roomName]);
      }
      setHeaderStatus('');
    }else{
      //saving the brain
      room.saveBrain();
    }
  }

  const cancel = ()=>{
    setHeaderStatus('');
    room.changeRoom();
  }

  return (
    <header>
      <div className="btns">
        <Button name='New Room' onClick={newRoom} />
        {headerStatus==='edit' && <Input placeholder='Name' value={roomName} setRoomName={setRoomName} />}
        {headerStatus!=='edit' && <DropDown rooms={rooms} control={control} currRoom={currRoom} setCurrRoom={setCurrRoom} />}
        {headerStatus!=='edit' && <DropDown contolTypes={controlTypes} setControl={setControl} control={control} />}
        {(control==='AI' || headerStatus==='edit') && <Button name='Save' onClick={save} />}
        {headerStatus==='edit' && <Button name='cancel' onClick={cancel} />}
        {control==='AI' && <Button name='Train AI' onClick={()=>setTraining(true)} />}
      </div>
      <div className="info" style={info[0]==='Y' ? {color:'red', fontSize:'20px'} : {color:'white'}}>{info}</div>
    </header>
  )
}

export default Header;