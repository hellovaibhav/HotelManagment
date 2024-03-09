import React, { useContext, useEffect, useState } from 'react'
import { RoomContext } from './Home'
import { useLocation } from 'react-router-dom';

const EditBookedRoom = () => {
    let { room, setRoom } = useContext(RoomContext);
    const location = useLocation();
    const id = location.pathname.split('/')[3];
    const [data, setdata] = useState({
        "_id": "",
        "guestName": "",
        "guestEmail": "",
        "roomId": "",
        "roomNumber": 0,
        "startDateTime": "",
        "endDateTime": "",
    })
    useEffect(async () => {
        const res = await axios.post(`https://hotelmanagment.onrender.com/api/v1/bookings/details/${id}`);
        setdata(res.data.data);


    }, [])

    console.log(console.log(data))
    const handleRoomBook = async (e) => {
        e.preventDefault();
        setResponse(res.data.message)
        console.log(res.data)
    }

    return (
        <div className='py-10 px-4 text-white'>
            <i onClick={() => setRoom('')} className="fi fi-rr-arrow-small-left text-3xl cursor-pointer bg-white text-black mb-10 p-2 px-6 rounded-md items-center justify-center inline-flex"></i>
            <p className='text-3xl tracking-widest text-white ml-10 mb-5 underline underline-offset-8'>
                Enter Details
            </p>
            <div className='flex flex-col justify-around gap-4 px-10 py-4'>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        Guest Name
                    </label>
                    <input type="text" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        Guest Mail
                    </label>
                    <input type="email" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        Start Time
                    </label>
                    <input type="time" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        End Time
                    </label>
                    <input type="time" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        Start Date
                    </label>
                    <input type="date" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        End Date
                    </label>
                    <input type="date" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex text-xl gap-4 w-auto'>
                    <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                        Price
                    </label>
                    <input type="number" className='px-4 rounded-md p-1 text-black' />
                </div>
                <div className='flex gap-4'>

                    <div className='bg-green-400 p-2 md:w-[15%] w-1/2 text-center'>Book</div>
                    <div className='bg-rose-400 p-2 md:w-[15%] w-1/2 text-center'>Cancel</div>
                </div>
            </div>
        </div>
    )
}



export default EditBookedRoom