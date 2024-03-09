import React, { useContext } from 'react'
import { ToggleSideNavbarContext } from '../App'
import { Link, useLocation } from 'react-router-dom'

const SideNavbar = () => {
    const { pathname } = useLocation();
    let { sideNavToggle, setSideNavToggle } = useContext(ToggleSideNavbarContext)
    return (
        <div className={`w-full ${sideNavToggle === false ? " max-md:-translate-y-[50rem]" : "  max-md:translate-y-0"} md:w-[30%] backdrop-blur-md bg-lightPrimary p-2 transition-all  duration-[2s] absolute md:sticky left-0 top-0 h-[60vh] md:h-screen`}>
            <button className=' md:hidden w-full flex justify-end ' onClick={() => setSideNavToggle(!sideNavToggle)}>
                <i className="fi fi-rs-circle-xmark text-3xl text-darkSecondary"></i>
            </button>

            <div className='flex flex-col justify-center items-end gap-4 text-2xl h-full text-grey'>
                <Link to={'/'} onClick={() => setSideNavToggle(!sideNavToggle)} className={`btn ${pathname === '/' ? "bg-lightSecondary text-white" : ""}`}>Find Rooms</Link>
                <Link to={'/bookings'} onClick={() => setSideNavToggle(!sideNavToggle)} className={`btn ${pathname === '/booking' ? "bg-lightSecondary text-white" : ""}`}>Bookings</Link>
            </div>
        </div>
    )
}
export const ToggleNav = () => {
    let { sideNavToggle, setSideNavToggle } = useContext(ToggleSideNavbarContext)
    return (
        <div className='flex justify-end p-4 max-md:cursor-pointer' onClick={() => setSideNavToggle(!sideNavToggle)}>
            <i className=" flefi fi-rr-apps text-3xl text-darkSecondary md:hidden"></i>

        </div>
    )
}

export default SideNavbar