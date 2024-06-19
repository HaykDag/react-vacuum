import { useContext, useState } from "react";
import { room } from "../../../hooks/useCanvas"
import { AppContext } from "../../../context/AppContext";
import Input from "../../Input";
import Button from "../../Button";
import NeuralNetwork from "../../../jsCode/network";

const BrainSetup = ({setErr}) => {


  const [nodeCount,setNodeCount] = useState('');
  

  const {dispatch} = useContext(AppContext);

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
    <form className='brain-setup-cnt' onSubmit={handleConfigureBrain}>
      <div className="details">
        Configure the hidden layers of the brain!
        <span>
          Specify the node counts bottom up exclude the first line of nodes (they are sensor inputs) and the last line (they are final outputs).
          Seperate the number of neurons on each level using <b>','</b> . 
        </span>
        <span>Now the setup is the Following: <b>{String(room.vacuum.brainSetup.slice(1,room.vacuum.brainSetup.length-1))}</b></span>
        <span className='warning'>WARNING: If you change the setup you will lose all the saved brains!</span>
      </div>
      <div className='info-inputs'>
        <Input placeholder='nodes' type='text' style={{width:'150px', fontSize:'1.2rem'}} setNodeCount={setNodeCount} value={nodeCount} />
      </div>
      <Button name='Save' onClick={handleConfigureBrain} />
    </form>
  )
}

export default BrainSetup