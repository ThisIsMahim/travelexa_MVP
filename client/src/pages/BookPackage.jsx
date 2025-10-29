import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { message, Form, Input, Select, DatePicker, Button, Card, Row, Col } from "antd";
import PaymentOptions from "../components/PaymentOptions";
import { Helmet } from "react-helmet";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

function BookPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState('full');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/api/packages/${id}`);
      setPackageData(data.data);
    } catch (error) {
      message.error('Error fetching package details');
      navigate('/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (values) => {
    try {
      dispatch(ShowLoading());
      
      const totalAmount = packageData.price * values.guestCount;
      const paymentAmount = paymentOption === 'advance' ? totalAmount * 0.5 : totalAmount;
      
      const bookingData = {
        packageId: id,
        guestCount: values.guestCount,
        travelDate: values.travelDate.format('YYYY-MM-DD'),
        returnDate: values.returnDate ? values.returnDate.format('YYYY-MM-DD') : null,
        guestDetails: values.guestDetails,
        emergencyContact: values.emergencyContact,
        specialRequests: values.specialRequests,
        paymentOption: paymentOption,
        totalAmount: totalAmount,
        paymentAmount: paymentAmount,
      };

      const { data } = await axiosInstance.post('/api/packages/book', bookingData);
      
      if (data.success) {
        if (data.data.gatewayPageURL) {
          // Redirect to payment gateway
          window.location.href = data.data.gatewayPageURL;
        } else {
          message.success('Package booked successfully!');
          navigate('/bookings');
        }
      } else {
        message.error(data.message || 'Error booking package');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Error booking package');
    } finally {
      dispatch(HideLoading());
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {packageData.title} - A & N Travel and Tours</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Package Details */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <div className="space-y-4">
                  <img
                    src={packageData.images[0]}
                    alt={packageData.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {packageData.title}
                    </h1>
                    <p className="text-gray-600 mb-4">{packageData.shortDescription}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-orange-500">
                          ${packageData.price}
                        </span>
                        {packageData.originalPrice && (
                          <span className="text-xl text-gray-500 line-through">
                            ${packageData.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">
                          {packageData.rating} ({packageData.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>📍 {packageData.destination}</div>
                      <div>⏱️ {packageData.duration}</div>
                      <div>👥 Max {packageData.maxGuests} guests</div>
                      <div>🏷️ {packageData.category}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Package Highlights */}
              <Card title="Package Highlights" className="shadow-lg">
                <ul className="space-y-2">
                  {packageData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* What's Included */}
              <Card title="What's Included" className="shadow-lg">
                <ul className="space-y-2">
                  {packageData.includes.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Booking Form */}
            <div>
              <Card title="Book This Package" className="shadow-lg">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleBooking}
                  initialValues={{
                    guestCount: 1,
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="guestCount"
                        label="Number of Guests"
                        rules={[
                          { required: true, message: 'Please select number of guests' },
                          { 
                            type: 'number', 
                            min: packageData.minGuests, 
                            max: packageData.maxGuests,
                            message: `Must be between ${packageData.minGuests} and ${packageData.maxGuests} guests`
                          }
                        ]}
                      >
                        <Select placeholder="Select number of guests">
                          {Array.from({ length: packageData.maxGuests }, (_, i) => i + 1).map(num => (
                            <Option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="travelDate"
                        label="Travel Date"
                        rules={[{ required: true, message: 'Please select travel date' }]}
                      >
                        <DatePicker
                          className="w-full"
                          disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="returnDate"
                    label="Return Date (Optional)"
                  >
                    <DatePicker
                      className="w-full"
                      disabledDate={(current) => current && current < moment().startOf('day')}
                    />
                  </Form.Item>

                  <Form.List name="guestDetails">
                    {(fields, { add, remove }) => (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-semibold">Guest Details</h4>
                          <Button type="dashed" onClick={() => add()} className="w-full">
                            Add Guest
                          </Button>
                        </div>
                        {fields.map(({ key, name, ...restField }) => (
                          <Card key={key} size="small" className="mb-4">
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="font-medium">Guest {name + 1}</h5>
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
                                  rules={[{ required: true, message: 'Please enter guest name' }]}
                                >
                                  <Input placeholder="Enter full name" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'age']}
                                  label="Age"
                                  rules={[{ required: true, message: 'Please enter age' }]}
                                >
                                  <Input type="number" placeholder="Enter age" />
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'gender']}
                                  label="Gender"
                                  rules={[{ required: true, message: 'Please select gender' }]}
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
                                  rules={[{ required: true, message: 'Please enter phone number' }]}
                                >
                                  <Input placeholder="Enter phone number" />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'email']}
                                  label="Email"
                                  rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                  ]}
                                >
                                  <Input placeholder="Enter email address" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </>
                    )}
                  </Form.List>

                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4">Emergency Contact</h4>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={['emergencyContact', 'name']}
                          label="Contact Name"
                          rules={[{ required: true, message: 'Please enter emergency contact name' }]}
                        >
                          <Input placeholder="Enter contact name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={['emergencyContact', 'phone']}
                          label="Contact Phone"
                          rules={[{ required: true, message: 'Please enter emergency contact phone' }]}
                        >
                          <Input placeholder="Enter contact phone" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name={['emergencyContact', 'relationship']}
                          label="Relationship"
                          rules={[{ required: true, message: 'Please enter relationship' }]}
                        >
                          <Input placeholder="e.g., Spouse, Parent, Friend" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>

                  <Form.Item
                    name="specialRequests"
                    label="Special Requests"
                  >
                    <TextArea
                      rows={3}
                      placeholder="Any special requests or dietary requirements?"
                    />
                  </Form.Item>

                  <div className="mb-6">
                    <PaymentOptions
                      totalAmount={packageData.price * (form.getFieldValue('guestCount') || 1)}
                      selectedOption={paymentOption}
                      onOptionChange={setPaymentOption}
                    />
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 h-12 text-lg font-semibold"
                  >
                    {paymentOption === 'advance' ? 'Pay 50% Advance' : 'Pay Full Amount'} - ${paymentOption === 'advance' ? (packageData.price * (form.getFieldValue('guestCount') || 1) * 0.5).toFixed(2) : (packageData.price * (form.getFieldValue('guestCount') || 1)).toFixed(2)}
                  </Button>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookPackage;
