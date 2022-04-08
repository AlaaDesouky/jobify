import { useAppContext } from "../context/appContext"
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import Wrapper from '../assets/wrappers/PageBtnContainer'

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAppContext()
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1
  })

  const prevPage = () => {
    let newPage = page - 1
    if (newPage < 1) {
      newPage = numOfPages
    }
    changePage(newPage)
  }

  const nextPage = () => {
    let newPage = page + 1
    if (newPage > numOfPages) {
      newPage = 1
    }
    changePage(newPage)
  }

  return (
    <Wrapper>
      <button onClick={prevPage} className="prev-btn">
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              type='button'
              className={`pageBtn ${pageNumber === page && 'active'}`}
              key={pageNumber}
              onClick={() => changePage(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      <button onClick={nextPage} className='next-btn'>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  )
}

export default PageBtnContainer
