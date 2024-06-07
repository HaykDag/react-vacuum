

const Input = ({setRoomName,setCount,setMutation,...rest}) => {

  const handleChange = (e)=>{
    if(setRoomName){
      setRoomName(e.target.value)
    }else if(setCount){
      setCount(e.target.value)
    }else{
      setMutation(e.target.value)
    }
  }

  return (
    <input className="myInput" {...rest} onChange={handleChange} />
  )
}

export default Input