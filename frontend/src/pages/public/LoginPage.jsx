import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import Cookies from 'js-cookie'
import { validateLoginData } from '../../validations/validateUser'
import AuthContext from '../../context/AuthContext'
import ValidationError from '../../components/ValidationError'

const LoginForm = () => {
    const { setAuth } = useContext(AuthContext)
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({})
    let navigate = useNavigate()

    const handleLoginFormInput = (e) => {
        setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value })
    }

    const handleLoginFormSubmission = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const errObj = validateLoginData(loginDetails)
        console.log(errObj)
        setError(errObj)
        if (Object.keys(errObj).length) return
        const url = 'http://localhost:3000/login'
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginDetails),
            method: 'POST',
        }
        try {
            const response = await fetch(url, options)
            if (response.ok) {
                const { data } = await response.json()

                const { jwtToken, user } = data

                Cookies.set('jwt_token', jwtToken, {
                    expires: 1,
                })
                Cookies.set('auth_user', JSON.stringify(user), {
                    expires: 1,
                })

                setAuth({ jwtToken, authUser: user })
                if (user.role === 'MENTOR') {
                    navigate('/mentor', { replace: true })
                } else {
                    navigate('/student', { replace: true })
                }
            } else {
                const err = new Error()
                const { data } = await response.json()
                err.data = data
                err.status = response.status
                throw err
            }
        } catch (err) {
            if (err.status === 400) {
                setError(err.data)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleLoginFormSubmission}
            className={`flex flex-col gap-4 ${isLoading ? 'opacity-40' : ''}`}
        >
            <div>
                <label htmlFor="email" className="label">
                    Email
                </label>
                <br />
                <input
                    className="input w-full focus:outline-none"
                    type="text"
                    name="email"
                    id="email"
                    value={loginDetails.email}
                    onChange={handleLoginFormInput}
                />
                <ValidationError errors={error.email} />
            </div>

            <div>
                <label htmlFor="password" className="label">
                    Password
                </label>
                <br />
                <input
                    className="input w-full focus:outline-none"
                    type="password"
                    name="password"
                    id="password"
                    value={loginDetails.password}
                    onChange={handleLoginFormInput}
                />
                <ValidationError errors={error.password} />
            </div>
            <button type="submit" className="btn bg-purple-600 text-white">
                {isLoading ? (
                    <span className="loading loading-dots loading-xs"></span>
                ) : (
                    'Login'
                )}
            </button>
        </form>
    )
}

const LoginPage = () => {
    return (
        <main className="flex grow flex-col items-center">
            <section className="w-full max-w-md p-8">
                <h1 className="mb-4 text-center text-2xl font-bold text-slate-800">
                    Welcome Back!
                </h1>
                <LoginForm />
                <p className="mt-2 text-center">
                    Don't have an account?{' '}
                    <Link to="/signup" className="link link-info">
                        Register
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default LoginPage
