import Canvas from './components/canvas/Canvas.jsx';
import BrainCanvas from './components/canvas/brainCanvas.jsx';
import Header from './components/header/Header.jsx';
import AITrainInfo from './components/AITrainInfo/AITrainInfo.jsx';
import Restart from './components/restart/Restart.jsx';
import { useState } from 'react';
import './App.css';

function App() {

  const [training,setTraining] = useState(false);
  const [isClean,setIsClean] = useState(false);
  const [control,setControl] = useState('KEYS');

  
  return (
    <div>
      <Header 
        setTraining={setTraining}
        setControl={setControl}
        control={control}    
      />
      <div className='canvas-cnt'>
        <Canvas 
          width={1000} 
          height={600} 
          setIsClean={setIsClean}
        />
        {control==='AI' && <BrainCanvas width={400} height={600}/>}
      </div>
      {training && <AITrainInfo setTraining={setTraining} />}
      {isClean && <Restart setIsClean={setIsClean} />}
    </div>
  )
}

export default App




