import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header>
      <div className="navbar">
        <Link to="/">
          <h1>HaggleHouse</h1>
        </Link>
        <Link to="/login"> Login</Link>
      </div>
    </header>
  )
}

export default Navbar