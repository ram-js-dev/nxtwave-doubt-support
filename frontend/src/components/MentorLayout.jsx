import { useContext } from 'react'

import { Link, Outlet } from 'react-router'
import Cookies from 'js-cookie'
import AuthContext from '../context/AuthContext'
import logo from '../images/logo.png'
import { Toaster } from 'react-hot-toast'

const MentorLayout = () => {
    const { setAuth } = useContext(AuthContext)

    const handleLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('auth_user')

        setAuth({ jwtToken: '', authUser: {} })
    }

    return (
        <main className="container mx-auto flex min-h-screen flex-col px-2 md:px-4">
            <nav className="navbar py-0 font-bold">
                <div className="navbar-start">
                    <Link to="/mentor">
                        <img src={logo} className="h-8" />
                    </Link>
                </div>
                <ul className="navbar-end menu menu-horizontal text-purple-500">
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            {<Outlet />}
            <Toaster />
        </main>
    )
}

export default MentorLayout
