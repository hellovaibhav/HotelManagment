import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SideNavbar from "./components/SideNavbar";
import { createContext, useState } from "react";
import Bookings from "./pages/Bookings";
import Search from "./components/Search";
import NewRoomBook from "./pages/NewRoomBook";
import SearchBookings from "./components/SearchBookings";
import EditBookedRoom from "./pages/EditBookedRoom";
export const ToggleSideNavbarContext = createContext({});
export const RoomContext = createContext({});
export const RoomsDataContext = createContext({});
export const BookedRoomsDataContext = createContext({});


const App = () => {
    const [roomsData, setRoomsData] = useState([])
    const [bookedRoomsData, setBookedRoomsData] = useState([])
    const [sideNavToggle, setSideNavToggle] = useState(false);
    const [room, setRoom] = useState('');
    return (
        <BookedRoomsDataContext.Provider value={{ bookedRoomsData, setBookedRoomsData }}>

            <ToggleSideNavbarContext.Provider value={{ sideNavToggle, setSideNavToggle }}>
                <RoomContext.Provider value={{ room, setRoom }} >
                    <RoomsDataContext.Provider value={{ roomsData, setRoomsData }}>
                        <div className="mx-auto w-auto md:px-[10%] flex bg-white">
                            <SideNavbar />
                            <Routes>
                                <Route element={<Search />} path="/" >
                                    <Route path="/" element={<Home />} />
                                    <Route path="/newBook/:id" element={<NewRoomBook />} />
                                </Route>
                                <Route element={<SearchBookings />} path="/bookings">
                                    <Route path="" element={<Bookings />} />
                                    <Route path="editBooking/:id" element={<EditBookedRoom />} />

                                </Route>
                                {/* <Route element={<Bookings />} path="/booking" /> */}
                                <Route path="/new/:id" element={<NewRoomBook />} />
                            </Routes>
                        </div>
                    </RoomsDataContext.Provider>
                </RoomContext.Provider>
            </ToggleSideNavbarContext.Provider>
        </BookedRoomsDataContext.Provider>
    )
}

export default App;