import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NewRoomBook = () => {
    const location = useLocation();
    const id = location.pathname.split('/')[2];
    const [data, setdata] = useState({
        price: 0,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        guestName: "",
        guestEmail: ""
    })
    const priceR = async () => {
        const { data: { data: { price } } } = await axios.get(`https://hotelmanagment.onrender.com/api/v1/rooms/findRoom/${id}`);
        console.log(price)
        setdata({ ...data, price });
    }
    const [response, setResponse] = useState(null)
    const handleRoomBook = async (e) => {
        e.preventDefault();
        const res = await axios.post(`https://hotelmanagment.onrender.com/api/v1/rooms/bookRoom/${id}`, data);
        setResponse(res.data.message)
        console.log(res.data)
    }
    useEffect(() => {



        priceR();
    }, [])
    const navigate = useNavigate()
    return (
        <div className='py-10 px-4 bg text-white'>
            <i onClick={() => navigate(-1)} className="fi fi-rr-arrow-small-left text-3xl cursor-pointer bg-white text-black mb-10 p-2 px-6 rounded-md items-center justify-center inline-flex"></i>
            {
                response === null ? <>
                    <p className='text-3xl tracking-widest text-white ml-10 mb-5 underline underline-offset-8'>
                        Enter Details
                    </p>
                    <div className='flex flex-col justify-around gap-4 px-10 py-4'>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Guest Name
                            </label>
                            <input type="text" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, guestName: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Guest Mail
                            </label>
                            <input type="email" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, guestEmail: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Start Time
                            </label>
                            <input type="time" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, startTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                End Time
                            </label>
                            <input type="time" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, endTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Start Date
                            </label>
                            <input type="date" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, startDate: (e.target.value).split('-').reverse().join('/') })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                End Date
                            </label>
                            <input type="date" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, endDate: (e.target.value).split('-').reverse().join('/') })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Price
                            </label>
                            <input type="number" className='px-4 rounded-md p-1 text-black' onChange={(e) => setdata({ ...data, price: e.target.value })} value={data.price} />
                        </div>
                        <div className='bg-green-400 p-2 w-[10%] text-center' onClick={handleRoomBook}>Book</div>
                    </div>
                </> : <div className='block text-white bg-green-400 text-center rounded-md p-2 text-xl'>
                    Room Booked
                </div>
            }
        </div>
    )
}

export default NewRoomBook