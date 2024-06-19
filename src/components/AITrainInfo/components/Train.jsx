import Input from "../../Input";
import Button from "../../Button";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { room } from "../../../hooks/useCanvas";

const Train = ({setErr}) => {
  const [count,setCount] = useState(50);
  const [mutation,setMutation] = useState(0.5);

  const {dispatch} = useContext(AppContext);

  const handleGenerate = ()=>{
    setErr('');
    //validate the inputs
    if(count<=0){
      setErr('The count should be at least 1');
      setTimeout(()=>{
        setErr('');
      },1500)
      return;
    };
    if(isNaN(Number(count))){
      setErr('The count should be a Number');
      setTimeout(()=>{
        setErr('');
      },1500)
      return;
    };
    if(isNaN(Number(mutation))){
      setErr('The mutation should be a Number');
      setTimeout(()=>{
        setErr('');
      },1500)
      return;
    }
    if(mutation<0 || mutation > 1){
      setErr('The mutation should be between 0 and 1');
      setTimeout(()=>{
        setErr('');
      },1500)
      return;
    }
    room.generateVacuums(count,mutation);
    dispatch({type:'SWITCH_TRAINING'});
  }

  return (
    <form className="train-info" onSubmit={handleGenerate}>
      <div className="details">
        Generate AI vacuum Cleaners at the same time, elminate the ones that are
        performing bad by right clicking on them and leave only one to save as a
        best brain.
        <span>
          Enter the Number of vacuum cleaners up to 500 (considering power of
          your computer).
        </span>
        <span className='input-info'>
            Mutation should be in the range of 0 to 1:
          <span>0 - means all the vacuums will have the same brain.</span>
          <span>
            1 - means the saved brain will be completly overwritten randomly for
            all the vacuums.</span>
        </span>
      </div>
      <div className='info-inputs'>
        <Input placeholder='Count' type='number' setCount={setCount} value={count} autoFocus={true} />
        <Input placeholder='Mutation' type='number' setMutation={setMutation} value={mutation} />
      </div>
      <Button name='Generate'  />
    </form>
  )
}

export default Train;
