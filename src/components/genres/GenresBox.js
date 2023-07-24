import React from 'react'
import { useSelector } from 'react-redux'

export default function GenresBox({ mediaType, genreIds, className, spanClassName }) {
    const { tvGenres, movieGenres } = useSelector(state => state.home)
    const watchGenres = mediaType === 'movie' ? movieGenres : tvGenres
    const genreNames = watchGenres.genres.filter(genre => genreIds.includes(genre.id)).map(genre => genre.name)
    const spanClass = spanClassName || 'badge badge-outline'

    return (
        <div className={className || 'card-actions justify-center'}>
            {genreNames.map(name =>
                <span key={name} className={spanClass}>{name}</span>
            )}
        </div>
    )
}
