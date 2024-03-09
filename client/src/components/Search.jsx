import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { RoomsDataContext } from '../App'
import { ToggleNav } from './SideNavbar'

const Search = () => {
    let { setRoomsData } = useContext(RoomsDataContext)
    const [data, setData] = useState({
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        const { data: { availableRooms } } = await axios.post('https://hotelmanagment.onrender.com/api/v1/rooms/findRooms', data);
        if (availableRooms) {
            setRoomsData(availableRooms)
        }
        console.log(availableRooms);
    }
    return (
        <div className='flex flex-col w-full '>

            <div className='flex gap-8 py-4 sticky top-0 flex-col w-full bg'>
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
            </div>
            <Outlet />
        </div>

    )
}

export default Search