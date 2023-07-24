import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addInRecentSearchVals } from './searchSlice'

export default function SearchBox(props) {
    const dispatch = useDispatch()

    const [searchValInp, setSearchValInp] = useState('')
    const navigate = useNavigate()
    const handleSearchInp = (ev) => {
        let val = ev.target.value
        val = val.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gi, '');
        setSearchValInp(val)
    }
    const doSearch = () => {
        if (searchValInp.trim().length > 0) {
            const query = `/search/${searchValInp}`
            navigate(query)
            dispatch(addInRecentSearchVals(query))
        } else {
            setSearchValInp('')
        }
    }
    const searchIf = (ev) => {
        if (ev.key === "Enter") {
            doSearch()
        }
    }
    const handleClickSubmit = () => {
        if (props.hideMenu) {
            props.hideMenu()
        }
        doSearch()
    }

    return (
        <div className={`searchBox ${props.isInHeader ? 'headerSearch' : ''} ${props.className || ''}`}>
            <input
                type="search"
                value={searchValInp}
                placeholder='Search'
                onKeyDown={searchIf}
                onChange={handleSearchInp}
                className="searchInput"
            />
            <button
                type="submit"
                onClick={handleClickSubmit}
                className="mx-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300 text-white font-semibold py-2 px-4 rounded-md"
            ><i className='bi bi-search'></i></button>
        </div>

    )
}
