import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, message, Input, Select, DatePicker, Button, Card, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';
import { axiosInstance } from '../helpers/axiosInstance';
import HouseboatSeatPlan from '../components/HouseboatSeatPlan';

const { Option } = Select;

const BookHouseboat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [form] = Form.useForm();
  const [houseboatData, setHouseboatData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(`/login?from=${encodeURIComponent(`/book-houseboat/${id}`)}`);
      return;
    }
    fetchHouseboatData();
  }, [id, user, navigate]);

  const fetchHouseboatData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/houseboats/${id}`);
      if (response.data.success) {
        setHouseboatData(response.data.data);
      } else {
        message.error(response.data.message);
        navigate('/');
      }
    } catch (error) {
      message.error('Error fetching houseboat data');
      navigate('/');
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleBooking = async (values) => {
    try {
      dispatch(ShowLoading());
      
      const bookingReference = `HB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);
      const advanceAmount = Math.round(totalAmount * 0.5);
      const remainingAmount = totalAmount - advanceAmount;

      const bookingData = {
        houseboatId: id,
        bookingReference: bookingReference,
        selectedItems: selectedItems,
        checkInDate: values.checkInDate.format('YYYY-MM-DD'),
        checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
        guestCount: values.guestCount,
        guestDetails: values.guestDetails,
        emergencyContact: values.emergencyContact,
        specialRequests: values.specialRequests,
        totalAmount: totalAmount,
        advanceAmount: advanceAmount,
        remainingAmount: remainingAmount,
        paymentType: 'advance'
      };

      const response = await axiosInstance.post('/api/houseboats/initialize-payment', bookingData);
      dispatch(HideLoading());
      
      if (response.data.success) {
        message.loading('Redirecting to payment gateway for advance payment...', 2);
        window.location.href = response.data.data.gatewayPageURL;
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response?.data?.message || 'Error initializing payment');
    }
  };

  const handleItemSelection = (items) => {
    setSelectedItems(items);
    if (items.length > 0) {
      setShowBookingForm(true);
    }
  };

  if (!houseboatData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{houseboatData.name}</h1>
              <p className="text-gray-600">{houseboatData.location}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                ${houseboatData.price}
                <span className="text-lg text-gray-500">/night</span>
              </div>
              <div className="text-sm text-gray-500">Capacity: {houseboatData.capacity} guests</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Houseboat Details */}
          <div className="lg:col-span-1">
            <Card title="Houseboat Details" className="mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Description</h4>
                  <p className="text-gray-600">{houseboatData.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Amenities</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {houseboatData.amenities?.map((amenity, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Facilities</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {houseboatData.facilities?.map((facility, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Form */}
            {showBookingForm && (
              <Card title="Complete Your Booking" className="mb-6">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleBooking}
                  initialValues={{
                    guestCount: 1,
                    guestDetails: [{ name: '', age: '', gender: '', phone: '', email: '' }]
                  }}
                >
                  <Form.Item
                    label="Check-in Date"
                    name="checkInDate"
                    rules={[{ required: true, message: 'Please select check-in date' }]}
                  >
                    <DatePicker
                      className="w-full"
                      disabledDate={(current) => current && current < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Check-out Date"
                    name="checkOutDate"
                    rules={[{ required: true, message: 'Please select check-out date' }]}
                  >
                    <DatePicker
                      className="w-full"
                      disabledDate={(current) => current && current < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Number of Guests"
                    name="guestCount"
                    rules={[{ required: true, message: 'Please enter number of guests' }]}
                  >
                    <Input type="number" min="1" max={houseboatData.capacity} />
                  </Form.Item>

                  <Form.List name="guestDetails">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-semibold">Guest {key + 1}</h4>
                              {fields.length > 1 && (
                                <Button type="link" danger onClick={() => remove(name)}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            
                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'name']}
                                  label="Full Name"
                                  rules={[{ required: true, message: 'Name is required' }]}
                                >
                                  <Input placeholder="Enter full name" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'age']}
                                  label="Age"
                                  rules={[{ required: true, message: 'Age is required' }]}
                                >
                                  <Input type="number" min="1" placeholder="Enter age" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'gender']}
                                  label="Gender"
                                  rules={[{ required: true, message: 'Gender is required' }]}
                                >
                                  <Select placeholder="Select gender">
                                    <Option value="Male">Male</Option>
                                    <Option value="Female">Female</Option>
                                    <Option value="Other">Other</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'phone']}
                                  label="Phone"
                                  rules={[{ required: true, message: 'Phone is required' }]}
                                >
                                  <Input placeholder="Enter phone number" />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item
                              {...restField}
                              name={[name, 'email']}
                              label="Email"
                              rules={[
                                { required: true, message: 'Email is required' },
                                { type: 'email', message: 'Invalid email' }
                              ]}
                            >
                              <Input placeholder="Enter email address" />
                            </Form.Item>
                          </div>
                        ))}
                        
                        <Button type="dashed" onClick={() => add()} block>
                          Add Guest
                        </Button>
                      </>
                    )}
                  </Form.List>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Emergency Contact</h4>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name={['emergencyContact', 'name']}
                          label="Name"
                          rules={[{ required: true, message: 'Emergency contact name is required' }]}
                        >
                          <Input placeholder="Full name" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={['emergencyContact', 'phone']}
                          label="Phone"
                          rules={[{ required: true, message: 'Emergency contact phone is required' }]}
                        >
                          <Input placeholder="Phone number" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name={['emergencyContact', 'relationship']}
                          label="Relationship"
                          rules={[{ required: true, message: 'Relationship is required' }]}
                        >
                          <Input placeholder="e.g., Spouse, Parent" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  <Form.Item
                    label="Special Requests"
                    name="specialRequests"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Any special requests or requirements..."
                    />
                  </Form.Item>

                  {/* Payment Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Selected Items:</span>
                        <span>{selectedItems.length} items</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                        <span>Total Amount:</span>
                        <span className="text-gray-900">
                          ${selectedItems.reduce((sum, item) => sum + item.price, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-orange-600 font-semibold border-t pt-2">
                        <span>Advance Payment (50%):</span>
                        <span className="text-orange-500">
                          ${Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) * 0.5)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 text-sm border-t pt-2">
                        <span>Remaining Amount:</span>
                        <span>
                          ${selectedItems.reduce((sum, item) => sum + item.price, 0) - Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) * 0.5)}
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg mt-3">
                        <p className="text-sm text-blue-800">
                          <strong>Payment Terms:</strong> Pay 50% advance now, remaining 50% can be paid later or in cash.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 h-12 text-lg font-semibold"
                  >
                    Pay 50% Advance - ${Math.round(selectedItems.reduce((sum, item) => sum + item.price, 0) * 0.5)}
                  </Button>
                </Form>
              </Card>
            )}
          </div>

          {/* Interactive Houseboat Map */}
          <div className="lg:col-span-2">
            <Card title="Select Your Cabins & Lounges">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700">🏠 Houseboat Seat Plan Component</h3>
                <p className="text-blue-600">This is the new HouseboatSeatPlan component with 14 cabins and 33 seats across multiple decks.</p>
              </div>
              <HouseboatSeatPlan 
                selectedItems={selectedItems}
                onItemSelection={handleItemSelection}
                houseboatData={houseboatData}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHouseboat;
