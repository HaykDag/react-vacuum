import Input from '../Input';
import Button from '../Button';
import { AppContext } from '../../context/AppContext';
import './AITrainInfo.css';
import { useState, useContext } from 'react';
import { room } from '../../hooks/useCanvas';


const AITrainInfo = () => {

  const {dispatch} = useContext(AppContext);

  const [count,setCount] = useState(50);
  const [mutation,setMutation] = useState(0.5);

  const handleGenerate = ()=>{
    room.generateVacuums(count,mutation);
    dispatch({type:'SWITCH_TRAINING'});
  }

  return (
    <div className="train-info">
      <span className='closeBtn' onClick={()=>dispatch({type:'SWITCH_TRAINING'})}>X</span>
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
        <Input placeholder='Count' type='number' setCount={setCount}  />
        <Input placeholder='Mutation' type='number' setMutation={setMutation} />
      </div>
      <Button name='Generate' onClick={handleGenerate} />
    </div>
  )
}


export default AITrainInfo;