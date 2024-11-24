import { useNavigate } from 'react-router-dom';
import './css/Homepage.css';

function Homepage(){
  const navigate = useNavigate();
  return(
    <div className='homepage'>
      <div className='intro-box'>
        <h1>Welcome to Your Own Planet</h1>
        <p> “Your Own Planet” is a travel planning and tracking platform designed to simplify and unify the entire travel experience, from preparation through to sharing and reminiscing. </p>
        <button onClick={()=>navigate('/signin')}>Sign In</button>
      </div>
      <div className='map-background'></div>
    </div>
  )
}
export default Homepage;