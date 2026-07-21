import { Link } from 'react-router-dom';

function Home() {
  
  return (
    <>
    <h1>ola</h1>
    <Link to="/login">Login</Link>
    <Link to="/dashboard">Dashboard</Link>
    </>
  )
}

export default Home;