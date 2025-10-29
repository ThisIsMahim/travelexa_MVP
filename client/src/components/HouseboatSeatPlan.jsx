import React, { useState, useEffect } from 'react';
import { Card, Button, message, Modal, Row, Col, Typography, Divider } from 'antd';
import { UserOutlined, HomeOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HouseboatSeatPlan = ({ 
  selectedItems = [], 
  onItemSelection, 
  houseboatData,
  disabled = false 
}) => {
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [cabinDetails, setCabinDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Define the houseboat layout based on the technical drawing
  const houseboatLayout = {
    bridgeDeck: {
      name: "Bridge Deck",
      cabins: [
        { id: 'BD1', name: 'Galley', type: 'facility', capacity: 0, price: 0, description: 'Kitchen and dining area' },
        { id: 'BD2', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'BD3', name: '2 Person Cabin', type: 'cabin', capacity: 2, price: 150, description: 'Comfortable 2-person cabin with basic amenities' },
        { id: 'BD4', name: '4 Person Cabin A', type: 'cabin', capacity: 4, price: 280, description: 'Spacious 4-person cabin with private facilities' },
        { id: 'BD5', name: '4 Person Cabin B', type: 'cabin', capacity: 4, price: 280, description: 'Spacious 4-person cabin with private facilities' },
        { id: 'BD6', name: '3 Person Cabin', type: 'cabin', capacity: 3, price: 220, description: 'Cozy 3-person cabin with modern amenities' },
        { id: 'BD7', name: 'Open Lounge', type: 'facility', capacity: 0, price: 0, description: 'Common gathering area' },
        { id: 'BD8', name: 'Owners Cabin', type: 'cabin', capacity: 2, price: 200, description: 'Premium owners cabin with luxury amenities' },
        { id: 'BD9', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'BD10', name: '4 Crew Cabin', type: 'cabin', capacity: 4, price: 180, description: 'Crew accommodation cabin' },
        { id: 'BD11', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' }
      ]
    },
    mainDeck: {
      name: "Main Deck",
      cabins: [
        { id: 'MD1', name: 'Galley', type: 'facility', capacity: 0, price: 0, description: 'Kitchen and dining area' },
        { id: 'MD2', name: 'Engine Room', type: 'facility', capacity: 0, price: 0, description: 'Engine and mechanical systems' },
        { id: 'MD3', name: 'Double Cabin A', type: 'cabin', capacity: 2, price: 160, description: 'Double occupancy cabin with private WC' },
        { id: 'MD4', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD5', name: 'Double Cabin B', type: 'cabin', capacity: 2, price: 160, description: 'Double occupancy cabin with private WC' },
        { id: 'MD6', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD7', name: '3 Person Cabin A', type: 'cabin', capacity: 3, price: 240, description: 'Triple occupancy cabin with private WC' },
        { id: 'MD8', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD9', name: '3 Person Cabin B', type: 'cabin', capacity: 3, price: 240, description: 'Triple occupancy cabin with private WC' },
        { id: 'MD10', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD11', name: '3 Person Cabin C', type: 'cabin', capacity: 3, price: 240, description: 'Triple occupancy cabin with private WC' },
        { id: 'MD12', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD13', name: '3 Person Cabin D', type: 'cabin', capacity: 3, price: 240, description: 'Triple occupancy cabin with private WC' },
        { id: 'MD14', name: 'WC', type: 'facility', capacity: 0, price: 0, description: 'Bathroom facility' },
        { id: 'MD15', name: '2 Person Cabin A', type: 'cabin', capacity: 2, price: 140, description: 'Twin cabin with shared facilities' },
        { id: 'MD16', name: '2 Person Cabin B', type: 'cabin', capacity: 2, price: 140, description: 'Twin cabin with shared facilities' }
      ]
    }
  };

  const handleCabinClick = (cabin) => {
    if (disabled || cabin.type === 'facility') return;
    
    setSelectedCabin(cabin);
    setCabinDetails(cabin);
    setIsModalVisible(true);
  };

  const handleCabinSelection = (cabin) => {
    if (disabled) return;
    
    const isSelected = selectedItems.some(item => item.id === cabin.id);
    
    if (isSelected) {
      // Remove from selection
      const updatedItems = selectedItems.filter(item => item.id !== cabin.id);
      onItemSelection(updatedItems);
      message.success(`${cabin.name} removed from selection`);
    } else {
      // Add to selection
      const updatedItems = [...selectedItems, cabin];
      onItemSelection(updatedItems);
      message.success(`${cabin.name} added to selection`);
    }
    setIsModalVisible(false);
  };

  const getCabinStatus = (cabin) => {
    if (cabin.type === 'facility') return 'facility';
    const isSelected = selectedItems.some(item => item.id === cabin.id);
    return isSelected ? 'selected' : 'available';
  };

  const getCabinStyle = (cabin) => {
    const status = getCabinStatus(cabin);
    const baseStyle = {
      width: '100%',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: cabin.type === 'cabin' ? 'pointer' : 'default',
      borderRadius: '8px',
      border: '2px solid',
      transition: 'all 0.3s ease',
      position: 'relative',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '4px'
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
      case 'facility':
        return {
          ...baseStyle,
          backgroundColor: '#f0f0f0',
          borderColor: '#d9d9d9',
          color: '#666',
          cursor: 'default'
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

  const renderDeck = (deck) => (
    <div key={deck.name} className="mb-8">
      <Title level={4} className="text-center mb-4 text-blue-600">
        {deck.name}
      </Title>
      
      {/* Deck Layout - Representing the actual boat structure */}
      <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg border-2 border-blue-300">
        {/* Bow Section */}
        <div className="text-center mb-4">
          <div className="w-16 h-8 bg-blue-400 rounded-t-full mx-auto"></div>
          <Text className="text-blue-700 font-semibold">BOW</Text>
        </div>

        {/* Main Deck Layout */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {deck.cabins.map((cabin, index) => (
            <div
              key={cabin.id}
              style={getCabinStyle(cabin)}
              onClick={() => handleCabinClick(cabin)}
              className="hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="font-bold text-xs">{cabin.name}</div>
                {cabin.type === 'cabin' && (
                  <div className="text-xs">
                    {cabin.capacity} pax
                  </div>
                )}
              </div>
              {cabin.type === 'cabin' && (
                <div className="absolute top-1 right-1">
                  {getCabinStatus(cabin) === 'selected' ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-white rounded-full border border-gray-300"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Stern Section */}
        <div className="text-center">
          <div className="w-16 h-8 bg-blue-400 rounded-b-full mx-auto"></div>
          <Text className="text-blue-700 font-semibold">STERN</Text>
        </div>
      </div>

      {/* Deck Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <Text className="text-sm">Available Cabins</Text>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <Text className="text-sm">Selected Cabins</Text>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
          <Text className="text-sm">Facilities</Text>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <Card 
        title={
          <div className="flex items-center">
            <HomeOutlined className="mr-2 text-blue-500" />
            <span>Houseboat Cabin Selection</span>
          </div>
        }
        className="shadow-lg"
      >
        <div className="mb-4">
          <Text className="text-gray-600">
            Select your preferred cabins from the multi-deck houseboat layout. 
            The boat features 14 cabins with a total capacity of 33 passengers across two decks.
          </Text>
        </div>

        {/* Boat Elevation View */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <Title level={5} className="text-center mb-3 text-blue-700">Boat Elevation</Title>
          <div className="flex justify-center">
            <div className="relative">
              {/* Boat Silhouette */}
              <div className="w-64 h-32 bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg relative">
                {/* Windows */}
                <div className="absolute inset-2 grid grid-cols-6 gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="bg-blue-200 rounded-sm"></div>
                  ))}
                </div>
                {/* Mast */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-yellow-600"></div>
                {/* Navigation Lights */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <Text className="block text-center mt-2 text-sm text-blue-600">Multi-Deck Houseboat</Text>
            </div>
          </div>
        </div>

        {/* Deck Layouts */}
        {Object.values(houseboatLayout).map(renderDeck)}

        {/* Selection Summary */}
        {selectedItems.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <Title level={5} className="text-green-700 mb-2">
              Selected Cabins ({selectedItems.length})
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div>
                    <Text className="font-medium">{item.name}</Text>
                    <Text className="text-gray-500 text-sm ml-2">{item.capacity} pax</Text>
                  </div>
                  <Text className="text-green-600 font-bold">${item.price}</Text>
                </div>
              ))}
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <Text className="font-bold text-lg">Total: ${selectedItems.reduce((sum, item) => sum + item.price, 0)}</Text>
              <Text className="text-gray-600">
                {selectedItems.reduce((sum, item) => sum + item.capacity, 0)} passengers
              </Text>
            </div>
          </div>
        )}

        {/* Cabin Details Modal */}
        <Modal
          title={`Cabin Details - ${cabinDetails?.name}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            cabinDetails && cabinDetails.type === 'cabin' && (
              <Button
                key="select"
                type="primary"
                onClick={() => handleCabinSelection(cabinDetails)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {selectedItems.some(item => item.id === cabinDetails.id) ? 'Remove' : 'Select'} Cabin
              </Button>
            )
          ]}
        >
          {cabinDetails && (
            <div>
              <div className="mb-4">
                <Title level={4}>{cabinDetails.name}</Title>
                <Text className="text-gray-600">{cabinDetails.description}</Text>
              </div>
              
              <Row gutter={16}>
                <Col span={12}>
                  <div className="flex items-center mb-2">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <Text><strong>Capacity:</strong> {cabinDetails.capacity} passengers</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="flex items-center mb-2">
                    <Text><strong>Price:</strong> ${cabinDetails.price}</Text>
                  </div>
                </Col>
              </Row>
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <Text className="text-blue-700">
                  <strong>Note:</strong> This cabin is part of a multi-deck houseboat with shared common areas 
                  including galley, lounge, and bathroom facilities.
                </Text>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default HouseboatSeatPlan;
