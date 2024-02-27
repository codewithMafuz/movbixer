import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';
import './style.css'
import { useSelector } from 'react-redux';


export default function Header() {
    const [showNavLinks, setShowNavLinks] = useState(false)
    const [hideHeader, setHideHeader] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [prevScrollPosition, setPrevScrollPosition] = useState(0);
    const [scrollingUpStartPosition, setScrollingUpPosition] = useState(0)
    const [canShowGoUpBtn, setCanShowGoUpBtn] = useState(false)
    const [prevScrollYToJump, setPrevScrollYToJump] = useState(0)
    const showGoUpBtn = useSelector(state => state.search.showGoUpBtn)

    const handleScroll = () => {
        setScrollPosition(window.scrollY);
    };
    const handleClickGoUpOrDown = () => {
        if (canShowGoUpBtn) {
            setPrevScrollYToJump(scrollPosition)
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        } else {
            const scrollHeight = document.documentElement.scrollHeight;
            const offset = parseInt(window.innerHeight * 4)
            const targetScrollY = scrollHeight - offset;
            window.scrollTo({
                top: prevScrollYToJump < targetScrollY ? prevScrollYToJump : targetScrollY,
                left: 0,
                behavior: 'smooth',
            });
        }
    }

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
        setCanShowGoUpBtn(scrollPosition > 2000 ? true : false)
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
                </ul>
                <SearchBox
                    hideMenu={hideMenu}
                    className="searchBox"
                />
                <div className="flex center iconBox">
                    <i onClick={() => {
                        setShowNavLinks(showNavLinks ? false : true)
                    }} className={"menuBar text-white relative bi bi-list"}></i>
                </div>
            </nav>
            {showGoUpBtn &&
                <>
                    {canShowGoUpBtn ?
                        < i onClick={handleClickGoUpOrDown} className="goUpBtn bi bi-arrow-up"></i>
                        :
                        < i onClick={handleClickGoUpOrDown} className="goUpBtn bi bi-arrow-down"></i>}
                </>
            }
        </header >
    )
}
