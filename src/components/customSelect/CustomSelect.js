import React, { useState, useRef, useEffect } from 'react';
import './Style.css';
import { findClosestMatches } from '../../App';

export default function CustomSelect({
    uniqueId,
    resultName = false,
    nameOfSelect = 'Select',
    filterList = [],
    canSelectMulti = true,
    hideOptionsOnSelect = false,
    searchOption = true,
    onFilterChange = null,
    optionHeightPx = 28,
}) {
    resultName = resultName ? resultName : uniqueId
    if (!filterList) {
        filterList = [];
    }
    if (canSelectMulti) {
        hideOptionsOnSelect = false
    }

    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const allNames = filterList;
    const [filterOptions, setFilterOptions] = useState(allNames);
    const [firstTimeModification, setFirstTimeModification] = useState(true)
    const [searchVal, setSearchVal] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeOptionIndex, setActiveOptionIndex] = useState(null);
    const [showCaret, setShowCaret] = useState(false);
    const [caretPos, setCaretPos] = useState(0);

    const inputField = useRef();
    const inputFieldContainer = useRef();
    const topBoxContainer = useRef();
    const selectContainer = useRef();
    const detectInputWidthSpan = useRef();

    useEffect(() => {
        if (searchVal.length > 0) {
            setShowFilterOptions(true)
        }
        setCaretPos(detectInputWidthSpan?.current?.offsetWidth + 'px');
    }, [searchVal]);

    const handleCursor = () => {
        if (inputField.current) {
            const input = inputField.current;
            const inputLength = input.value.length;
            input.setSelectionRange(inputLength, inputLength);
        }
        setShowCaret(true);
    };

    const hideCaret = () => {
        setShowCaret(false);
    };

    const searchFilterOptions = (ev) => {
        if (!searchOption) {
            return;
        }
        const val = ev.target.value.replace('  ', ' ');
        setSearchVal(val);
        if (val.length > 0) {
            setShowFilterOptions(true);
        }
        const query = val.toLowerCase();
        if (query.length === 0) {
            setFilterOptions(allNames.filter(nm => !selectedOptions.includes(nm)));
        } else {
            const queryResults = findClosestMatches(query, allNames);
            setFilterOptions(queryResults.filter(name => !selectedOptions.includes(name)));
        }
        setActiveIndex(filterOptions.length === 0 ? null : 0);
    };

    const setActiveIndex = (nth) => {
        const child = selectContainer?.current?.children[nth];
        if (child) {
            child.focus();
            setActiveOptionIndex(nth);
            inputField.current.focus();
        }
    };

    const handleKeyDownFilterOption = (ev) => {
        handleCursor();
        if (filterOptions.length !== 0) {
            const code = ev.keyCode;
            const maxIndex = filterOptions.length - 1;
            if ((ev.ctrlKey || ev.metaKey) && code === 8) {
                const lastOne = selectedOptions.pop();
                if (lastOne) {
                    setFilterOptions([...filterOptions, lastOne]);
                }
            }
            if (typeof activeOptionIndex === 'number' && code === 13) {
                if (activeOptionIndex === maxIndex) {
                    setActiveOptionIndex(maxIndex === 0 ? 0 : maxIndex - 1);
                }
                handleClickOption(filterOptions[activeOptionIndex], true);
            }
            if (code === 38 || code === 40) {
                if (activeOptionIndex === null) {
                    setActiveOptionIndex(0);
                } else {
                    const lastIndex = filterOptions.length - 1
                    if (code === 38) {
                        setActiveIndex(activeOptionIndex === 0 ? lastIndex : activeOptionIndex - 1)
                    } else {
                        setActiveIndex(activeOptionIndex === lastIndex ? 0 : activeOptionIndex + 1)
                    }
                }
            }
        }
    };

    const handleClickOption = (name, toAdd = true) => {
        if (toAdd) {
            setFirstTimeModification(false)
        }
        if (canSelectMulti) {
            let arr = selectedOptions;
            if (toAdd) {
                arr.push(name);
                setSearchVal('');
            } else {
                arr = arr.filter(nm => nm !== name);
            }
            setSelectedOptions(arr);
            setFilterOptions(allNames.filter(nm => !arr.includes(nm)));
        } else {
            setSelectedOptions(toAdd ? [name] : []);
            setFilterOptions(toAdd ? allNames.filter(nm => nm !== name) : allNames);
        }
        if (hideOptionsOnSelect) {
            setShowFilterOptions(false);
        }
    };

    const focusInput = () => {
        inputField?.current?.focus();
    };

    const handleClickTopBox = (ev) => {
        if (ev.target.className === 'showSelection up') {
            setShowFilterOptions(false);
        } else {
            focusInput();
            setShowFilterOptions(true);
        }
    }

    useEffect(() => {
        const handleOutsideClick = (ev) => {
            if (topBoxContainer.current && !topBoxContainer.current.parentElement.contains(ev.target)) {
                setSearchVal('');
                setFilterOptions(filterList.filter((nm) => !selectedOptions.includes(nm)));
                setShowFilterOptions(false);
            }
        };

        if (showFilterOptions) {
            const eventType = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
            document.addEventListener(eventType, handleOutsideClick);

            return () => document.removeEventListener(eventType, handleOutsideClick);
        }
    }, [showFilterOptions]);



    useEffect(() => {
        const topBox = topBoxContainer?.current;
        if (topBox) {
            const height = topBox.clientHeight;
            topBox.lastElementChild.style.top = height + 4 + 'px';
        }
        const resultObj = {}
        resultObj[resultName] = selectedOptions
        if (!firstTimeModification) {
            onFilterChange(resultObj);
        }
    }, [JSON.stringify(selectedOptions)]);

    useEffect(() => {
        if (showFilterOptions) {
            focusInput();
        }
    }, [showFilterOptions]);

    return (
        <div className="customSelectContainer">
            <span ref={detectInputWidthSpan} className="detectInputWidthSpan">
                {searchVal}
            </span>
            <div
                ref={topBoxContainer}
                id={uniqueId}
                className="topBox"
                onClick={handleClickTopBox}
            >
                <div className="selectedOptions">
                    {selectedOptions.length === 0 ? (
                        searchVal.length === 0 && <h5 className="nameOfSelect">{nameOfSelect}</h5>
                    ) : (
                        selectedOptions.map((selectedOption, index) => (
                            <div className="selectedOption" key={index}>
                                <span className="selectedText">{selectedOption}</span>
                                {canSelectMulti &&
                                    <button
                                        className="removeSelectedOption"
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            handleClickOption(selectedOption, false);
                                        }}
                                    >
                                        X
                                    </button>
                                }
                            </div>
                        ))
                    )}
                    <div style={{ width: caretPos }} ref={inputFieldContainer} className="searchFilterContainer">
                        <input
                            ref={inputField}
                            type="text"
                            value={searchVal}
                            onChange={searchFilterOptions}
                            onFocus={handleCursor}
                            onBlur={hideCaret}
                            onKeyDown={handleKeyDownFilterOption}
                            className={(searchOption ? '' : 'opacity-none ') + 'searchFilter'}
                            style={{ width: caretPos }}
                        />
                        {searchOption && showCaret && <div style={{ left: caretPos }} className="customCaret"></div>}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setSelectedOptions([]);
                    }}
                    className={'removeAllSelection' + (selectedOptions.length === 0 ? ' none' : '')}
                >
                    X
                </button>
                <div className="showSelectionBox">
                    <button
                        onClick={() => {
                            setShowFilterOptions(!showFilterOptions);
                        }}
                        className={'showSelection ' + (showFilterOptions ? 'up' : 'down')}
                    >
                        {showFilterOptions ? '<' : '>'}
                    </button>
                </div>
            </div>
            {showFilterOptions && (
                <div
                    className="select"
                    ref={selectContainer}
                    style={{
                        top: topBoxContainer?.current.getBoundingClientRect().top + topBoxContainer?.current.getBoundingClientRect().height + 4,
                        width: topBoxContainer?.current.clientWidth
                    }}
                >
                    {filterOptions.length === 0 ? (
                        <div className="option noResult">{searchOption ? 'Not Found' : 'Selected all options'}</div>
                    ) : (
                        filterOptions.map((option, index) => (
                            <button
                                style={{ height: optionHeightPx }}
                                key={index}
                                onClick={() => {
                                    handleClickOption(option);
                                }}
                                onMouseOver={() => {
                                    setActiveIndex(index);
                                }}
                                className={index === activeOptionIndex ? 'option active' : 'option'}
                            >{option}</button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
