import React, { useState, useRef, useEffect } from 'react';
import './Style.css';
import { findClosestMatches } from '../../App';

export default function CustomSelect({
    uniqueId,
    classNamesExtras = {
        'customSelectContainer': 'willAddToTheFirst',
    },
    justSearch = false,
    nameOfSelect = 'Select',
    filterList = [],
    canSelectMulti = true,
    hideOptionsOnSelect = false,
    searchOption = true,
    onFilterChange = null,
    optionHeightPx = 28,
}) {
    if (!filterList) {
        filterList = [];
    }

    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const allNames = filterList;
    const [filterOptions, setFilterOptions] = useState(allNames);
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
        handleCursor();
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
            setFilterOptions(allNames);
        } else {
            const queryResults = findClosestMatches(query, allNames);
            setFilterOptions(queryResults);
        }
        setActiveOptionIndex(filterOptions.length === 0 ? null : 0);
    };

    const handleKeyDownFilterOption = (ev) => {
        handleCursor();
        if (filterOptions.length !== 0) {
            const setActiveIndex = (nth) => {
                const child = selectContainer?.current?.children[nth];
                if (child) {
                    child.focus();
                    setActiveOptionIndex(nth);
                }
            };
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
                    if (maxIndex > 0) {
                        if (code === 38) {
                            const nth = activeOptionIndex === 0 ? maxIndex : activeOptionIndex - 1;
                            setActiveIndex(nth);
                        } else {
                            const nth = activeOptionIndex === maxIndex ? 0 : activeOptionIndex + 1;
                            setActiveIndex(nth);
                        }
                    }
                    inputField.current.focus();
                }
            }
        }
    };

    const handleClickOption = (name, toAdd = true) => {
        if (canSelectMulti) {
            let arr = selectedOptions;
            if (toAdd) {
                arr.push(name);
                setSearchVal('');
            } else {
                arr = arr.filter((nm) => nm !== name);
            }
            setSelectedOptions(arr);
            setFilterOptions(allNames.filter((nm) => !arr.includes(nm)));
        } else {
            setSelectedOptions(toAdd ? [name] : []);
            setFilterOptions(toAdd ? allNames.filter((nm) => nm !== name) : allNames);
        }
        if (hideOptionsOnSelect) {
            setShowFilterOptions(false);
        }
    };

    const focusInput = () => {
        inputField?.current?.focus();
    };

    const checkParentUntilTopBox = (element) => {
        let parentElement = element.parentElement;
        let count = 0
        while (parentElement) {
            if (count > 10) {
                return false
            }
            count++
            if (parentElement.className.includes('topBox')) {
                return parentElement.id
            }
            parentElement = parentElement.parentElement;
        }
    };

    const handleClickTopBox = (ev) => {
        if (ev.target.className === 'showSelection up') {
            setShowFilterOptions(false);
        } else {
            focusInput();
            setShowFilterOptions(true);
        }
    }

    const onBlurTopBox = () => {
        console.log('blurred topbox');
    }

    useEffect(() => {
        const topBox = topBoxContainer?.current;
        if (topBox) {
            const height = topBox.clientHeight;
            topBox.lastElementChild.style.top = height + 4 + 'px';
        }
        onFilterChange(selectedOptions);
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
                                        onClick={() => {
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
                        {showCaret && <div style={{ left: caretPos }} className="customCaret"></div>}
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
                {showFilterOptions && (
                    <div
                        className="select"
                        ref={selectContainer}
                        style={{
                            top: topBoxContainer?.current.clientHeight + 2 + 'px',
                        }}
                    >
                        {filterOptions.length === 0 ? (
                            <div className="option noResult">{searchOption ? 'Not Found' : 'Selected all options'}</div>
                        ) : (
                            filterOptions.map((option, index) => (
                                !selectedOptions.includes(option) && (
                                    <button
                                        style={{ height: optionHeightPx + 'px' }}
                                        key={index}
                                        onClick={() => {
                                            handleClickOption(option);
                                        }}
                                        onMouseOver={() => {
                                            setActiveOptionIndex(index);
                                        }}
                                        className={index === activeOptionIndex ? 'option active' : 'option'}
                                    >
                                        {option}
                                    </button>
                                )
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
