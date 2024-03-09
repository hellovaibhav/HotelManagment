import React, { useContext } from 'react'
import { BookedRoomsDataContext } from '../App'
import { Link } from 'react-router-dom';

const BookingRooms = () => {
    let { bookedRoomsData: rooms } = useContext(BookedRoomsDataContext);
    console.log(rooms.length)
    return (
        <div className=' sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid gap-6 p-10'>
            {
                rooms.length !== 0 ?
                    rooms.map((room) => (
                        <Link to={`/bookings/editBooking/${room._id}`} key={room._id} className={`bg-lightPrimary text-black flex gap-4 items-center justify-center p-4 rounded-md cursor-pointer`} onClick={() => setRoom(room.RoomNumber)}>
                            <div>
                                <p>
                                    Guest Name: <span>{room.guestName}</span>
                                </p>
                                <p>
                                    Room No: <span>{room.roomNumber}</span>
                                </p>
                                <p>
                                    Date: <span>{new Date(room.startDateTime).toLocaleDateString()}</span> to <span>{new Date(room.endDateTime).toLocaleDateString()}</span>
                                </p>
                                <p>
                                    Start Time: <span>{new Date(room.startDateTime).toLocaleTimeString()}</span>
                                </p>
                                <p>
                                    End Time: <span>{new Date(room.endDateTime).toLocaleTimeString()}</span>
                                </p>
                                <p>
                                    Amount : <span>{room.amountRecived}</span>
                                </p>
                            </div>
                            <button className={`rounded-md text-white font-thin p-1 px-2 ${room.status === 'Cancelled' ? "bg-rose-500" : room.status === 'Booked' ? "bg-green-500" : "bg-yellow-500"}`}>
                                {
                                    room.status
                                }
                            </button>
                        </Link>
                    )) : <div className='text-black text-xl'>
                        Search Rooms based on Above filters
                    </div>
            }
        </div>
    )
}


export default BookingRooms