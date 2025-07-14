import { useContext } from 'react'
import { Outlet, Link } from 'react-router'
import Cookies from 'js-cookie'
import AuthContext from '../context/AuthContext'

const RootLayout = () => {
    const {
        auth: { jwtToken },
        setAuth,
    } = useContext(AuthContext)

    const handleLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('auth_user')

        setAuth({ jwtToken: '', authUser: {} })
    }
    return (
        <div>
            <header>
                <h2>Logo</h2>
                {jwtToken ? (
                    <ul>
                        <li>🔔</li>
                        <li>
                            <Link to="/students/doubts">Doubts</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Signup</Link>
                        </li>
                    </ul>
                )}
            </header>
            {<Outlet />}
        </div>
    )
}

export default RootLayout
