import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  SET_USER_BEGIN,
  SET_USER_ERROR,
  SET_USER_SUCCESS
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

  throw new Error(`no such action : ${action.type}`)
}

export default reducer