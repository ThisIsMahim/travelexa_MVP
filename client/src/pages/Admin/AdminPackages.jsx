import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Modal, Form, Input, Select, Button, Upload, InputNumber, DatePicker, Card, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

function AdminPackages() {
  const dispatch = useDispatch();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/packages?limit=100');
      setPackages(data.data);
    } catch (error) {
      message.error('Error fetching packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = () => {
    setEditingPackage(null);
    form.resetFields();
    // Set default itinerary with one day
    form.setFieldsValue({
      itinerary: [
        {
          day: 1,
          title: "Day 1",
          description: "Enter day description",
          activities: ["Activity 1", "Activity 2"]
        }
      ]
    });
    setIsModalVisible(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    form.setFieldsValue({
      ...pkg,
      travelDate: pkg.travelDate ? moment(pkg.travelDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDeletePackage = async (id) => {
    try {
      dispatch(ShowLoading());
      await axiosInstance.delete(`/api/packages/${id}`);
      message.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      message.error('Error deleting package');
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      dispatch(ShowLoading());
      
      if (editingPackage) {
        await axiosInstance.put(`/api/packages/${editingPackage._id}`, values);
        message.success('Package updated successfully');
      } else {
        await axiosInstance.post('/api/packages', values);
        message.success('Package created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchPackages();
    } catch (error) {
      message.error('Error saving package');
    } finally {
      dispatch(HideLoading());
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <img 
          src={images[0]} 
          alt="Package" 
          className="w-16 h-16 object-cover rounded-lg"
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <div>
          <div className="font-bold text-orange-500">${price}</div>
          {record.originalPrice && (
            <div className="text-sm text-gray-500 line-through">${record.originalPrice}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditPackage(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeletePackage(record._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreatePackage}
          className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600"
        >
          Add New Package
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={pkg.images[0]} 
                    alt="Package" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{pkg.destination}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {pkg.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-orange-500">${pkg.price}</div>
                  {pkg.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">${pkg.originalPrice}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{pkg.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingPackage ? 'Edit Package' : 'Create New Package'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {editingPackage ? 'Update' : 'Create'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Package Title"
              rules={[{ required: true, message: 'Please enter package title' }]}
            >
              <Input placeholder="Enter package title" />
            </Form.Item>

            <Form.Item
              name="destination"
              label="Destination"
              rules={[{ required: true, message: 'Please enter destination' }]}
            >
              <Input placeholder="Enter destination" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select category">
                <Option value="Adventure">Adventure</Option>
                <Option value="Beach">Beach</Option>
                <Option value="Mountain">Mountain</Option>
                <Option value="Cultural">Cultural</Option>
                <Option value="City">City</Option>
                <Option value="Wildlife">Wildlife</Option>
                <Option value="Religious">Religious</Option>
                <Option value="Honeymoon">Honeymoon</Option>
                <Option value="Family">Family</Option>
                <Option value="Solo">Solo</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="difficulty"
              label="Difficulty Level"
              rules={[{ required: true, message: 'Please select difficulty' }]}
            >
              <Select placeholder="Select difficulty">
                <Option value="Easy">Easy</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Hard">Hard</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price ($)"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                placeholder="Enter price"
                className="w-full"
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="originalPrice"
              label="Original Price ($)"
            >
              <InputNumber
                placeholder="Enter original price"
                className="w-full"
                min={0}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration"
              rules={[{ required: true, message: 'Please enter duration' }]}
            >
              <Input placeholder="e.g., 3 Days 2 Nights" />
            </Form.Item>

            <Form.Item
              name="maxGuests"
              label="Max Guests"
              rules={[{ required: true, message: 'Please enter max guests' }]}
            >
              <InputNumber
                placeholder="Enter max guests"
                className="w-full"
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="minGuests"
              label="Min Guests"
              rules={[{ required: true, message: 'Please enter min guests' }]}
            >
              <InputNumber
                placeholder="Enter min guests"
                className="w-full"
                min={1}
              />
            </Form.Item>

            <Form.Item
              name="bestTimeToVisit"
              label="Best Time to Visit"
              rules={[{ required: true, message: 'Please enter best time to visit' }]}
            >
              <Input placeholder="e.g., March to May" />
            </Form.Item>
          </div>

          <Form.Item
            name="shortDescription"
            label="Short Description"
            rules={[{ required: true, message: 'Please enter short description' }]}
          >
            <TextArea rows={2} placeholder="Enter short description" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter detailed description" />
          </Form.Item>

          <Form.Item
            name="images"
            label="Package Images (URLs)"
            rules={[{ required: true, message: 'Please enter at least one image URL' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter image URLs (press Enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="includes"
            label="What's Included"
            rules={[{ required: true, message: 'Please enter inclusions' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter inclusions (press Enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="excludes"
            label="What's Not Included"
          >
            <Select
              mode="tags"
              placeholder="Enter exclusions (press Enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="highlights"
            label="Package Highlights"
            rules={[{ required: true, message: 'Please enter highlights' }]}
          >
            <Select
              mode="tags"
              placeholder="Enter highlights (press Enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.List name="itinerary">
            {(fields, { add, remove }) => (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Itinerary</h4>
                  <Button type="dashed" onClick={() => add()} className="w-full">
                    Add Day
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium">Day {name + 1}</h5>
                      {fields.length > 1 && (
                        <Button type="link" danger onClick={() => remove(name)}>
                          Remove
                        </Button>
                      )}
                    </div>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'day']}
                          label="Day Number"
                          rules={[{ required: true, message: 'Please enter day number' }]}
                        >
                          <InputNumber placeholder="1" min={1} className="w-full" />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="Day Title"
                          rules={[{ required: true, message: 'Please enter day title' }]}
                        >
                          <Input placeholder="Enter day title" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          label="Description"
                          rules={[{ required: true, message: 'Please enter description' }]}
                        >
                          <TextArea rows={2} placeholder="Enter day description" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'activities']}
                          label="Activities"
                          rules={[{ required: true, message: 'Please enter activities' }]}
                        >
                          <Select
                            mode="tags"
                            placeholder="Enter activities (press Enter to add)"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item
            name="cancellationPolicy"
            label="Cancellation Policy"
            rules={[{ required: true, message: 'Please enter cancellation policy' }]}
          >
            <TextArea rows={3} placeholder="Enter cancellation policy" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="isActive"
              label="Status"
              valuePropName="checked"
            >
              <input type="checkbox" className="mr-2" />
              Active Package
            </Form.Item>

            <Form.Item
              name="isFeatured"
              label="Featured"
              valuePropName="checked"
            >
              <input type="checkbox" className="mr-2" />
              Featured Package
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminPackages;
