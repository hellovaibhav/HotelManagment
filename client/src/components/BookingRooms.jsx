import React, { useContext } from 'react'
import { BookedRoomsDataContext } from '../App'
import { Link } from 'react-router-dom';

const BookingRooms = () => {
    let { bookedRoomsData: rooms } = useContext(BookedRoomsDataContext);
    return (
        <div className=' sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid gap-6 p-10'>
            {
                rooms.map((room) => (
                    <Link to={`/bookings/editBooking/${room._id}`} key={room._id} className='bg-white flex gap-4 items-center justify-center p-4 rounded-md cursor-pointer' onClick={() => setRoom(room.RoomNumber)}>
                        <div>

                            <p>Guest Name :
                                <span>
                                    {room.guestName}
                                </span>
                            </p>
                            <p>Room No :
                                <span>
                                    {room.roomNumber}
                                </span>
                            </p>
                            <p>start date :
                                <span>
                                    {room.startDate}
                                </span>
                                start date :
                                <span>
                                    {room.startTime}
                                </span>
                            </p>
                            <p>end date :
                                <span>
                                    {room.endDate}
                                </span>
                                end date :
                                <span>
                                    {room.endTime}
                                </span>
                            </p>
                        </div>
                        <button className={`rounded-md text-white font-thin p-1 px-2 ${room.BookingStatus === 'pending' ? "bg-yellow-300" : room.BookingStatus === 'booked' ? "bg-green-400" : "bg-blue"}`}>
                            {
                                room.status
                            }
                        </button>
                    </Link>
                ))
            }
        </div>
    )
}


export default BookingRooms