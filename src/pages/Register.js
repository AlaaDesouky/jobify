import { useState, useEffect } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'

// Initial State
const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
  showAlert: false
}

const Register = () => {
  const [values, setValues] = useState(initialState)


  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e.target)
  }

  const handleChange = (e) => {
    console.log(e.target, e.target.value)
  }

  return (
    <Wrapper className='full-page'>
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember ? 'login' : 'register'}</h3>
        {/* alert */}
        {values.showAlert && <Alert text='Alert' type='danger' />}
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
