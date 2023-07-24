import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';
import './style.css'


export default function Header() {
    const [showNavLinks, setShowNavLinks] = useState(false)
    const [hideHeader, setHideHeader] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [scrollingUpStartPosition, setScrollingUpPosition] = useState(0)


    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (scrollPosition > 500) {
            if (scrollPosition > prevScrollPosition) {
                setHideHeader(true)
            }
            else if (scrollingUpStartPosition > 100) {
                setHideHeader(false)
                setScrollingUpPosition(0)
            } else if (scrollPosition < prevScrollPosition) {
                setScrollingUpPosition(scrollingUpStartPosition + (prevScrollPosition - scrollPosition))
            }
        } else {
            setHideHeader(false)
        }
        setPrevScrollPosition(scrollPosition);
    }, [scrollPosition, prevScrollPosition, scrollingUpStartPosition]);

    const hideMenu = () => {
        setShowNavLinks(false)
    }

    return (
        <header className={'header ' + (hideHeader ? 'hide' : '')}>
            <nav className="nav">
                <div className=" logoBox flex-center" >
                    <NavLink to={'/'} className='logo text-white font-mono'>Movbixer</NavLink>
                </div>
                <ul className={'nav-items ' + (showNavLinks ? '' : 'top')}>
                    <li onClick={hideMenu}>
                        <NavLink
                            to={"/"}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Home</NavLink>
                    </li>
                    <li onClick={hideMenu}>
                        <NavLink
                            to={"/discover/movie"}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Movies</NavLink>
                    </li>
                    <li onClick={hideMenu}>
                        <NavLink
                            to={"/discover/tv"}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} >
                            TV</NavLink>
                    </li>
                    {showNavLinks &&
                        <>
                            <SearchBox
                                className="inNav"
                                isInHeader={true}
                                hideMenu={hideMenu} />
                            <i onClick={() => {
                                setShowNavLinks(showNavLinks ? false : true)
                            }} className="bi bi-x"></i>
                        </>}
                </ul>
                <SearchBox
                    className="searchBox"
                    isInHeader={true}
                />
                <div className="flex center iconBox">
                    <i onClick={() => {
                        setShowNavLinks(showNavLinks ? false : true)
                    }} className={"menuBar text-white relative bi bi-list"}></i>
                </div>
            </nav>
        </header >
    )
}
