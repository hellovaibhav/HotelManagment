import React, { useContext, useEffect, useState } from 'react'
import { RoomContext } from './Home'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EditBookedRoom = () => {
    let { room, setRoom } = useContext(RoomContext);
    const location = useLocation();
    const id = location.pathname.split('/')[3];
    const [data, setdata] = useState({
        "_id": "",
        guestName: "",
        guestEmail: "",
        roomId: "",
        roomNumber: 0,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        startDateTime: "",
        endDateTime: "",
    })
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }


    // Function to format time in hh:mm format
    function formatTime(timeString) {
        const time = new Date(timeString);
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    // Update your state with formatted dates and times
    const [response, setResponse] = useState(null)
    const handleEdit = async () => {
        console.log(data)
        const { data: { message } } = await axios.patch(`https://hotelmanagment.onrender.com/api/v1/bookings/update/${id}`, { ...data, startDate: data.startDate.split('-').reverse().join('/'), endDate: data.endDate.split('-').reverse().join('/') });
        setResponse(message)
        console.log(response)

    }
    const handleCancel = async () => {
        // /bookings/cancel
        const { data: { message } } = await axios.patch(`https://hotelmanagment.onrender.com/api/v1/bookings/cancel/${id}`);
        setResponse(message)
        console.log(message)
    }
    const handleCheckOut = async () => {
        // /bookings/cancel
        const { data: { message } } = await axios.patch(`https://hotelmanagment.onrender.com/api/v1/bookings/checkout/${id}`);
        setResponse(message)
    }
    useEffect(() => {
        async function fetchData() {

            const { data: { data: apiResponse } } = await axios.get(`https://hotelmanagment.onrender.com/api/v1/bookings/details/${id}`);
            // console.log(apiResponse);

            setdata({
                "_id": apiResponse._id,
                guestName: apiResponse.guestName,
                guestEmail: apiResponse.guestEmail,
                roomId: apiResponse.roomId,
                roomNumber: apiResponse.roomNumber,
                startDate: formatDate(apiResponse.startDateTime),
                endDate: formatDate(apiResponse.endDateTime),
                startTime: formatTime(apiResponse.startDateTime),
                endTime: formatTime(apiResponse.endDateTime),
                startDateTime: apiResponse.startDateTime,
                endDateTime: apiResponse.endDateTime,
            });
        }
        fetchData();



    }, [])

    console.log(data)
    return (
        <div className='py-10 px-4 text-white'>
            {
                response === null ? <>
                    <p className='text-3xl tracking-widest text-black ml-10 mb-5 underline underline-offset-8'>
                        Enter Details
                    </p>
                    <div className='flex flex-col justify-around gap-4 text-black px-10 py-4'>
                        <div className='flex text-xl gap-4 w-auto  items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Guest Name
                            </label>
                            <input type="text" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.guestName} onChange={(e) => setdata({ ...data, guestName: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Guest Mail
                            </label>
                            <input type="email" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.guestEmail} onChange={(e) => setdata({ ...data, guestEmail: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Start Time
                            </label>
                            <input type="time" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.startTime} onChange={(e) => setdata({ ...data, startTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                End Time
                            </label>
                            <input type="time" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.endTime} onChange={(e) => setdata({ ...data, endTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                Start Date
                            </label>
                            <input type="date" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.startDate} onChange={(e) => setdata({ ...data, startDate: e.target.value })} />
                        </div>

                        <div className='flex text-xl gap-4 w-auto items-center'>
                            <label className='text-xl font-extralight w-[30%] md:w-[10%]'>
                                End Date
                            </label>
                            <input type="date" className='bg-darkSecondary/60 w-full md:w-[30%] px-4 rounded-md p-2 text-darkPrimary' value={data.endDate} onChange={(e) => setdata({ ...data, endDate: (e.target.value) })} />
                        </div>
                        <div className='flex gap-4'>

                            <div className='cursor-pointer bg-blue p-2 md:w-[15%] w-1/2 text-center rounded-md text-white' onClick={handleCheckOut}>CheckOut</div>
                            <div className='cursor-pointer bg-green-400 p-2 md:w-[15%] w-1/2 text-center rounded-md text-white' onClick={handleEdit}>Edit</div>
                            <div className='cursor-pointer bg-rose-400 p-2 md:w-[15%] w-1/2 text-center rounded-md text-white' onClick={handleCancel}>Cancel</div>
                        </div>
                    </div></> :
                    <>
                        <p className={`block ${response === "Booking cancelled successfully" ? "bg-rose-500" : "bg-green-500"} p-2 rounded-md`}>{response}</p>
                    </>
            }
        </div>
    )
}



export default EditBookedRoom