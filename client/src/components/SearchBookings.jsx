import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { BookedRoomsDataContext } from '../App'
import { ToggleNav } from './SideNavbar'

const SearchBookings = () => {
    let { setBookedRoomsData } = useContext(BookedRoomsDataContext)
    const [data, setData] = useState({
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data: { data: da } } = await axios.post('https://hotelmanagment.onrender.com/api/v1/bookings', data);
        if (da) {
            setBookedRoomsData(da)
        }
        console.log(da);
    }
    return (
        <div className='flex gap-8 bg flex-col w-full'>
            <ToggleNav />

            <div className='flex gap-4 justify-around items-center'>
                <div className='flex flex-col gap-4'>

                    <label className='flex gap-4 text-white items-center'>Start Date

                        <input type="date" className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, startDate: e.target.value.split('-').reverse().join('/') })} />
                    </label>
                    <label className='flex gap-4 text-white items-center'>End Date

                        <input type="date" className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, endDate: e.target.value.split('-').reverse().join('/') })} />
                    </label>
                </div>
                <div className='flex flex-col gap-4'>

                    <label className='flex gap-4 text-white items-center'>Start Time

                        <input type="time" className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, startTime: e.target.value })} />
                    </label>
                    <label className='flex gap-4 text-white items-center'>End Time

                        <input type="time" className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, endTime: e.target.value })} />
                    </label>
                </div>
            </div>
            <div className='mx-auto md:w-[10%] px-4 p-2 text-center rounded-md cursor-pointer bg-green-400 text-white' onClick={handleSubmit}>Search</div>
            <Outlet />
        </div>
    )
}

export default SearchBookings