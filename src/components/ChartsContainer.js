import { useState } from 'react'
import BarChart from './BarChart'
import AreaChart from './AreaChart'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ChartsContainer'

const ChartsContainer = () => {
  const [isBarChart, setIsBarChart] = useState(true)
  const { monthlyApplications: data } = useAppContext()


  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type='button' onClick={() => setIsBarChart(!isBarChart)}>
        {isBarChart ? 'AreaChart' : 'BarChart'}
      </button>
      {isBarChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  )
}

export default ChartsContainer
