import React, { createContext, useContext, useState } from 'react'
import BookingRooms from '../components/BookingRooms';
const RoomContext = createContext({});
export function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}
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