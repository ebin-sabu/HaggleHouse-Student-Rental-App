
const Login = () => {

    return (
        <form className="login">
            <h3>Login</h3>

            <label>Email</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />

            <label>Password</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />

            <button disabled={isLoading}>
                Login
            </button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Login