import React, { useContext } from 'react'
import { RoomsDataContext } from '../App'
import { Link } from 'react-router-dom'

const RoomBookResults = () => {
    let { roomsData: rooms } = useContext(RoomsDataContext)

    return (
        <div className=' sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid gap-6 p-10'>
            {
                rooms.map((room) => (
                    <Link to={`/newBook/${room._id}`} key={room._id} className={`${room.roomType === "Delux" ? "bg-[#00A9FF]" : room.roomType === "AC" ? "bg-[#88AB8E]" : "bg-[#BEADFA]"} text-white p-4 rounded-md cursor-pointer`} onClick={() => setRoom(room._id)}>
                        <p>Room No. :
                            <span>
                                {room.roomNumber}
                            </span>
                        </p>
                        <p>Room Type :
                            <span>
                                {room.roomType}
                            </span>
                        </p>
                        <p>Price. :
                            <span>
                                {room.price}
                            </span>
                        </p>
                    </Link>
                ))
            }
        </div>
    )
}

export default RoomBookResults