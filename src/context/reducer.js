import { initialState } from './appContext'
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  LOGOUT_USER,
  SET_USER_BEGIN,
  SET_USER_ERROR,
  SET_USER_SUCCESS,
  TOGGLE_SIDEBAR
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

  throw new Error(`no such action : ${action.type}`)
}

export default reducer