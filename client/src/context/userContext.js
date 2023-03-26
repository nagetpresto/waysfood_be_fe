import { createContext, useReducer } from "react";

export const UserContext = createContext()

const initial = {
    isLogin: false,
    user: {}
};

if (localStorage.getItem("token")) {
    initial.isLogin = true;
    initial.user = JSON.parse(localStorage.getItem("user"));
}

const reducer = (state, action) => {
    const {type, payload} = action

    switch(type){
        case 'USER_SUCCESS':
            localStorage.setItem("user", JSON.stringify(payload));
            return{
                isLogin : true,
                user: payload
            }
        case 'LOGIN_SUCCESS':
            localStorage.setItem("token", payload.token)
            localStorage.setItem("user", JSON.stringify(payload));
            return{
                isLogin : true,
                user: payload
            }
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return{
                isLogin : false,
                user: {}
            }
        default:
            throw new Error()
    }
}

export const UserContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initial)

    return(
        <UserContext.Provider value={[state, dispatch]}>
            {children}
        </UserContext.Provider>
    )
}