import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message, Form, Input, Button, Card, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import RealisticBoatSeatPlan from "../components/RealisticBoatSeatPlan";
import PaymentOptions from "../components/PaymentOptions";
import { Helmet } from "react-helmet";
import moment from "moment";

// Fixed seat metadata for 33 seats
const SEAT_METADATA = Array.from({ length: 33 }, (_, idx) => {
  const seatNumber = idx + 1;
  return {
    seatNumber,
    roomName: `Room ${seatNumber}`,
    imageUrl: `https://via.placeholder.com/800x500?text=Seat+${seatNumber}`,
  };
});

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentOption, setPaymentOption] = useState('full');
  const params = useParams();
  const dispatch = useDispatch();
  const [boat, setBoat] = useState(null);
  const [form] = Form.useForm();
  const [roomPreview, setRoomPreview] = useState(null);

  const getBoat = useCallback(async () => {
    try {
      if (!params.id) {
        message.error("No boat ID provided");
        navigate("/");
        return;
      }
      
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/buses/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setBoat(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id, navigate]);

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: boat._id,
          seats: selectedSeats,
          transactionId: transactionId,
          paymentOption: paymentOption,
          totalAmount: boat.price * selectedSeats.length,
          paymentAmount: paymentOption === 'advance' ? Math.round(boat.price * selectedSeats.length * 0.5) : boat.price * selectedSeats.length
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
    if (seats && seats.length === 1) {
      const seat = seats[0];
      const meta = SEAT_METADATA.find((r) => r.seatNumber === seat);
      if (meta) setRoomPreview(meta);
    } else {
      setRoomPreview(null);
    }
  };

  const handlePayment = async (values) => {
      if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat");
        return;
      }

    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/payment/initialize-payment", {
        busId: boat._id,
        seats: selectedSeats,
        userId: localStorage.getItem("user_id"),
        paymentOption: paymentOption,
        totalAmount: boat.price * selectedSeats.length,
        paymentAmount: paymentOption === 'advance' ? Math.round(boat.price * selectedSeats.length * 0.5) : boat.price * selectedSeats.length
      });
      dispatch(HideLoading());
      
      if (response.data.success) {
        message.loading('Redirecting to payment gateway...', 2);
        window.location.href = response.data.data.gatewayPageURL;
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBoat();
  }, [getBoat]);

  if (!boat) {
    return <div>Loading...</div>;
  }

  const totalPrice = boat.price * selectedSeats.length;
  const advanceAmount = Math.round(totalPrice * 0.5);
  const remainingAmount = totalPrice - advanceAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Book Boat - {boat.name}</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Boat Details */}
          <div className="lg:col-span-1">
            <Card title="Boat Details" className="mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{boat.name}</h3>
                  <p className="text-gray-600">{boat.from} - {boat.to}</p>
                    </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Journey Date:</span>
                    <span className="font-medium">{moment(boat.journeyDate).format('YYYY-MM-DD')}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">${boat.price} /-</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure Time:</span>
                    <span className="font-medium">{boat.departureTime}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arrival Time:</span>
                    <span className="font-medium">{boat.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{boat.capacity}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats Left:</span>
                    <span className="font-medium text-blue-600">{boat.capacity - (boat.seatsBooked?.length || 0)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Summary */}
            <Card title="Booking Summary" className="mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-medium text-green-600">${totalPrice}</span>
                </div>
                
                {paymentOption === 'advance' && (
                  <>
                    <div className="flex justify-between text-orange-600">
                      <span>Advance Payment (50%):</span>
                      <span className="font-semibold">${advanceAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <span>Remaining Amount:</span>
                      <span>${remainingAmount}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Payment Options */}
            <Card title="Payment Options">
              <PaymentOptions
                selectedOption={paymentOption}
                onOptionChange={setPaymentOption}
                totalAmount={totalPrice}
              />
            </Card>
                  </div>

          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <RealisticBoatSeatPlan
              onSeatSelection={handleSeatSelection}
              boatData={boat}
            />

            <Modal
              visible={!!roomPreview}
              onCancel={() => setRoomPreview(null)}
              footer={null}
              title={roomPreview?.roomName || `Seat ${selectedSeats[0] || ""}`}
            >
              {roomPreview?.imageUrl ? (
                <img src={roomPreview.imageUrl} alt={roomPreview.roomName || "Room"} className="w-full rounded-md" />
              ) : (
                <div className="text-gray-500">No image available</div>
              )}
            </Modal>
            
            {/* Booking Form */}
            {selectedSeats.length > 0 && (
              <Card title="Complete Your Booking" className="mt-6">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handlePayment}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Passenger Name"
                        name="passengerName"
                        rules={[{ required: true, message: 'Please enter passenger name' }]}
                      >
                        <Input placeholder="Enter passenger name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please enter phone number' }]}
                      >
                        <Input placeholder="Enter phone number" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Invalid email' }
                    ]}
                  >
                    <Input placeholder="Enter email address" />
                  </Form.Item>

                  <Form.Item
                    label="Special Requests"
                    name="specialRequests"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Any special requests or requirements..."
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 h-12 text-lg font-semibold"
                    disabled={selectedSeats.length === 0}
                  >
                    {paymentOption === 'advance' 
                      ? `Pay 50% Advance - $${advanceAmount}` 
                      : `Pay Full Amount - $${totalPrice}`
                    }
                  </Button>
                </Form>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookNow;