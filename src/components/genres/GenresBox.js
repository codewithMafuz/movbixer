import React from 'react'
import { useSelector } from 'react-redux'

export default function GenresBox({ directData = false, mediaType, genreIds, className = 'card-actions justify-center', spanClassName = 'badge badge-outline' }) {
    const { tvGenres, movieGenres } = useSelector(state => state.home)
    const genreNames = !directData ? (tvGenres && movieGenres ? (mediaType === 'movie' ? movieGenres : tvGenres) : []).genres.filter(genre => genreIds.includes(genre.id)).map(genre => genre.name) : false

    return (
        <div className={className}>
            {(directData ? directData : genreNames).map((name, index) =>
                <span key={index} className={spanClassName}>{name}</span>
            )}
        </div>
    )
}
