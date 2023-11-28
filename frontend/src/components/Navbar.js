import { Link } from 'react-router-dom'
import Image from 'react-bootstrap/Image';

const Navbar = () => {

  return (
    <header>
      <div className="MainNavbar">
        <div className="logo">
          <a href="/"><img width="50px" height="auto" src="logo.png" /></a>
        </div>

        <Link to="/">
          <h1>HaggleHouse</h1>
        </Link>
        <Link to="/user/register"> Login</Link>
      </div>
    </header>
  )
}

export default Navbar