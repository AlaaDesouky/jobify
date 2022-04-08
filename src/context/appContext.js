import { useReducer, useContext, createContext, useEffect } from 'react'
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
  TOGGLE_SIDEBAR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS
} from './actions'
import reducer from './reducer'
import { jobTypeOptions, statusOptions, sortOptions } from '../utils/jobs'

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

  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions,
  jobType: jobTypeOptions[0],
  statusOptions,
  status: statusOptions[0],

  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,

  stats: {},
  monthlyApplications: [],

  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sortOptions,
  sort: sortOptions[0]
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

  // Handle Change
  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: {
        name, value
      }
    })
  }

  // Clear Values
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  // Create Job
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.post('/jobs', {
        company, position, jobLocation, jobType, status
      })
      dispatch({ type: CREATE_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  // Get Jobs
  const getJobs = async () => {
    const { search, searchStatus, searchType, sort } = state
    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) {
      url = `${url}&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })

    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages
        }
      })
    } catch (error) {
      console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  // Edit/Delete Job
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } })
  }
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status, editJobId } = state
      await authFetch.patch(`/jobs/${editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status
      })

      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`jobs/${id}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }


  // Show Stats
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications
        }
      })
    } catch (error) {
      console.log(error.response)
      logoutUser()
    }
    clearAlert()
  }

  // Clear Filters
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
        clearFilters
      }}
    >

      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
