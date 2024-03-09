import React, { createContext, useContext, useState } from 'react'
import { ToggleNav } from '../components/SideNavbar'
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import RoomBookResults from '../components/RoomBookResults';
export const RoomContext = createContext({});
const Home = () => {
    const [room, setRoom] = useState('');

    return (


        <RoomContext.Provider value={{ room, setRoom }}>
            <>

                <div className='bg-white w-full min-h-screen'>
                    <RoomBookResults />
                    {/* <InputFields /> */}
                    {/* {
                            room === '' ?
                                <RoomResults /> :
                                <SelectedRoom />
                        } */}

                </div>
            </>
        </RoomContext.Provider>

    )
}

export default Home