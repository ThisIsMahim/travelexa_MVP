import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table, Modal, Form, Select, Button, Tag, Input } from "antd";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import PageTitle from "../../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/get-all-bookings`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    form.setFieldsValue({
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
    });
    setIsModalVisible(true);
  };

  const handleUpdateBooking = async () => {
    try {
      const values = await form.validateFields();
      
      dispatch(ShowLoading());
      
      await axiosInstance.put(`/api/bookings/${selectedBooking._id}`, values);
      message.success('Booking updated successfully');
      
      setIsModalVisible(false);
      form.resetFields();
      getBookings();
    } catch (error) {
      message.error('Error updating booking');
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Booked':
        return 'blue';
      case 'Confirmed':
        return 'green';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Paid':
        return 'green';
      case 'Advance_Paid':
        return 'blue';
      case 'Failed':
        return 'red';
      case 'Refunded':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Full Name",
      dataIndex: "user",
      render: (user) => `${user.name}`,
    },

    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `$${amount}`,
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      render: (status) => <Tag color={getPaymentStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewBooking(record)}
          >
            View/Edit
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <>
      <Helmet>
        <title>User Bookings</title>
      </Helmet>
      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />
      </div>

      <Modal
        title={`Booking Details - ${selectedBooking?.name}`}
        open={isModalVisible}
        onOk={handleUpdateBooking}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateBooking}>
            Update Booking
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Bus Name:</span> {selectedBooking.name}</div>
                  <div><span className="font-medium">Route:</span> {selectedBooking.from} - {selectedBooking.to}</div>
                  <div><span className="font-medium">Journey Date:</span> {moment(selectedBooking.journeyDate).format('DD/MM/YYYY')}</div>
                  <div><span className="font-medium">Seats:</span> {selectedBooking.seats.join(", ")}</div>
                  <div><span className="font-medium">Amount:</span> ${selectedBooking.amount}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedBooking.user?.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedBooking.user?.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedBooking.user?.phone}</div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {selectedBooking.advanceAmount > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div><span className="font-medium">Advance Amount:</span> ${selectedBooking.advanceAmount}</div>
                    <div><span className="font-medium">Remaining Amount:</span> ${selectedBooking.remainingAmount}</div>
                    <div><span className="font-medium">Payment Method:</span> {selectedBooking.paymentMethod}</div>
                    <div><span className="font-medium">Transaction ID:</span> {selectedBooking.transactionId}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Update Form */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-4">Update Booking Status</h4>
              <Form form={form} layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="bookingStatus"
                    label="Booking Status"
                    rules={[{ required: true, message: 'Please select booking status' }]}
                  >
                    <Select placeholder="Select booking status">
                      <Option value="Pending">Pending</Option>
                      <Option value="Booked">Booked</Option>
                      <Option value="Confirmed">Confirmed</Option>
                      <Option value="Cancelled">Cancelled</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="paymentStatus"
                    label="Payment Status"
                    rules={[{ required: true, message: 'Please select payment status' }]}
                  >
                    <Select placeholder="Select payment status">
                      <Option value="Pending">Pending</Option>
                      <Option value="Paid">Paid</Option>
                      <Option value="Advance_Paid">Advance Paid</Option>
                      <Option value="Failed">Failed</Option>
                      <Option value="Refunded">Refunded</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  name="notes"
                  label="Notes"
                >
                  <TextArea rows={3} placeholder="Add any notes about this booking" />
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default AdminBookings;
