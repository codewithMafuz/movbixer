import React, { useEffect, useRef, useState } from 'react'
import './Style.css'

export default function TabsSwitch({ className = '', classNameSelectedTab = '', activeClass = '', tabNames, onTabChange, dropboxType = false, hideIndex = false }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [showDropList, setShowDropList] = useState(!dropboxType)
    const [expectedCurrent, setExpectedCurrent] = useState(0)

    const tabBox = useRef()

    useEffect(() => {
        if (dropboxType && tabBox.current) {
            tabBox.current.parentElement.style.position = 'relative'
        }
    }, [tabBox])

    if (dropboxType) {
        className = className + ' tabBox dropbox'
        classNameSelectedTab = classNameSelectedTab + ' tab dropbox'
        activeClass = activeClass + ' active dropbox'
    }

    const goUp = () => {
        if (expectedCurrent > 0) {
            const to = expectedCurrent - 36
            tabBox.current.scrollTo(0, to)
            setExpectedCurrent(to)
        }
    }
    const goDown = () => {
        if (tabBox?.current && expectedCurrent < (tabNames.length - 8) * 36) {
            const to = expectedCurrent + 36
            tabBox.current.scrollTo(0, to)
            setExpectedCurrent(to)
        }
    }

    return (
        <>
            {dropboxType &&
                <div style={{ left: '-12px', top: '2px' }} className="dropListToggle" onClick={() => {
                    setShowDropList(!showDropList)
                }}>
                    {showDropList ?
                        <i className="bi bi-caret-up"></i>
                        :
                        <i className="bi bi-caret-down"></i>
                    }
                </div>}
            <div style={{ height: dropboxType ? '288px' : 'auto', zIndex: 100000000000 }} className={`${showDropList ? '' : 'none '}${className}`} ref={tabBox}>
                {showDropList && tabNames.map((tabName, tabIndex) => {
                    return (
                        <button
                            key={tabIndex}
                            onClick={() => {
                                if (dropboxType || (tabIndex !== activeIndex && !dropboxType)) {
                                    setShowDropList(!dropboxType)
                                    setActiveIndex(tabIndex)
                                    onTabChange(tabIndex)
                                }
                            }}
                            className={classNameSelectedTab + (tabIndex === (hideIndex ? hideIndex : activeIndex) ? ' ' + activeClass : '')}
                        >{tabName}
                        </button>
                    )
                }
                )}
            </div>
            {dropboxType && showDropList &&
                <div className='dropboxControllScroll'>
                    <div onClick={goUp} className="cursor-pointer up controllIcon bi-arrow-up"></div>
                    <div onClick={goDown} className="cursor-pointer down controllIcon bi-arrow-down"></div>
                </div>
            }
        </>
    )

}