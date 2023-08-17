import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import NoPoster from '../../assets/no-poster.png'

export default function LazyLoadImg({ src, className, alt, effect = 'blur' }) {
    return (
        <LazyLoadImage
            src={src || NoPoster}
            className={className || ''}
            alt={alt || 'img loading'}
            effect={effect}
        />
    )
}
