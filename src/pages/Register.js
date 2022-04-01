import { useState, useEffect } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'

// Initial State
const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
}

const Register = () => {
  const [values, setValues] = useState(initialState)
  const { isLoading, showAlert, displayAlert } = useAppContext()


  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { name, email, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert()
      return
    }
    console.log(values)
  }


  return (
    <Wrapper className='full-page'>
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember ? 'login' : 'register'}</h3>
        {/* alert */}
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && <FormRow handleChage={handleChange} name='name' type='text' value={values.name} />}
        {/* email input */}
        <FormRow handleChage={handleChange} name='email' type='email' value={values.email} />
        {/* password input */}
        <FormRow handleChage={handleChange} name='password' type='password' value={values.password} />

        <button className="btn btn-block" type='submit'>
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}

export default Register
