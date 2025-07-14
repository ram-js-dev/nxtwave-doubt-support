import { useState, useEffect, useContext } from 'react'
import { Link, Outlet } from 'react-router'
import toast, { Toaster } from 'react-hot-toast'
import { socket } from '../socket'
import Cookies from 'js-cookie'
import AuthContext from '../context/AuthContext'

import logo from '../images/logo.png'
import invitationSound from '../sounds/invitationAudio.mp3'
import { BASE_URL } from '../constants'

const StudentLayout = () => {
    const [invites, setInvites] = useState([])
    const [isInvited, setIsInvited] = useState(false)

    const {
        auth: { jwtToken, authUser },
        setAuth,
    } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)

    const fetchInvitations = async () => {
        setIsLoading(true)
        const url = `${BASE_URL}/doubts?isNotified=true&status=PENDING&postedBy=${authUser._id}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options)
        const {
            data: { doubts },
        } = await response.json()

        setInvites(doubts)
        setIsLoading(false)
    }

    const handleLogout = () => {
        Cookies.remove('jwt_token')
        Cookies.remove('auth_user')

        setAuth({ jwtToken: '', authUser: {} })
    }

    useEffect(() => {
        fetchInvitations()
        function onInvite(invite) {
            setIsInvited(true)
            setTimeout(() => {
                setIsInvited(false)
            }, 5000)
            const audio = new Audio(invitationSound)
            audio.play()
            setInvites((prevInvites) => [invite, ...prevInvites])
            toast('you have a new inviation', {
                icon: '🔔',
                className: '!text-purple-500',
            })
        }
        function onUnInvite(invite) {
            setInvites((prevInvites) =>
                prevInvites.filter(
                    (eachInvite) => eachInvite._id !== invite._id
                )
            )
        }
        socket.on('invite', onInvite)
        socket.on('un-invite', onUnInvite)

        return () => {
            socket.off('invite', onInvite)
            socket.off('un-invite', onUnInvite)
        }
    }, [])

    return (
        <main className="container mx-auto flex min-h-screen flex-col px-2 md:px-4">
            <nav className="navbar py-0 font-bold">
                <div className="navbar-start">
                    <Link to="/student">
                        <img src={logo} className="h-8" />
                    </Link>
                </div>
                <div
                    className={`${
                        invites.length ? 'indicator' : ''
                    } navbar-end lg:hidden`}
                >
                    {invites.length > 0 && (
                        <span
                            className={`indicator-item status status-success ${isInvited ? 'wobble' : ''}`}
                        ></span>
                    )}

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {' '}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 text-purple-500 shadow-sm">
                            <li>
                                <Link to="/student">
                                    Home{' '}
                                    <span className="badge bg-slate-200 text-slate-600">
                                        {invites.length || 0}
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/student/doubts">Doubts</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <ul className="navbar-end menu menu-horizontal hidden text-purple-500 lg:flex">
                    <li>
                        <Link to="/student">
                            Home{' '}
                            <span
                                className={`badge bg-slate-200 text-slate-600 ${isInvited ? 'wobble' : ''}`}
                            >
                                {invites.length || 0}
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/student/doubts">Doubts</Link>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            {<Outlet context={{ isLoading, invites, setInvites }} />}
            <Toaster />
        </main>
    )
}

export default StudentLayout
