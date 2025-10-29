import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, DollarSign, CheckCircle, XCircle } from 'lucide-react';

// Embedded JSON data for houseboat deck plans
const HOUSEBOAT_DATA = {
  "boat": {
    "id": "HB001",
    "name": "Houseboat Serenity",
    "viewBox": "0 0 1000 600"
  },
  "decks": [
    {
      "deck_id": "BRIDGE",
      "deck_name": "Bridge Deck",
      "outline": { "x": 60, "y": 30, "width": 880, "height": 140, "rx": 28 },
      "items": [
        {"id":"BR-C01","kind":"cabin","label":"Bridge Cabin 01","x":120,"y":50,"width":140,"height":80,"price":1500,"capacity":2,"status":"available"},
        {"id":"BR-C02","kind":"cabin","label":"Bridge Cabin 02","x":300,"y":50,"width":140,"height":80,"price":1800,"capacity":3,"status":"booked"},
        {"id":"BR-LG1","kind":"lounge","label":"Bridge Lounge","cx":740,"cy":100,"r":36,"price":0,"capacity":8,"status":"available"}
      ]
    },
    {
      "deck_id": "MAIN",
      "deck_name": "Main Deck",
      "outline": { "x": 60, "y": 190, "width": 880, "height": 220, "rx": 28 },
      "items": [
        {"id":"MD-C01","kind":"cabin","label":"Main Cabin 01","x":140,"y":220,"width":160,"height":90,"price":1200,"capacity":2,"status":"available"},
        {"id":"MD-C02","kind":"cabin","label":"Main Cabin 02","x":340,"y":220,"width":160,"height":90,"price":1600,"capacity":3,"status":"held"},
        {"id":"MD-C03","kind":"cabin","label":"Main Cabin 03","x":540,"y":220,"width":160,"height":90,"price":1400,"capacity":2,"status":"available"},
        {"id":"MD-L1","kind":"lounge","label":"Central Lounge","cx":820,"cy":320,"r":44,"price":80,"capacity":6,"status":"available"}
      ]
    },
    {
      "deck_id": "BOTTOM",
      "deck_name": "Bottom Deck",
      "outline": { "x":60,"y":430,"width":880,"height":120,"rx":28 },
      "items": [
        {"id":"BT-G01","kind":"cabin","label":"Lower Cabin G01","x":120,"y":450,"width":140,"height":72,"price":1000,"capacity":1,"status":"available"},
        {"id":"BT-G02","kind":"cabin","label":"Lower Cabin G02","x":300,"y":450,"width":140,"height":72,"price":1000,"capacity":1,"status":"booked"},
        {"id":"BT-ENG","kind":"restricted","label":"Engine Room","x":520,"y":450,"width":260,"height":72,"price":0,"capacity":0,"status":"not_bookable"}
      ]
    }
  ]
};

