import Button from 'react-bootstrap/Button';
const SignUp = () => {

    return (
        <form className="signUp">
            <img className="logoLogin" width="200px" height="auto" alt="logo" src="fav.png" />
            <h3>Sign Up</h3>

            <label>Name</label>
            <input
                type="name"
            /*onChange={(e) => setEmail(e.target.value)} */
            /*value={email} */
            />

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

export default SignUp