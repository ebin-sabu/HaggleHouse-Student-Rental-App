import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header>
      <div className="MainNavbar">
        <Link to="/">
          <h1>< span class="highlight">H</span>aggle< span class="highlight">H</span>ouse</h1>
        </Link>
        <Link to="/login"><h2>Login</h2></Link>
      </div>
    </header>
  )
}

export default Navbar