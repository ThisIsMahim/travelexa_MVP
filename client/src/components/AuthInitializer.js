import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { SetUser } from '../redux/usersSlice';
import { ShowLoading, HideLoading } from '../redux/alertsSlice';

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");
      
      if (token && userId && !user) {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.get(`/api/users/${userId}`);
          
          if (response.data.success) {
            dispatch(SetUser(response.data.data));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
          }
        } catch (error) {
          // Token is invalid or expired, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
        } finally {
          dispatch(HideLoading());
        }
      }
    };

    initializeAuth();
  }, [dispatch, user]);

  return <>{children}</>;
}

export default AuthInitializer;
