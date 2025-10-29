import React from "react";
import { Row, Col } from "antd";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };
  return (
    <div className="w-full">
      <div className="w-full max-w-md mx-auto border-2 text-lg lg:text-xl font-bold border-blue-500 rounded-lg p-4 lg:p-6">
        <h2 className="text-center text-lg lg:text-xl font-bold text-gray-800 mb-4">
          Select Your Seats
        </h2>
        
        {/* Seat Legend */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-400 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 border border-blue-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 border border-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
        
        <Row gutter={[8, 8]}>
          {Array.from(Array(capacity).keys()).map((seat, key) => {
            let seatClass = `btn btn-circle btn-outline bg-white cursor-pointer hover:bg-blue-600 transition-colors duration-200`;
            selectedSeats.includes(seat + 1);
            if (selectedSeats.includes(seat + 1)) {
              seatClass = `btn btn-circle btn-outline bg-blue-500 cursor-pointer text-white`;
            } else if (bus.seatsBooked.includes(seat + 1)) {
              seatClass = `btn btn-circle btn-outline bg-red-500 pointer-events-none cursor-not-allowed text-white`;
            }

            return (
              <Col key={key} xs={6} sm={4} md={3} lg={6}>
                <div className="flex justify-center items-center">
                  <div
                    className={`border-[1px] text-black p-2 lg:p-3 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-xs lg:text-sm font-bold rounded-full ${seatClass}`}
                    onClick={() => {
                      selectOrUnselectSeat(seat + 1);
                    }}
                  >
                    {seat + 1}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        
        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm lg:text-base font-medium text-blue-800">
              Selected Seats: {selectedSeats.join(", ")}
            </p>
            <p className="text-sm lg:text-base font-bold text-blue-900">
              Total: {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatSelection;
