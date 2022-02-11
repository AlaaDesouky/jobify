import logo from '../assets/images/logo.svg'
import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <img src={logo} alt="Jobify" className="logo" />
      </nav>
      {/* two coloums view */}
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>Job <span>Tracking</span> App</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sed est at nisl aliquam maximus et eu erat. In lacus massa, pharetra sit amet suscipit id, ultrices in purus. Maecenas at nibh vitae tortor interdum venenatis nec sit amet nisl.
          </p>
          <button className="btn btn-hero">Login/Register</button>
        </div>
        {/* image */}
        <img src={main} alt="" className="img main-img" />
      </div>
    </Wrapper>
  )
}

export default Landing
