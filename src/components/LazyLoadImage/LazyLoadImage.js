import React from 'react'
import {LazyLoadImage} from 'react-lazy-load-image-component'
// import FullBlackImage from '../../assets/images/full-black-image.jpg'

export function LazyImageLoader({src, classNames}) {
  return (
    <LazyLoadImage effect='blur' alt='img loading...' src={src} className={classNames || ''}/>
  )
}
