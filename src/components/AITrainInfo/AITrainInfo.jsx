import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import './AITrainInfo.css';
import BrainSetup from './components/BrainSetup.jsx';
import Train from './components/Train.jsx';



const AITrainInfo = () => {

  const [err, setErr] = useState('');
  const [train,setTrain] = useState(true);
  const {dispatch} = useContext(AppContext);

  return (
    <div className='AI-control'>
      <div className="pageBtn" onClick={()=>setTrain(!train)}>{train ? 'Brain Setup' : 'Train AI'}</div>
      <span className='closeBtn' onClick={()=>dispatch({type:'SWITCH_TRAINING'})}>&#x2715;</span>
      {train && <Train setErr={setErr} />}
      {!train && <BrainSetup setErr={setErr} />}
      {err && <span className='err'>{err}</span>}
    </div>
  )
}


export default AITrainInfo;