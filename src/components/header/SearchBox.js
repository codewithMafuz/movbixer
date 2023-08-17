import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchDataFromApi from '../../api/fetchURL';
import { useSelector } from 'react-redux';
import BadWordsFilter from 'bad-words';
const filterWords = new BadWordsFilter()

const DEBOUNCE_DELAY = 120;

export default function SearchBox(props) {
    const navigate = useNavigate();

    const [searchValInp, setSearchValInp] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestionBox, setShowSuggestionBox] = useState(false);
    const [doneSearched, setDoneSearched] = useState(false)

    const inputRef = useRef()
    const searchBoxContainer = useRef()
    const stateSearchVal = useSelector(state => state.search.searchVal)

    const handleSearchInp = (ev) => {
        setDoneSearched(false)
        let val = ev?.target?.value || ''
        val = val.replaceAll(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gi, '')
        setSearchValInp(val)
    };

    useEffect(() => {
        setSearchValInp(stateSearchVal)
        setShowSuggestionBox(false)
    }, [stateSearchVal])

    useEffect(() => {
        if (!filterWords.isProfane(searchValInp) && decodeURIComponent(window.location.href.split('search/')[1]) !== searchValInp) {
            const debounceTimer = setTimeout(() => {
                if (!doneSearched) {
                    if (searchValInp.trim().length > 1 && searchValInp.trim().length < 180) {
                        fetchDataFromApi('/search/keyword', {
                            query: searchValInp,
                            page: 1,
                        })
                            .then((response) => {
                                setSuggestions(response.results.slice(0, 8).map(obj => obj.name).filter(nm => !filterWords.isProfane(nm)));
                                setShowSuggestionBox(true);
                            })
                            .catch((er) => {
                            });
                    } else {
                        setShowSuggestionBox(false);
                        setSuggestions([]);
                    }
                }
            }, DEBOUNCE_DELAY);
            return () => clearTimeout(debounceTimer);
        }
    }, [searchValInp]);

    const doSearch = (val = false) => {
        if (!filterWords.isProfane(searchValInp)) {
            setDoneSearched(true)
            setShowSuggestionBox(false);
            if (searchValInp.trim().length > 0 && searchValInp.trim().length < 180) {
                const query = `/search/${val ? val : searchValInp}`;
                navigate(query);
            } else {
                setSearchValInp('');
            }
        }
    };

    const handleKeyDownSearch = (ev) => {
        if (ev.keyCode === 13 && !filterWords.isProfane(searchValInp)) {
            doSearch(searchValInp);
            setShowSuggestionBox(false)
        }
    };

    const handleClickSubmit = () => {
        if (props.hideMenu) {
            props.hideMenu();
        }
        doSearch();
    };

    const handleKeyDownWindow = (ev) => {
        if (ev.ctrlKey && ev.key === '/') {
            inputRef?.current?.focus()
        }
    };

    useEffect(() => {
        const handleOutsideClick = (ev) => {
            if (searchBoxContainer.current && !searchBoxContainer.current.contains(ev.target)) {
                setShowSuggestionBox(false)
            }
        };

        if (suggestions.length) {
            if ('ontouchstart' in window) {
                document.addEventListener('touchstart', handleOutsideClick);
            } else {
                document.addEventListener('mousedown', handleOutsideClick);
            }
        }

        return () => {
            if ('ontouchstart' in window) {
                document.removeEventListener('touchstart', handleOutsideClick);
            } else {
                document.removeEventListener('mousedown', handleOutsideClick);
            }
        };
    }, [suggestions.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDownWindow);
        return () => {
            window.removeEventListener('keydown', handleKeyDownWindow);
        };
    }, []);

    return (
        <div className='searchBox headerSearch' ref={searchBoxContainer}>
            {showSuggestionBox && suggestions.length > 0 && (
                <div className='suggestionsBox'>
                    {suggestions.map((name, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                doSearch(name);
                            }}
                            className='suggestionOption'
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
            <input
                ref={inputRef}
                type='search'
                value={searchValInp}
                placeholder='Search'
                onKeyDown={handleKeyDownSearch}
                onChange={handleSearchInp}
                className='searchInput'
                onFocus={() => {
                    if (suggestions.length > 0) {
                        setShowSuggestionBox(true)
                    }
                    window.removeEventListener('keydown', handleKeyDownWindow);
                }}
                onBlur={() => {
                    window.addEventListener('keydown', handleKeyDownWindow);
                }
                }
            />
            <button
                type='submit'
                onClick={handleClickSubmit}
                className='mx-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300 text-white font-semibold py-2 px-4 rounded-md'
            >
                <i className='bi bi-search'></i>
            </button>
        </div>
    );
}
