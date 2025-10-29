import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Modal, Form, Select, Button, Input, Tag } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

function AdminPackageOrders() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/packages/admin/bookings?limit=100');
      setOrders(data.data);
    } catch (error) {
      message.error('Error fetching package orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
    });
    setIsModalVisible(true);
  };

  const handleUpdateOrder = async () => {
    try {
      const values = await form.validateFields();
      
      dispatch(ShowLoading());
      
      await axiosInstance.put(`/api/packages/admin/bookings/${selectedOrder._id}`, values);
      message.success('Order updated successfully');
      
      setIsModalVisible(false);
      form.resetFields();
      fetchOrders();
    } catch (error) {
      message.error('Error updating order');
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedOrder(null);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Package Orders</h1>
        <div className="text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.bookingReference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover mr-3"
                        src={order.packageId?.images?.[0]}
                        alt={order.packageTitle}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.packageTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.packageId?.destination}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.userId?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.travelDate).toLocaleDateString()}
                    </div>
                    {order.returnDate && (
                      <div className="text-sm text-gray-500">
                        Return: {new Date(order.returnDate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.guestCount} guests
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${order.packagePrice} per person
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tag color={getStatusColor(order.status)}>
                      {order.status}
                    </Tag>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tag color={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Tag>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <EditOutlined className="mr-1" />
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No package orders found</h3>
            <p className="text-gray-500">Package orders will appear here when customers make bookings.</p>
          </div>
        )}
      </div>

      <Modal
        title={`Order Details - ${selectedOrder?.bookingReference}`}
        open={isModalVisible}
        onOk={handleUpdateOrder}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateOrder}>
            Update Order
          </Button>,
        ]}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Booking Reference:</span> {selectedOrder.bookingReference}</div>
                  <div><span className="font-medium">Package:</span> {selectedOrder.packageTitle}</div>
                  <div><span className="font-medium">Travel Date:</span> {new Date(selectedOrder.travelDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Guests:</span> {selectedOrder.guestCount}</div>
                  <div><span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount}</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedOrder.userId?.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedOrder.userId?.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedOrder.userId?.phone}</div>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Guest Details</h4>
              <div className="space-y-2">
                {selectedOrder.guestDetails?.map((guest, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Name:</span> {guest.name}</div>
                      <div><span className="font-medium">Age:</span> {guest.age}</div>
                      <div><span className="font-medium">Gender:</span> {guest.gender}</div>
                      <div><span className="font-medium">Phone:</span> {guest.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Emergency Contact</h4>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="font-medium">Name:</span> {selectedOrder.emergencyContact?.name}</div>
                  <div><span className="font-medium">Phone:</span> {selectedOrder.emergencyContact?.phone}</div>
                  <div><span className="font-medium">Relationship:</span> {selectedOrder.emergencyContact?.relationship}</div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {selectedOrder.specialRequests && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  {selectedOrder.specialRequests}
                </div>
              </div>
            )}

            {/* Update Form */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-4">Update Order Status</h4>
              <Form form={form} layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="status"
                    label="Order Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select placeholder="Select status">
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
                  <TextArea rows={3} placeholder="Add any notes about this order" />
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AdminPackageOrders;
