import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import ValidationError from '../../components/ValidationError'
import { validateSignUpData } from '../../validations/validateUser'
import { BASE_URL } from '../../constants'
const SignupForm = () => {
    const [signupDetails, setSignupDetails] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({})
    const navigate = useNavigate()

    const handleSignupFormInput = (e) => {
        setSignupDetails({ ...signupDetails, [e.target.name]: e.target.value })
    }

    const handleSignUpFormSubmission = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const errObj = validateSignUpData(signupDetails)
        setError(errObj)
        if (Object.keys(errObj).length) return
        const url = `${BASE_URL}/register`
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(signupDetails),
        }
        try {
            const response = await fetch(url, options)
            
            if (response.ok) {
                navigate('/login')
            } else {
                const responseJSON = await response.json()

                const resErr = new Error(responseJSON.message)

                resErr.status = response.status
                throw resErr
            }
        } catch (err) {
            if (err.status === 409) {
                setError({ email: [err.message] })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSignUpFormSubmission}
            className="flex flex-col gap-4"
        >
            <div>
                <label htmlFor="email" className="label">
                    Email
                </label>
                <br />
                <input
                    type="text"
                    name="email"
                    id="email"
                    className="input w-full focus:outline-none"
                    value={signupDetails.email}
                    onChange={handleSignupFormInput}
                />
                <ValidationError errors={error.email} />
            </div>
            <div>
                <label htmlFor="userName" className="label">
                    Username
                </label>
                <br />
                <input
                    type="text"
                    name="username"
                    id="userName"
                    className="input w-full focus:outline-none"
                    value={signupDetails.username}
                    onChange={handleSignupFormInput}
                />
                <ValidationError errors={error.username} />
            </div>
            <div>
                <label htmlFor="password" className="label">
                    Password
                </label>
                <br />
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="input w-full focus:outline-none"
                    value={signupDetails.password}
                    onChange={handleSignupFormInput}
                />
                <ValidationError errors={error.password} />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="label">
                    Confirm Password
                </label>
                <br />
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="input w-full focus:outline-none"
                    value={signupDetails.confirmPassword}
                    onChange={handleSignupFormInput}
                />
                <ValidationError errors={error.confirmPassword} />
            </div>
            <button className="btn bg-purple-600 text-white">Signup</button>
        </form>
    )
}

const SignupPage = () => {
    return (
        <main className="flex grow flex-col items-center">
            <section className="w-full max-w-md p-8">
                <h1 className="mb-4 text-center text-2xl font-bold text-slate-800">
                    Create new account
                </h1>
                <SignupForm />
                <p className="mt-2 text-center">
                    Already an existing user?{' '}
                    <Link to="/login" className="link link-info">
                        Login
                    </Link>
                </p>
            </section>
        </main>
    )
}

export default SignupPage
