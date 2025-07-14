import { useContext, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { socket } from '../socket'

import AuthContext from '../context/AuthContext'

//send user ID to client
const ProtectedRoute = ({ allowedRole }) => {
    const {
        auth: { jwtToken, authUser },
    } = useContext(AuthContext)

    useEffect(() => {
        socket.connect()
        socket.emit('map-user', authUser._id)

        return () => {
            socket.disconnect()
        }
    }, [])

    return jwtToken && allowedRole === authUser.role ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    )
}

export default ProtectedRoute
