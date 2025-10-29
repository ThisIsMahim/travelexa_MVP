import React, { useEffect, useMemo, useState } from "react";
import { Table, Modal, Form, Input, message, Switch } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { ShowLoading, HideLoading } from "../../redux/alertsSlice";
import PageTitle from "../../components/PageTitle";
import { Helmet } from "react-helmet";

function AdminCities() {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchCities = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.get("/api/cities");
      setCities(res.data.data || []);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const columns = useMemo(() => [
    { title: "Name", dataIndex: "name" },
    { title: "Region", dataIndex: "region", width: 140 },
    { title: "Active", dataIndex: "active", width: 100, render: (v) => v ? 'Yes' : 'No' },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 140,
      render: (_, record) => (
        <div className="flex gap-3">
          <i
            className="ri-pencil-line cursor-pointer text-xl"
            onClick={() => { setEditing(record); setShowModal(true); }}
          />
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl"
            onClick={() => handleDelete(record)}
          />
        </div>
      )
    }
  ], []);

  const handleDelete = async (record) => {
    try {
      dispatch(ShowLoading());
      await axiosInstance.delete(`/api/cities/${record._id}`);
      message.success("City deleted");
      await fetchCities();
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      dispatch(ShowLoading());
      if (editing) {
        await axiosInstance.put(`/api/cities/${editing._id}`, values);
        message.success("City updated");
      } else {
        await axiosInstance.post(`/api/cities`, values);
        message.success("City added");
      }
      await fetchCities();
      setShowModal(false);
      setEditing(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const importFromJson = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.post(`/api/cities/import-json`);
      dispatch(HideLoading());
      if (res.data.status === 'success') {
        message.success(`Imported ${res.data.count} cities`);
        fetchCities();
      } else {
        message.error('Import failed');
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Cities</title>
      </Helmet>
      <div className="p-7">
        <div className="flex justify-between items-center mb-4">
          <PageTitle title="Source & Destination" />
          <div className="flex gap-3">
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-bold rounded-full group"
              onClick={importFromJson}
            >
              <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
              <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-green-600 opacity-100 group-hover:-translate-x-8"></span>
              <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">Import JSON</span>
              <span className="absolute inset-0 border-2 border-green-600 rounded-full"></span>
            </button>
            <button
              className="relative inline-flex items-center justify-start px-10 py-3 overflow-hidden font-bold rounded-full group"
              onClick={() => { setEditing(null); setShowModal(true); }}
            >
              <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
              <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
              <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
                Add City
              </span>
              <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
            </button>
          </div>
        </div>

        <Table rowKey="_id" columns={columns} dataSource={cities} pagination={{ pageSize: 10 }} />

        <Modal
          title={editing ? "Edit City" : "Add City"}
          visible={showModal}
          onCancel={() => { setShowModal(false); setEditing(null); }}
          footer={false}
          destroyOnClose
        >
          <Form layout="vertical" onFinish={handleSubmit} initialValues={editing || { active: true }}>
            <Form.Item label="City" name="name" rules={[{ required: true, message: "Please enter city" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Region" name="region">
              <Input />
            </Form.Item>
            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
            <div className="flex justify-end">
              <button type="submit" className="relative inline-flex items-center justify-start px-10 py-3 overflow-hidden font-bold rounded-full group">
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">Save</span>
                <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default AdminCities;
