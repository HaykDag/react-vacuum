import { room } from '../../hooks/useCanvas.jsx';
import Button from '../Button.jsx';
import './restart.css';

const Restart = ({setIsClean}) => {

  const onRestart = ()=>{
    setIsClean(false);
    room.generateGarbage(250);
  }

  return (
    <div className="finish-info">
      <p className="finish-info-text">
        Congratulations the room is Clean now.
      </p>
      <Button name='Restart' onClick={onRestart} />
    </div>
  )
}

export default Restart;