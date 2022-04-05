import { useReducer, useContext, createContext } from 'react'
import axios from 'axios'
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SET_USER_BEGIN,
  SET_USER_ERROR,
  SET_USER_SUCCESS,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  LOGOUT_USER,
  TOGGLE_SIDEBAR
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
  showSidebar: false,
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: userLocation || '',
  jobLocation: userLocation || ''
}

const AppContext = createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Axios setup
  const authFetch = axios.create({ baseURL: '/api/v1' })
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error)
    }
  )


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

  // Update User
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)
      const { user, token, location } = data
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token }
      })

      addUserToLocalStorage({ user, token, location })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg }
        })
      }
    }
    clearAlert()
  }

  // Logout User
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER })
    removeUserFromLocalStorage()
  }

  // Sidebar
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  return (
    <AppContext.Provider value={{ ...state, displayAlert, setUser, toggleSidebar, logoutUser, updateUser }}>
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
