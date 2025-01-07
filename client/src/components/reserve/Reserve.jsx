import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  // Get the dates in the range selected by the user
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  // Check if the room is available for the selected dates
  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  // Handle room selection or deselection
  const handleSelect = (e) => {
    const checked = e.target.checked;
    const roomId = e.target.value;

    // Find the room type and use the base price from the main room type
    const roomType = data.find((item) =>
      item.roomNumbers.some((room) => room._id === roomId)
    );

    if (roomType) {
      const basePrice = roomType.price; // Use the base price for the room type
      if (checked) {
        setSelectedRooms((prev) => [...prev, { roomId, price: basePrice }]);
      } else {
        setSelectedRooms((prev) =>
          prev.filter((room) => room.roomId !== roomId)
        );
      }
    }
  };

  const calculateTotalPrice = () => {
    return (
      selectedRooms.reduce((total, room) => {
        const roomPrice = parseFloat(room.price);
        if (!isNaN(roomPrice)) {
          return total + roomPrice;
        }
        return total;
      }, 0) * alldates.length
    ); // Multiply by the number of days selected
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((room) => {
          const res = axios.put(`/rooms/availability/${room.roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span className="s1">Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">$ {item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Display Total Price */}
        <div className="totalPrice">
          <span>Total Price: </span>
          <span className="totalAmount">$ {calculateTotalPrice()} </span>
        </div>

        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
