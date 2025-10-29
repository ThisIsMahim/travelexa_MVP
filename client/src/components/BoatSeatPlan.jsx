import React, { useState, useEffect } from 'react';
import { Card, Button, message, Modal, Row, Col, Typography, Divider } from 'antd';
import { UserOutlined, EyeOutlined, ClockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const BoatSeatPlan = ({ onSeatSelection, boatData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Boat seat configuration - 33 seats in a realistic boat layout
  const boatLayout = {
  totalSeats: 33,
    capacity: boatData?.capacity || 33,
  seatsPerRow: 4,
    totalRows: 9,
  seatLayout: [
      // Front section (Bow) - 2 rows
      [1, 2, 3, 4],    // Row 1
      [5, 6, 7, 8],    // Row 2
      // Middle section - 5 rows
      [9, 10, 11, 12], // Row 3
      [13, 14, 15, 16], // Row 4
      [17, 18, 19, 20], // Row 5
      [21, 22, 23, 24], // Row 6
      [25, 26, 27, 28], // Row 7
      // Rear section (Stern) - 2 rows
      [29, 30, 31, 32], // Row 8
      [33]              // Row 9 - Single seat
    ]
  };

  // Get booked seats from boat data
  const bookedSeats = boatData?.seatsBooked || [];

  const handleSeatClick = (seatNumber) => {
    const isBooked = bookedSeats.includes(seatNumber);
    if (isBooked) {
      message.warning('This seat is already booked');
      return;
    }

    const isSelected = selectedSeats.includes(seatNumber);
    
    if (isSelected) {
      // Remove from selection
      const updatedSeats = selectedSeats.filter(seat => seat !== seatNumber);
      setSelectedSeats(updatedSeats);
      onSeatSelection(updatedSeats);
      message.success(`Seat ${seatNumber} removed from selection`);
    } else {
      // Add to selection
      const updatedSeats = [...selectedSeats, seatNumber];
      setSelectedSeats(updatedSeats);
      onSeatSelection(updatedSeats);
      message.success(`Seat ${seatNumber} added to selection`);
    }
  };

  const handleSeatHover = (seatNumber) => {
    setSeatDetails({
      seatNumber,
      isBooked: bookedSeats.includes(seatNumber),
      isSelected: selectedSeats.includes(seatNumber),
      price: boatData?.price || 0
    });
  };

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return 'booked';
    if (selectedSeats.includes(seatNumber)) return 'selected';
    return 'available';
  };

  const getSeatStyle = (seatNumber) => {
    const status = getSeatStatus(seatNumber);
    const baseStyle = {
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: status === 'booked' ? 'not-allowed' : 'pointer',
      borderRadius: '8px',
      border: '2px solid',
      transition: 'all 0.3s ease',
      position: 'relative',
      fontSize: '14px',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '2px'
    };

    switch (status) {
      case 'selected':
        return {
          ...baseStyle,
          backgroundColor: '#52c41a',
          borderColor: '#389e0d',
          color: 'white',
          transform: 'scale(1.05)',
          boxShadow: '0 4px 8px rgba(82, 196, 26, 0.3)'
        };
      case 'booked':
        return {
          ...baseStyle,
          backgroundColor: '#ff4d4f',
          borderColor: '#d9363e',
          color: 'white',
          cursor: 'not-allowed',
          opacity: 0.7
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#1890ff',
          borderColor: '#096dd9',
          color: 'white',
          ':hover': {
            backgroundColor: '#40a9ff',
            transform: 'scale(1.02)'
          }
        };
    }
  };

  const renderBoatLayout = () => (
    <div className="w-full">
      {/* Boat Elevation View */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <Title level={5} className="text-center mb-3 text-blue-700">Boat Elevation</Title>
        <div className="flex justify-center">
          <div className="relative">
            {/* Boat Silhouette */}
            <div className="w-80 h-40 bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg relative">
              {/* Windows */}
              <div className="absolute inset-3 grid grid-cols-8 gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="bg-blue-200 rounded-sm"></div>
                ))}
      </div>
              {/* Mast */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-10 bg-yellow-600"></div>
              {/* Navigation Lights */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
              {/* Boat Name */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                {boatData?.name || 'Boat'}
          </div>
          </div>
            <Text className="block text-center mt-2 text-sm text-blue-600">Passenger Boat - 33 Seats</Text>
          </div>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-300">
        {/* Bow Section */}
        <div className="text-center mb-4">
          <div className="w-16 h-8 bg-blue-400 rounded-t-full mx-auto"></div>
          <Text className="text-blue-700 font-semibold">BOW</Text>
        </div>

        {/* Main Seat Layout */}
        <div className="flex flex-col items-center space-y-2">
          {boatLayout.seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2">
              {row.map((seatNumber) => (
                <div
                    key={seatNumber}
                  style={getSeatStyle(seatNumber)}
                    onClick={() => handleSeatClick(seatNumber)}
                  onMouseEnter={() => handleSeatHover(seatNumber)}
                  onMouseLeave={() => setSeatDetails(null)}
                  className="hover:shadow-md transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="font-bold">{seatNumber}</div>
                    {getSeatStatus(seatNumber) === 'selected' && (
                      <div className="absolute top-1 right-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
            </div>
          ))}
        </div>
          ))}
      </div>

        {/* Stern Section */}
        <div className="text-center mt-4">
          <div className="w-16 h-8 bg-blue-400 rounded-b-full mx-auto"></div>
          <Text className="text-blue-700 font-semibold">STERN</Text>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <Text className="text-sm">Available Seats</Text>
        </div>
                  <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <Text className="text-sm">Selected Seats</Text>
                      </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <Text className="text-sm">Booked Seats</Text>
                  </div>
                  </div>
                </div>
              );

  return (
    <div className="w-full">
      <Card 
        title={
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-blue-500" />
            <span>Seat Selection - {boatData?.name || 'Boat'}</span>
          </div>
        }
        className="shadow-lg"
      >
        <div className="mb-4">
          <Text className="text-gray-600">
            Select your preferred seats from the boat layout. 
            The boat has {boatLayout.totalSeats} seats with {boatLayout.capacity - bookedSeats.length} seats available.
          </Text>
          </div>
          
        {/* Boat Layout */}
        {renderBoatLayout()}

        {/* Selection Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <Title level={5} className="text-green-700 mb-2">
              Selected Seats ({selectedSeats.length})
            </Title>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSeats.map((seatNumber) => (
                <div key={seatNumber} className="flex items-center bg-white p-2 rounded border">
                  <Text className="font-medium">Seat {seatNumber}</Text>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => handleSeatClick(seatNumber)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <Text className="font-bold text-lg">
                Total: ${selectedSeats.length * (boatData?.price || 0)}
              </Text>
              <Text className="text-gray-600">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
              </Text>
          </div>
        </div>
      )}

        {/* Seat Details Tooltip */}
        {seatDetails && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
            <div className="text-sm">
              <Text className="font-bold">Seat {seatDetails.seatNumber}</Text>
              <div className="mt-1">
                <Text className="text-gray-600">
                  Status: {seatDetails.isBooked ? 'Booked' : seatDetails.isSelected ? 'Selected' : 'Available'}
                </Text>
              </div>
              <div className="mt-1">
                <Text className="text-gray-600">
                  Price: ${seatDetails.price}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BoatSeatPlan;
