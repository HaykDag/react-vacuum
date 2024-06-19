

const Input = ({setRoomName,setCount,setMutation,setNodeCount,...rest}) => {

  const handleChange = (e)=>{
    if(setRoomName){
      setRoomName(e.target.value)
    }else if(setCount){
      setCount(e.target.value)
    }else if(setMutation){
      setMutation(e.target.value)
    }else if(setNodeCount){
      
      if(e.nativeEvent.inputType =="deleteContentBackward") {
        setNodeCount((val)=>val.slice(0,-2));
        return;
      }
      if(isNaN(Number(e.nativeEvent.data))|| Number(e.nativeEvent.data)<=0 ) return;
  
      
      setNodeCount(e.target.value + ',');
    }
  }

  return (
    <input className="myInput" {...rest} onChange={handleChange}  />
  )
}

export default Input