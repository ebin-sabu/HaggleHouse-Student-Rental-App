import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header>
      <div className="MainNavbar">
        <Link to="/">
          <h1>HaggleHouse</h1>
        </Link>
        <Link to="/login"><h2>Login</h2></Link>
      </div>
    </header>
  )
}

export default Navbar