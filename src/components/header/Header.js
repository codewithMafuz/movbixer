import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SearchBox from './SearchBox';

export const getCategroyOfScreen = () => {
    const widt = window.outerWidth
    return widt <= 600 ? 'mobile' : widt > 600 && widt < 1000 ? 'tab' : 'desktop'
}

export default function Header() {
    const [screenCatg, setScreenCatg] = useState(getCategroyOfScreen())
    window.addEventListener('resize', () => {
        setScreenCatg(getCategroyOfScreen())
    })

    return (
        <header>
            <nav className="bg-gray-950 py-2">
                <div className="flex items-center justify-between px-4 w-full font-arial">
                    <div className="flex items-center justify-between w-1/2 gap-10 h-full">
                        <div className="flex align-items-center justify-center logoBox font-mono h-full">
                            <span className='logo text-white h-full text-3xl'>Movbixer</span>
                        </div>
                        <ul className="flex items-center h-full w-full justify-left gap-10 text-lg text-center pl-20">
                            <li><NavLink
                                to={"/"}
                                className={({ isActive }) => isActive ? 'text-sky-200' : 'text-white'}>Home</NavLink></li>
                            <li><NavLink
                                to={"/movie"}
                                className={({ isActive }) => isActive ? 'text-sky-200' : 'text-white'}>Movies</NavLink></li>
                            <li><NavLink
                                to={"/tv"}
                                className={({ isActive }) => isActive ? 'text-sky-200' : 'text-white'} >TV</NavLink></li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-between w-1/2 pl-40">
                        <SearchBox
                            screenCatg={screenCatg}
                            classNames={"searchBox w-full"}
                            isInHeader={true}
                        />
                        {screenCatg === 'mobile' ?
                            <div className="flex items-center justify-center iconBox">
                                <i className="menuBar text-white relative bi bi-list"></i>
                            </div>
                            : ''}
                    </div>
                </div>
            </nav>
        </header>

    )
}
