import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { BookedRoomsDataContext } from '../App'
import { ToggleNav } from './SideNavbar'
import { getCurrentDate } from '../pages/Bookings'

const SearchBookings = () => {
    let { setBookedRoomsData } = useContext(BookedRoomsDataContext)
    const [data, setData] = useState({
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        type: '',
        text: '',
        status: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        const { data: { data: da } } = await axios.post(`https://hotelmanagment.onrender.com/api/v1/bookings/?roomNumber=${data.text}&roomType=${data.type}&status=${data.status}`, data);
        if (da) {
            setBookedRoomsData(da)
        }
        console.log(da);
    }
    return (<div className='flex w-full flex-col'>

        <div className='flex gap-8 bg flex-col w-full sticky top-0 py-4'>
            <ToggleNav />

            <div className='flex gap-4 justify-around items-center'>
                <div className='flex flex-col gap-4'>

                    <label className='flex gap-4 text-white items-center'>Start Date

                        <input type="date" min={getCurrentDate()} className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, startDate: e.target.value.split('-').reverse().join('/') })} />
                    </label>
                    <label className='flex gap-4 text-white items-center'>End Date

                        <input type="date" min={getCurrentDate()} className='text-black p-2 rounded-md tracking-widest' onChange={(e) => setData({ ...data, endDate: e.target.value.split('-').reverse().join('/') })} />
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
            <div className='flex items-center justify-center gap-10'>
                <select name="type" onChange={(e) => setData({ ...data, type: e.target.value })} className='p-2 rounded-md'>
                    <option value="">Select Type</option>
                    <option value="Delux">Delux</option>
                    <option value="Non-AC">Non-Ac</option>
                    <option value="AC">AC</option>
                </select>
                <select name="status" onChange={(e) => setData({ ...data, status: e.target.value })} className='p-2 rounded-md'>
                    <option value="">Select Status</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Booked">Booked</option>
                    <option value="Checked-Out">Checked Out</option>
                </select>
                <input type="text" placeholder='Search room number' onChange={(e) => setData({ ...data, text: e.target.value })} className='p-2 rounded-md' />
            </div>

            <div className='mx-auto md:w-[10%] px-4 p-2 text-center rounded-md cursor-pointer bg-green-400 text-white' onClick={handleSubmit}>Search</div>
        </div>
        <Outlet />
    </div>
    )
}

export default SearchBookings