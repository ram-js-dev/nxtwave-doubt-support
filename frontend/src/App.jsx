import { useState } from 'react'
import { Routes, Route } from 'react-router'
import Cookies from 'js-cookie'
import AuthContext from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import StudentLayout from './components/StudentLayout'
import MentorLayout from './components/MentorLayout'
import RootPage from './pages/public/RootPage'
import LoginPage from './pages/public/LoginPage'
import SignupPage from './pages/public/SignupPage'
import StudentHomePage from './pages/student/StudentHomePage'
import MentorHomePage from './pages/mentor/MentorHomePage'
import DoubtsPage from './pages/student/DoubtsPage'
import NotFoundPage from './pages/public/NotFoundPage'

const App = () => {
    const userStr = Cookies.get('auth_user')
    const jwtToken = Cookies.get('jwt_token')
    const [auth, setAuth] = useState({
        jwtToken,
        authUser: userStr ? JSON.parse(userStr) : {},
    })

    return (
        <AuthContext value={{ auth, setAuth }}>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route index element={<RootPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignupPage />} />
                </Route>
                <Route
                    path="student"
                    element={<ProtectedRoute allowedRole="STUDENT" />}
                >
                    <Route element={<StudentLayout />}>
                        <Route index element={<StudentHomePage />} />
                        <Route path="doubts">
                            <Route index element={<DoubtsPage />} />
                        </Route>
                    </Route>
                </Route>
                <Route
                    path="mentor"
                    element={<ProtectedRoute allowedRole="MENTOR" />}
                >
                    <Route element={<MentorLayout />}>
                        <Route index element={<MentorHomePage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AuthContext>
    )
}

export default App
