import Canvas from './components/canvas/Canvas.jsx';
import BrainCanvas from './components/canvas/brainCanvas.jsx';
import Header from './components/header/Header.jsx';
import AITrainInfo from './components/AITrainInfo/AITrainInfo.jsx';
import Restart from './components/restart/Restart.jsx';
import { useContext, useState } from 'react';
import './App.css';
import { AppContext } from './context/AppContext.jsx';
import { room } from './hooks/useCanvas.jsx';

function App() {

  const { control, training } = useContext(AppContext);
  
  const [isClean,setIsClean] = useState(false);

  const onRestart = ()=>{
    room.generateGarbage(250);
    setIsClean(false);
  }

  return (
    <div>
      <Header/>
      <div className='canvas-cnt'>
        <Canvas width={room.size.width} height={room.size.height} setIsClean={setIsClean} />
        {control==='AI' && <BrainCanvas width={400} height={600}/>}
      </div>
      {training && <AITrainInfo  />}
      {isClean && <Restart onRestart={onRestart}/>}
    </div>
  )
}

export default App