const HouseboatBookingMap = ({ onItemSelection }) => {
  // State management
  const [selectedDeck, setSelectedDeck] = useState('BRIDGE');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [heldItems, setHeldItems] = useState(new Map()); // Map of itemId to hold data
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Refs for tooltip positioning
  const tooltipRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Helper functions
  const colorByStatus = (status) => {
    switch (status) {
      case 'available': return { fill: '#10B981', stroke: '#059669', strokeWidth: 2 };
      case 'selected': return { fill: '#3B82F6', stroke: '#1D4ED8', strokeWidth: 3 };
      case 'booked': return { fill: '#6B7280', stroke: '#4B5563', strokeWidth: 2 };
      case 'held': return { fill: '#F59E0B', stroke: '#D97706', strokeWidth: 3 };
      case 'not_bookable': return { fill: '#EF4444', stroke: '#DC2626', strokeWidth: 2 };
      default: return { fill: '#E5E7EB', stroke: '#9CA3AF', strokeWidth: 2 };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getItemStatus = (item) => {
    if (heldItems.has(item.id)) return 'held';
    if (selectedItems.has(item.id)) return 'selected';
    return item.status;
  };

  // Handle item selection
  const handleItemClick = (item) => {
    if (item.status === 'booked' || item.status === 'not_bookable') {
      setToastMessage('This spot is already booked or not available');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    let newSelectedItems;
    if (selectedItems.has(item.id)) {
      // Deselect item
      newSelectedItems = new Set(selectedItems);
      newSelectedItems.delete(item.id);
    } else {
      // Select item
      newSelectedItems = new Set([...selectedItems, item.id]);
    }
    
    setSelectedItems(newSelectedItems);
    
    // Notify parent component about selection changes
    if (onItemSelection) {
      const selectedItemsData = Array.from(newSelectedItems).map(id => 
        currentDeckItems.find(item => item.id === id)
      ).filter(Boolean);
      onItemSelection(selectedItemsData);
    }
  };

  // Handle double click for hold simulation
  const handleItemDoubleClick = (item) => {
    if (item.status === 'booked' || item.status === 'not_bookable') return;
    
    // Simulate hold API call
    // TODO: Replace with actual API call
    // await fetch('/api/seat/hold', { 
    //   method: 'POST', 
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ seatId: item.id, duration: 300 }) // 5 minutes
    // });

    const holdData = {
      itemId: item.id,
      item: item,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
      timer: 300 // 5 minutes in seconds
    };

    setHeldItems(prev => new Map([...prev, [item.id, holdData]]));
    setSelectedItems(prev => new Set([...prev, item.id]));
  };

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (event, item) => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top - 10
      });
    }
    setHoveredItem(item);
  };

  // Timer effect for held items
  useEffect(() => {
    const interval = setInterval(() => {
      setHeldItems(prev => {
        const now = Date.now();
        const newMap = new Map();
        
        prev.forEach((holdData, itemId) => {
          if (now < holdData.expiresAt) {
            const remainingTime = Math.max(0, Math.floor((holdData.expiresAt - now) / 1000));
            newMap.set(itemId, { ...holdData, timer: remainingTime });
          }
        });
        
        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Render individual item
  const renderItem = (item) => {
    const status = getItemStatus(item);
    const colors = colorByStatus(status);
    const isInteractive = status !== 'booked' && status !== 'not_bookable';

    const commonProps = {
      ...colors,
      className: `transition-all duration-200 ${isInteractive ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`,
      onClick: () => handleItemClick(item),
      onDoubleClick: () => handleItemDoubleClick(item),
      onMouseMove: (e) => handleMouseMove(e, item),
      onMouseLeave: () => setHoveredItem(null),
      'aria-label': `${item.label} - ${status} - ${formatCurrency(item.price)} - Capacity: ${item.capacity}`,
      tabIndex: isInteractive ? 0 : -1,
      onKeyDown: (e) => {
        if (e.key === 'Enter' && isInteractive) {
          handleItemClick(item);
        }
      }
    };

    if (item.kind === 'cabin') {
      return (
        <motion.rect
          key={item.id}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          rx="8"
          {...commonProps}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        />
      );
    } else if (item.kind === 'lounge') {
      return (
        <motion.circle
          key={item.id}
          cx={item.cx}
          cy={item.cy}
          r={item.r}
          {...commonProps}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      );
    } else if (item.kind === 'restricted') {
      return (
        <rect
          key={item.id}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          rx="8"
          {...commonProps}
        />
      );
    }

    return null;
  };

  // Get current deck data
  const currentDeck = HOUSEBOAT_DATA.decks.find(deck => deck.deck_id === selectedDeck);
  const currentDeckItems = currentDeck?.items || [];

  // Calculate totals
  const selectedItemsData = Array.from(selectedItems).map(id => 
    currentDeckItems.find(item => item.id === id)
  ).filter(Boolean);

  const totalPrice = selectedItemsData.reduce((sum, item) => sum + item.price, 0);
  const totalCapacity = selectedItemsData.reduce((sum, item) => sum + item.capacity, 0);

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    setIsConfirming(true);
    
    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/seat/confirm', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ 
    //       seats: Array.from(selectedItems),
    //       totalPrice,
    //       totalCapacity 
    //     })
    //   });
    //   const result = await response.json();
    //   if (result.success) {
    //     // Handle success
    //   }
    // } catch (error) {
    //   // Handle error
    // }

    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      setShowConfirmModal(false);
      setSelectedItems(new Set());
      setHeldItems(new Map());
      setToastMessage('Booking confirmed successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {HOUSEBOAT_DATA.boat.name}
          </h1>
          <p className="text-gray-600">Select your preferred cabins and lounges</p>
        </div>

        {/* Deck Selector Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {HOUSEBOAT_DATA.decks.map((deck) => (
            <button
              key={deck.deck_id}
              onClick={() => setSelectedDeck(deck.deck_id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDeck === deck.deck_id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {deck.deck_name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Floor Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="relative" ref={tooltipRef}>
                <svg
                  viewBox={HOUSEBOAT_DATA.boat.viewBox}
                  className="w-full h-auto border border-gray-200 rounded-lg"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Deck Outline */}
                  {currentDeck && (
                    <rect
                      x={currentDeck.outline.x}
                      y={currentDeck.outline.y}
                      width={currentDeck.outline.width}
                      height={currentDeck.outline.height}
                      rx={currentDeck.outline.rx}
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                  )}

                  {/* Deck Items */}
                  {currentDeckItems.map(renderItem)}

                  {/* Deck Label */}
                  {currentDeck && (
                    <text
                      x={currentDeck.outline.x + currentDeck.outline.width / 2}
                      y={currentDeck.outline.y + 20}
                      textAnchor="middle"
                      className="text-sm font-semibold fill-gray-700"
                    >
                      {currentDeck.deck_name}
                    </text>
                  )}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredItem && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-10"
                      style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="font-semibold">{hoveredItem.label}</div>
                      <div className="text-gray-300">
                        {formatCurrency(hoveredItem.price)} • {hoveredItem.capacity} guests
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {getItemStatus(hoveredItem)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Summary
              </h3>

              {/* Selected Items */}
              <div className="space-y-3 mb-6">
                {selectedItemsData.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items selected</p>
                ) : (
                  selectedItemsData.map((item) => {
                    const isHeld = heldItems.has(item.id);
                    const holdData = heldItems.get(item.id);
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(item.price)} • {item.capacity} guests
                          </div>
                          {isHeld && holdData && (
                            <div className="flex items-center text-xs text-amber-600 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              Held: {Math.floor(holdData.timer / 60)}:{(holdData.timer % 60).toString().padStart(2, '0')}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleItemClick(item)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Totals */}
              {selectedItemsData.length > 0 && (
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Total Capacity:</span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {totalCapacity} guests
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total Price:</span>
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={selectedItemsData.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Booking
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
              <span>Held</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>Restricted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Your Booking
              </h3>
              
              <div className="space-y-3 mb-6">
                {selectedItemsData.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.price)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isConfirming}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Confirming...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HouseboatBookingMap;
