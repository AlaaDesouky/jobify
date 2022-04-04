import { useReducer, useContext, createContext } from 'react'
import axios from 'axios'
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SET_USER_BEGIN,
  SET_USER_ERROR,
  SET_USER_SUCCESS
} from './actions'
import reducer from './reducer'

// Set data if exist from local storage
const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: userLocation || '',
  jobLocation: userLocation || ''
}

const AppContext = createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Alert functionality
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT })
    clearAlert()
  }
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT })
    }, 3000)
  }

  // Handle User in local storage
  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('location')
  }


  // Register/Login User
  const setUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SET_USER_BEGIN })
    try {
      const response = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
      const { user, token, location } = await response.data
      dispatch({ type: SET_USER_SUCCESS, payload: { user, token, location, alertText } })

      // add user local storage
      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      dispatch({ type: SET_USER_ERROR, payload: { msg: error.response.data.msg } })
    }

    clearAlert()
  }


  return (
    <AppContext.Provider value={{ ...state, displayAlert, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
