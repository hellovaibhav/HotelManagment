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
    const calculateTotalPrice = () => {
        const { price, startDate, startTime, endDate, endTime } = data;
        const [startDay, startMonth, startYear] = startDate.split('/');
        const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}T${startTime}`);

        const [endDay, endMonth, endYear] = endDate.split('/');
        const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}T${endTime}`);

        // Round start time down to the nearest hour
        startDateObj.setMinutes(0, 0, 0);

        // Round end time up to the nearest hour
        endDateObj.setMinutes(0, 0, 0);

        // Calculate total whole hours for user input
        const totalWholeHoursUser = Math.floor((endDateObj - startDateObj) / (60 * 60 * 1000));

        // Multiply total whole hours with the price
        const totalPrice = totalWholeHoursUser * price;

        setMoney(totalPrice); // Assuming you have a state variable 'money' to store the total price
        return totalPrice;
    };

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
    const [money, setMoney] = useState(0);
    const navigate = useNavigate()
    return (
        <div className='py-10 px-4 bg-white text-black'>
            {/* <i onClick={() => navigate(-1)} className="fi fi-rr-arrow-small-left text-3xl cursor-pointer bg-white text-black mb-10 p-2 px-6 rounded-md items-center justify-center inline-flex"></i> */}
            {
                response === null ? <>
                    <p className='text-3xl tracking-widest text-black ml-10 mb-5 underline underline-offset-8'>
                        Enter Details
                    </p>
                    <div className='flex flex-col justify-around gap-4 px-10 py-4'>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Guest Name
                            </label>
                            <input type="text" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, guestName: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Guest Mail
                            </label>
                            <input type="email" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, guestEmail: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Start Time
                            </label>
                            <input type="time" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, startTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                End Time
                            </label>
                            <input type="time" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, endTime: e.target.value })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Start Date
                            </label>
                            <input type="date" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, startDate: (e.target.value).split('-').reverse().join('/') })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                End Date
                            </label>
                            <input type="date" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, endDate: (e.target.value).split('-').reverse().join('/') })} />
                        </div>
                        <div className='flex text-xl gap-4 w-auto'>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Price per hour
                            </label>
                            <input type="number" className='px-4 w-full md:w-[30%] rounded-md p-2 bg-darkSecondary/60 text-darkPrimary' onChange={(e) => setdata({ ...data, price: e.target.value })} value={data.price} disabled={true} />
                        </div>
                        <div>
                            <button onClick={() => calculateTotalPrice()} className='bg-green-400 text-white mx-2 rounded-md p-2'>
                                Calculate
                            </button>
                            <label className='text-xl font-extralight w-[30%] md:w-[15%]'>
                                Total price :
                            </label>
                            <p className='underline inline'>

                                {
                                    money
                                }
                            </p>

                        </div>
                        <div className='bg-green-400 p-2 w-[10%] text-center text-white rounded-md' onClick={handleRoomBook}>Book</div>
                    </div>
                </> : <div className='block text-white bg-green-400 text-center rounded-md p-2 text-xl'>
                    Room Booked
                </div>
            }
        </div>
    )
}

export default NewRoomBook