
const Button = (props) => {
  const {name,...rest} = props;
  return (
    <button className="myButton" {...rest} >{name}</button>
  )
}

export default Button;