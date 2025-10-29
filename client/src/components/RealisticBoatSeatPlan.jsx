import React, { useState } from 'react';
import { Card, Button, message, Modal, Row, Col, Typography, Divider } from 'antd';
import { UserOutlined, CarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RealisticBoatSeatPlan = ({ onSeatSelection, boatData }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatDetails, setSeatDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Two-deck fixed layout based on provided drawings (Main + Bridge)
  // Seat numbers are fixed; rooms marked with U/D for upper/down berth when 2 seats
  const boatDecks = {
    bridge: {
      name: 'BRIDGE DECK PLAN',
      description: 'Wheel House, cabins and open lounge',
      gridCols: 3,
      gridRows: 8,
      cabins: [
        // Column stack in middle
        { id: 'BR1', name: 'W/H House', type: 'facility', position: { row: 1, col: 2 }, icon: '🧭' },
        { id: 'BR2', name: 'Atharobaki (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 2, col: 2 }, seats: [1, 2], labels: ['U', 'D'] },
        { id: 'BRWC', name: 'WC', type: 'facility', position: { row: 3, col: 2 }, icon: '🚻' },
        { id: 'BR4', name: 'Kakshiyali (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 4, col: 2 }, seats: [3, 4], labels: ['U', 'D'] },
        { id: 'BR5', name: 'Open Lounge / Roof', type: 'facility', position: { row: 5, col: 2 }, icon: '🛋️' },
        // Pair rows
        { id: 'BR7', name: 'Betrabati (4)', type: 'cabin', capacity: 4, price: 0, position: { row: 6, col: 1 }, seats: [5, 6, 7, 8], labels: ['U', 'U', 'D', 'D'] },
        { id: 'BR8', name: 'Raimongol (4)', type: 'cabin', capacity: 4, price: 0, position: { row: 6, col: 3 }, seats: [9, 10, 11, 12], labels: ['U', 'U', 'D', 'D'] },
        { id: 'BR9', name: 'Hangorkhali (3)', type: 'cabin', capacity: 3, price: 0, position: { row: 7, col: 1 }, seats: [13, 14, 15] },
        { id: 'BR10', name: 'Kalindi Jomuna (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 7, col: 3 }, seats: [16, 17], labels: ['U', 'D'] },
        // New row after Kalindi Jomuna: WC (left) and Gallery (right)
        { id: 'BR11', name: 'WC', type: 'facility', position: { row: 8, col: 1 }, icon: '🚻' },
        { id: 'BR12', name: 'Gallery', type: 'facility', position: { row: 8, col: 3 }, icon: '🍽️' },
      ]
    },
    main: {
      name: 'MAIN DECK PLAN',
      description: 'Cabins, washrooms, engine & galley',
      gridCols: 3,
      gridRows: 10,
      cabins: [
        // Row 1: front cabins
        { id: 'MD1', name: 'Betna (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 1, col: 1 }, seats: [18, 19], labels: ['U', 'D'] },
        { id: 'MD2', name: 'Hariavanga (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 1, col: 3 }, seats: [20, 21], labels: ['U', 'D'] },

        // Row 2: Kopotakkho & Kholpata in columns; middle corridor
        { id: 'MD3', name: 'Kopotakkho (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 2, col: 1 }, seats: [22, 23], labels: ['U', 'D'] },
        { id: 'MD4', name: 'Kholpata (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 2, col: 3 }, seats: [24, 25], labels: ['U', 'D'] },

        // Row 3: Washrooms under that row (first pair, sides only)
        { id: 'MD5', name: 'WC', type: 'facility', position: { row: 3, col: 1 }, icon: '🚻' },
        { id: 'MD6', name: 'WC', type: 'facility', position: { row: 3, col: 3 }, icon: '🚻' },

        // Row 4: Pancharor & Ecamoti rooms (2 seats each)
        { id: 'MD16', name: 'Pancharor (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 4, col: 1 }, seats: [26, 27], labels: ['U', 'D'] },
        { id: 'MD17', name: 'Ecamoti (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 4, col: 3 }, seats: [28, 29], labels: ['U', 'D'] },

        // Row 5: Second pair of washrooms (sides only)
        { id: 'MD5B', name: 'WC', type: 'facility', position: { row: 5, col: 1 }, icon: '🚻' },
        { id: 'MD6B', name: 'WC', type: 'facility', position: { row: 5, col: 3 }, icon: '🚻' },

        // Row 6: Third pair of washrooms (sides only) directly above Pounigachi/Malonco
        { id: 'MD5C', name: 'WC', type: 'facility', position: { row: 6, col: 1 }, icon: '🚻' },
        { id: 'MD6C', name: 'WC', type: 'facility', position: { row: 6, col: 3 }, icon: '🚻' },

        // Row 7: Next pair cabins: Pounigachi & Malonco
        { id: 'MD9', name: 'Pounigachi (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 7, col: 1 }, seats: [30, 31], labels: ['U', 'D'] },
        { id: 'MD10', name: 'Malonco (2)', type: 'cabin', capacity: 2, price: 0, position: { row: 7, col: 3 }, seats: [32, 33], labels: ['U', 'D'] },

        // Row 8: Engine centered
        { id: 'MD11', name: 'Engine Room', type: 'facility', position: { row: 8, col: 2 }, icon: '⚙️' },

        // Row 9 & 10: Aft services on sides (keep Gallery only on right-back)
        { id: 'MD13', name: 'WC', type: 'facility', position: { row: 9, col: 1 }, icon: '🚻' },
        { id: 'MD14', name: 'Gallery', type: 'facility', position: { row: 9, col: 3 }, icon: '🍽️' },
      ]
    }
  };

  const handleSeatClick = (seatNumber, cabin, deckKey) => {
    const isSelected = selectedSeats.some(seat => seat.seatNumber === seatNumber);

    if (isSelected) {
      const updatedSeats = selectedSeats.filter(seat => seat.seatNumber !== seatNumber);
      setSelectedSeats(updatedSeats);
      onSeatSelection(updatedSeats.map(seat => seat.seatNumber));
      message.success(`Seat ${seatNumber} removed`);
    } else {
      const newSeat = {
        seatNumber,
        cabinId: cabin.id,
        cabinName: cabin.name,
        deck: deckKey,
        price: 0
      };
      const updatedSeats = [...selectedSeats, newSeat];
      setSelectedSeats(updatedSeats);
      onSeatSelection(updatedSeats.map(seat => seat.seatNumber));
      message.success(`Seat ${seatNumber} in ${cabin.name} added`);
    }
  };

  const getSeatStatus = (seatNumber) => selectedSeats.some(seat => seat.seatNumber === seatNumber) ? 'selected' : 'available';

  const getSeatStyle = (seatNumber) => {
    const status = getSeatStatus(seatNumber);
    const base = {
      width: 30,
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      borderRadius: '50%',
      border: '1px solid',
      transition: 'all 0.2s',
      position: 'relative',
      background: '#0ea5e9',
      borderColor: '#0284c7',
      color: 'white',
      fontSize: 14,
    };
    return status === 'selected'
      ? { ...base, background: '#22c55e', borderColor: '#16a34a', boxShadow: '0 2px 8px rgba(34,197,94,.35)' }
      : base;
  };

  const getCabinStyle = (cabin) => {
    const base = {
      minHeight: 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      border: '2px solid',
      transition: 'all .2s',
      padding: 8,
      textAlign: 'center'
    };
    return cabin.type === 'facility'
      ? { ...base, background: '#f3f4f6', borderColor: '#e5e7eb', color: '#6b7280' }
      : { ...base, background: '#e0f2fe', borderColor: '#93c5fd', color: '#0369a1' };
  };

  const RoundedBoat = ({ children, title, subtitle, extraStyle }) => (
    <div className="mb-10">
      <div className="mb-4 text-center">
        <Title level={4} className="text-blue-700 m-0">{title}</Title>
        {subtitle && <Text className="text-blue-500">{subtitle}</Text>}
      </div>
      <div
        className="relative bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-300 overflow-visible"
        style={{
          padding: '36px 24px 84px 24px',
          borderTopLeftRadius: 140,
          borderTopRightRadius: 140,
          borderBottomLeftRadius: 110,
          borderBottomRightRadius: 110,
          minHeight: 420,
          ...(extraStyle || {})
        }}
      >
        {children}
      </div>
    </div>
  );

  const renderDeck = (deckKey, deck) => (
    <RoundedBoat key={deckKey} title={deck.name} subtitle={deck.description} extraStyle={deckKey === 'main' ? { paddingTop: 72, minHeight: 460 } : undefined}>
      <div 
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${deck.gridCols}, 1fr)` }}
      >
        {Array.from({ length: deck.gridCols * deck.gridRows }).map((_, index) => {
          const row = Math.floor(index / deck.gridCols) + 1;
          const col = (index % deck.gridCols) + 1;
          const cabin = deck.cabins.find(c => c.position.row === row && c.position.col === col);
          if (!cabin) return <div key={index} style={{ minHeight: 60 }} />;

          return (
            <div
              key={cabin.id}
              style={getCabinStyle(cabin)}
              onClick={() => {
                if (cabin.type === 'cabin') {
                  setSeatDetails({ ...cabin, deck: deckKey });
                  setIsModalVisible(true);
                }
              }}
              className="hover:shadow"
            >
              <div className="text-xs font-bold mb-1 leading-tight">{cabin.name}</div>

              {cabin.type === 'cabin' && (
                <div className="flex flex-wrap justify-center gap-1">
                  {cabin.seats.map((seatNumber, idx) => (
                    <div
                      key={seatNumber}
                      style={getSeatStyle(seatNumber)}
                      onClick={(e) => { e.stopPropagation(); handleSeatClick(seatNumber, cabin, deckKey); }}
                      title={cabin.labels?.[idx] ? `${cabin.labels[idx]} berth` : undefined}
                    >
                      {/* Clearer seat icon */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 11V7a3 3 0 0 1 6 0v4"/>
                        <rect x="5" y="11" width="10" height="4" rx="1" fill="white" stroke="white"/>
                        <path d="M5 15v2M15 15v2M3 19h16"/>
                      </svg>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 text-[9px] rounded-full bg-black/80 text-white flex items-center justify-center">
                        {seatNumber}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {cabin.type === 'facility' && (
                <div className="text-2xl">{cabin.icon || '🏠'}</div>
              )}
            </div>
          );
        })}
      </div>
    </RoundedBoat>
  );

  return (
    <div className="w-full">
      <Card 
        title={
          <div className="flex items-center">
            <CarOutlined className="mr-2 text-blue-500" />
            <span>Boat Seat Selection - {boatData?.name || 'Two-Deck Vessel'}</span>
          </div>
        }
        className="shadow-lg"
      >
        {/* Show both decks together */}
        {renderDeck('bridge', boatDecks.bridge)}
        {renderDeck('main', boatDecks.main)}

        {/* Selection Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <Title level={5} className="text-green-700 mb-2">Selected Seats ({selectedSeats.length})</Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedSeats.map((seat) => (
                <div key={seat.seatNumber} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex-1 min-w-0">
                    <Text className="font-medium">Seat {seat.seatNumber}</Text>
                    <Text className="text-gray-500 ml-2 truncate">{seat.cabinName}</Text>
                    <Text className="text-blue-500 ml-2">{seat.deck} deck</Text>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
            <Text className="text-gray-600">Click a seat again to remove.</Text>
          </div>
        )}

        {/* Cabin Details Modal */}
        <Modal
          title={`Cabin Details${seatDetails ? ' - ' + seatDetails.name : ''}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>
          ]}
        >
          {seatDetails && (
            <div>
              <div className="mb-4">
                <Title level={4}>{seatDetails.name}</Title>
                <Text className="text-gray-600">Deck: {seatDetails.deck === 'bridge' ? 'Bridge' : 'Main'}</Text>
              </div>
              <img
                src={`https://via.placeholder.com/800x450?text=${encodeURIComponent(seatDetails.name)}`}
                alt={seatDetails.name}
                className="w-full rounded mb-3"
              />
              <Row gutter={16}>
                <Col span={12}>
                  <div className="flex items-center mb-2">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <Text><strong>Capacity:</strong> {seatDetails.capacity || 0}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center mb-2">
                    <Text><strong>Seats:</strong> {seatDetails.seats?.join(', ') || '—'}</Text>
                  </div>
                </Col>
              </Row>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <Text className="text-blue-700">Click a specific seat to select/deselect.</Text>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default RealisticBoatSeatPlan;
