import { initialState } from './appContext'
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  LOGOUT_USER,
  SET_USER_BEGIN,
  SET_USER_ERROR,
  SET_USER_SUCCESS,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
  TOGGLE_SIDEBAR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  EDIT_JOB_BEGIN,
  EDIT_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  DELETE_JOB_BEGIN,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS
} from "./actions"


const reducer = (state, action) => {
  // DISPLAY ALERT
  if (action.type === DISPLAY_ALERT) {
    return { ...state, showAlert: true, alertType: 'danger', alertText: 'Please provide all values!' }
  }

  // CLEAR ALERT
  if (action.type === CLEAR_ALERT) {
    return { ...state, showAlert: false, alertType: '', alertText: '' }
  }

  // REGISTER/LOGIN USER
  if (action.type === SET_USER_BEGIN) {
    return { ...state, isLoading: true }
  }

  if (action.type === SET_USER_SUCCESS) {
    const { user, token, location, alertText } = action.payload
    return {
      ...state,
      isLoading: false,
      user,
      token,
      userLocation: location,
      jobLocation: location,
      showAlert: true,
      alertType: 'success',
      alertText
    }
  }

  if (action.type === SET_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }

  // UPDATE USER
  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true }
  }

  if (action.type === UPDATE_USER_SUCCESS) {
    const { user, token, location } = action.payload
    return {
      ...state,
      isLoading: false,
      user,
      token,
      userLocation: location,
      jobLocation: location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User profile updated'
    }
  }

  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }

  // LOGOUT USER
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      userLocation: '',
      jobLocation: ''
    }
  }

  // SIDEBAR
  if (action.type === TOGGLE_SIDEBAR) {
    return { ...state, showSidebar: !state.showSidebar }
  }

  // HANDLE CHANGE
  if (action.type === HANDLE_CHANGE) {
    return { ...state, [action.payload.name]: action.payload.value }
  }

  // CLEAR VALUES
  if (action.type === CLEAR_VALUES) {
    return {
      ...state,
      isEditing: false,
      editJobId: '',
      position: '',
      company: '',
      jobLocation: state.userLocation,
      jobType: state.jobTypeOptions[0],
      status: state.statusOptions[0]
    }
  }

  // CREATE JOB
  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true }
  }
  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Job Created!'
    }
  }
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }

  // GET JOBS
  if (action.type === GET_JOBS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false }
  }
  if (action.type === GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPage: action.payload.numOfPage
    }
  }

  // EDIT JOB
  if (action.type === SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id)
    const { _id, position, company, jobLocation, jobType, status } = job
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status
    }
  }
  if (action.type === EDIT_JOB_BEGIN) {
    return { ...state, isLoading: true }
  }
  if (action.type === EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Job Updated!'
    }
  }
  if (action.type === EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg
    }
  }

  // DELETE JOB
  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true }
  }

  // SHOW STATS
  if (action.type === SHOW_STATS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false }
  }
  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications
    }
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: '',
      searchStatus: 'all',
      searchType: 'all',
      sort: state.sortOptions[0]
    }
  }

  throw new Error(`no such action : ${action.type}`)
}

export default reducer