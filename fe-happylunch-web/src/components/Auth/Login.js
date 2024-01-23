import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { loginFields } from '../../constants/formFields';
import Input from '../Auth/LoginInput';
import FormExtra from '../Auth/LoginFormExtra';
import FormAction from '../Auth/LoginFormAction';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import { UserContext } from '../../store/UserContext';
import { pushDataFromLocalToDatabase } from '../../utils/pushLocalToDB';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);
  const navigate = useNavigate();
  const { loginContext, user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle authent
      authenticateUser();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const authenticateUser = async () => {
    setLoading(true);
    try {
      const authService = new AuthService();
      const response = await authService.signinCustomer(
        loginState.emailAddress,
        loginState.password
      );

      if (response && response.code === 200) {
        loginContext(response.response.data);
        toast.success('Authentication successful');
        await new Promise((resolve) => setTimeout(resolve, 500));
        await pushDataFromLocalToDatabase(response.response.data);
        if (sessionStorage.getItem('pathCart')) {
          navigate(-1);
        } else {
          navigate('/');
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let result = true;
    if (loginState.username === '' || loginFields.username === null) {
      result = false;
      toast.warning('Please enter username');
    } else if (loginState.password.length < 8) {
      result = false;
      toast.warning('Please enter password more than 8 characters');
    }
    return result;
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="sr-only">
                {field.labelText}
              </label>
              <div className="relative">
                <Input
                  handleChange={handleChange}
                  value={loginState[field.id]}
                  id={field.id}
                  name={field.name}
                  type={showPassword ? 'text' : field.type}
                  required={field.isRequired}
                  placeholder={field.placeholder}
                  className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
                />
                {field.id === 'password' && (
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer z-10"
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined className="text-gray-500" />
                    ) : (
                      <EyeOutlined className="text-gray-500" />
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <FormAction
          loading={loading}
          handleSubmit={handleSubmit}
          text={loading === true ? 'Logging...' : 'Login'}
        />
        <FormExtra />
      </form>
      <ToastContainer />
    </>
  );
}
