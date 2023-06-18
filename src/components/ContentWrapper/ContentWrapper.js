import React from 'react'
import './Style.css'

const ContentWrapper = ({children}) => {
  return (
    <div className='contentWrapper'>
        {children}
    </div>
  )
}

export default ContentWrapper