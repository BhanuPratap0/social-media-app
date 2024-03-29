import { createContext, useReducer, useState } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
    user: null || JSON.parse(localStorage.getItem("user")),
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {

    const [postLength, setPostLength] = useState("1");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [followingArray, setFollowingsArray] = useState([]);
    const [postChange, setPostChange] = useState();
    const [userChange, setUserChange] = useState();
    const [coversationSearch, setCoversationSearch] = useState(null);
    const [conversationDelete, setConversationDelete] = useState();
    // const host = "http://localhost:8800";
    const host = "https://sociosync.onrender.com";
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
            userChange,
            setUserChange,
            host,
            coversationSearch,
            setCoversationSearch,
            postLength, 
            setPostLength,
            conversationDelete, 
            setConversationDelete,
        }} >
            {children}
        </AuthContext.Provider>
    );
};