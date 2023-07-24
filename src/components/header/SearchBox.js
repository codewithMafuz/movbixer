import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function SearchBox({ screenCatg, isInHeader, classNames }) {
    const dispatch = useDispatch()

    const [queryIsOk, setQueryIsOk] = useState(false)
    const [searchValInp, setSearchValInp] = useState('')
    const navigate = useNavigate()
    const handleSearchInp = (ev) => {
        let val = ev.target.value
        val = val.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gi, '');
        setQueryIsOk(searchValInp.length !== 0)
        setSearchValInp(val)
    }
    const doSearch = () => {
        if (queryIsOk) {
            navigate(`/search/${searchValInp}`)
        }
    }
    const searchIf = (ev) => {
        if (ev.key === "Enter" && queryIsOk) {
            doSearch()
        }
    }

    return (
        <div className={`searchBox ${isInHeader ? 'headerSearch' : ''} ${classNames}`}>
            <input
                type="search"
                value={searchValInp}
                placeholder={screenCatg !== 'mobile' ? 'Search movies or TV shows...' : 'Search...'}
                onKeyDown={searchIf}
                onChange={handleSearchInp}
                className="bg-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                disabled={!queryIsOk}
                type="submit"
                onClick={doSearch}
                className="mx-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300 text-white font-semibold py-2 px-4 rounded-md"
            >Search</button>
        </div>

    )
}
