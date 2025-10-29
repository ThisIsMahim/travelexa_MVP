import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";
import { Helmet } from "react-helmet";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});

  const getBusesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const from = filters.from;
    const to = filters.to;
    const journeyDate = filters.journeyDate;
    try {
      const { data } = await axiosInstance.post(
        `/api/buses/get?from=${from}&to=${to}&journeyDate=${journeyDate}`
      );
      setBuses(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  }, [filters, dispatch]);

  useEffect(() => {
    axiosInstance.get("/api/cities").then((response) => {
      setCities(response.data.data);
    });
  }, []);

  useCallback(() => {
    if (filters.from && filters.journeyDate) {
      getBusesByFilter();
    }
  }, [filters.from, filters.journeyDate, getBusesByFilter]);

  // Redirect to dashboard when component mounts
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Show loading while redirecting
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="w-full">
        {/* Search Form */}
        <div className="w-full my-4 lg:my-5 mx-2 p-2 lg:p-4 flex justify-center">
          <div className="w-full max-w-4xl">
            <Row gutter={[16, 16]} align="center">
              <Col xs={24} sm={12} md={8} lg={6}>
                <select
                  className="mb-3 lg:mb-5 select select-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white"
                  value={filters.from || ""}
                  onChange={(e) => {
                    setFilters({ ...filters, from: e.target.value });
                  }}
                >
                  <option value="">Departure Point</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <select
                  className="mb-3 lg:mb-5 select select-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white"
                  value={filters.to || ""}
                  onChange={(e) => {
                    setFilters({ ...filters, to: e.target.value });
                  }}
                >
                  <option value="">Destination</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <input
                  className="mb-3 lg:mb-5 input input-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white"
                  min={new Date().toISOString().split("T")[0]}
                  type="date"
                  placeholder="Date"
                  onChange={(e) => {
                    setFilters({ ...filters, journeyDate: e.target.value });
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={24} lg={6}>
                <div className="flex justify-center lg:justify-start">
                  <button
                    onClick={() => {
                      getBusesByFilter();
                    }}
                    className="relative inline-flex items-center justify-start
                      px-6 lg:px-10 py-2 lg:py-3 overflow-hidden font-bold rounded-full
                      group w-full sm:w-auto"
                  >
                    <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                    <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                    <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white text-sm lg:text-base">
                      Search
                    </span>
                    <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        
        {/* Bus Results */}
        <div className="w-full px-2 lg:px-4">
          <Row gutter={[16, 16]}>
            {buses.map((bus, index) => {
              return (
                <Col key={index} xs={24} sm={24} md={12} lg={24}>
                  <Bus bus={bus} />
                </Col>
              );
            })}
            {buses.length === 0 && (
              <Col span={24}>
                <div className="flex justify-center w-full py-8">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-500 text-center">
                    No boats found to Sundarbans
                  </h1>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}

export default Home;
