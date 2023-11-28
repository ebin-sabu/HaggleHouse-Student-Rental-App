import Button from 'react-bootstrap/Button';
const Login = () => {

    return (
        <form className="login">
            <img className="logoLogin" width="200px" height="auto" alt="logo" src="fav.png" />
            <h3>Login</h3>

            <label>Email</label>
            <input
                type="email"
            /*onChange={(e) => setEmail(e.target.value)} */
            /*value={email} */
            />

            <label>Password</label>
            <input
                type="password"
            /*onChange={(e) => setPassword(e.target.value)} */
            /*value={password} */
            />
            <div className="d-grid gap-2">
                <Button variant="warning">Login</Button>
            </div>
        </form>
    )
}

export default Login