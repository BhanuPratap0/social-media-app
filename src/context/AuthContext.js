import { createContext, useEffect, useReducer, useState } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
    user: null || JSON.parse(localStorage.getItem("user")),
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [followingArray, setFollowingsArray] = useState([]);
    const [postChange, setPostChange] = useState();
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    
    return (
        <AuthContext.Provider value={{
            loginSuccess, setLoginSuccess,
            searchResult, 
            setSearchResult,
            followingArray, 
            setFollowingsArray,
            postChange,
            setPostChange,
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }} >
            {children}
        </AuthContext.Provider>
    );
};