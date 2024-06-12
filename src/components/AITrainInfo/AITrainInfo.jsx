import Input from '../Input';
import Button from '../Button';
import { AppContext } from '../../context/AppContext';
import './AITrainInfo.css';
import { useState, useContext } from 'react';
import { room } from '../../hooks/useCanvas';
import NeuralNetwork from '../../jsCode/network';


const AITrainInfo = () => {

  const {dispatch} = useContext(AppContext);

  const [count,setCount] = useState(50);
  const [mutation,setMutation] = useState(0.5);

  const [nodeCount,setNodeCount] = useState('');

  const [err, setErr] = useState('');

  const handleGenerate = ()=>{
    room.generateVacuums(count,mutation);
    dispatch({type:'SWITCH_TRAINING'});
  }

  const handleConfigureBrain = ()=>{
    setErr('');
    //implement validity checks
    let neurons = nodeCount.trim().split(',');
    neurons.pop();
    neurons = neurons.map(Number);

    for(const n of neurons){
      if(isNaN(n)){
        setErr('All values should be numbers!');
        return;
      } 
      if(n<=0 || n>10){
        setErr('Neuron count for each level should be between 1 to 9!');
        return;
      } 
    }

    const setup = [5,...neurons,3];   
    room.vacuum.brain = new NeuralNetwork(setup);

    //save the configuration in localstorage maybe
    localStorage.setItem('brainSetup',JSON.stringify(setup));
    localStorage.removeItem('brains');
    dispatch({type:'SWITCH_TRAINING'});
  }

  return (
    <div className='AI-control'>
      <span className='closeBtn' onClick={()=>dispatch({type:'SWITCH_TRAINING'})}>&#x2715;</span>
      <div className="train-info">
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
          <Input placeholder='Count' type='number' setCount={setCount} value={count}  />
          <Input placeholder='Mutation' type='number' setMutation={setMutation} value={mutation} />
        </div>
        <Button name='Generate' onClick={handleGenerate} />
      </div>
      <div className='brain-setup-cnt'>
        <div className="details">
          Configure the hidden layers of the brain!
          <span>
            Enter the Number of the layers between the bottom and the top lines of nodes (they are fixed) and how many nodes should each layer contain.
            Specify the node counts bottom up exclude the first line of nodes (they are sensor inputs) and the last line (they are final outputs).
            Seperate the number of neurons on each level using <b>','</b> . 
          </span>
          <span>Now the setup is the Following:</span>
          <span>{String(room.vacuum.brainSetup.slice(1,room.vacuum.brainSetup.length-1))}</span>
          <span className='warning'>WARNING: If you change the setup you will lose all the saved brains!</span>
        </div>
        <div className='info-inputs'>
          <Input placeholder='nodes' type='text' setNodeCount={setNodeCount} value={nodeCount} />
        </div>
        <Button name='Save' onClick={handleConfigureBrain} />
      </div>
      {err && <span className='err'>{err}</span>}
    </div>
  )
}


export default AITrainInfo;