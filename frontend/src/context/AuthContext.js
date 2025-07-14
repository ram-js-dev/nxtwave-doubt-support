import { createContext } from 'react'

const AuthContext = createContext({
    auth: { jwtToken: '', authUser: {} },
    setAuth: () => {},
})

export default AuthContext
