import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <>
    <h1>Dashboard</h1>
    <Link to="/login">Login</Link>
    <Link to="/">home</Link>
    </>
  )
}

export default Dashboard;