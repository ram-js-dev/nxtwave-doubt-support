import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Navigate, Outlet, Link } from 'react-router'
import logo from '../images/logo.png'
const PublicRoute = () => {
    const {
        auth: { jwtToken, authUser },
    } = useContext(AuthContext)

    return jwtToken ? (
        authUser.role === 'MENTOR' ? (
            <Navigate to="mentor" replace />
        ) : (
            <Navigate to="student" replace />
        )
    ) : (
        <div className="container mx-auto flex min-h-screen flex-col px-2 md:px-4">
            <nav className="navbar py-0 font-bold">
                <div className="navbar-start">
                    <Link to="/">
                        <img src={logo} className="h-8" />
                    </Link>
                </div>

                <ul className="navbar-end menu menu-horizontal text-purple-500">
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                </ul>
            </nav>
            {<Outlet />}
        </div>
    )
}
export default PublicRoute
