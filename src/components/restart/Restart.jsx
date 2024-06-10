import Button from '../Button.jsx';
import './restart.css';


const Restart = ({onRestart}) => {

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