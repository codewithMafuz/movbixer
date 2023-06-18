import React from 'react'
import './Style.css'

export const PageNotFound = () => {
  console.log(window.location);

  return (
    <div>PageNotFound <b className='italic'>{window.location.href}</b></div>
  )
}
export default PageNotFound