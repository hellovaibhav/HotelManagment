import React, { createContext, useContext, useState } from 'react'
import BookingRooms from '../components/BookingRooms';
const RoomContext = createContext({});

const Bookings = () => {
    const [room, setRoom] = useState('');
    return (
        <RoomContext.Provider value={{ room, setRoom }}>


            <div className='bg-white w-full min-h-screen'>
                <BookingRooms />
                {/* <InputFields /> */}
                {/* {
                    room === '' ?
                        <BookedRooms /> :
                        <SelectedRoom />
                } */}
            </div>
        </RoomContext.Provider>
    )
}

export default Bookings