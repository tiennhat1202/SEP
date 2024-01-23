import React from 'react';
import { useEffect, useState } from 'react';
import { decodeAccessToken } from '../../utils/jwtDecode';
import AuthService from '../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import CouterNavbar from '../Counter/Navbar';

function CounterChangePassword() {
  const fixedInputClass =
    'rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-blue-500 focus:z-10 sm:text-sm';
  const fixedButtonClass =
    'rounded-md appearance-none relative block w-full px-3 py-2 focus:z-10 sm:text-sm bg-blue-600 text-white font-bold';
  const error_massage = 'text-red-500 text-xs';
  useEffect(() => {
    document.title = 'Change Password';
  }, []);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [storageEmail, setStorageEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const errorMessageOldPw = document.getElementById('error_message_old');
      const errorMessageNewPw = document.getElementById('error_message_new');
      const errorMessageConfirmPw = document.getElementById('error_message_cf');
      const inputOldPassword = document.getElementById('oldPassword');
      const inputNewPassword = document.getElementById('newPassword');
      const inputCfPassword = document.getElementById('confirmPassword');

      if (oldPassword.length < 8 && oldPassword != '') {
        inputOldPassword.classList.add('border-red-500');
        errorMessageOldPw.style.display = 'block';
        errorMessageOldPw.innerText = 'Input Must Be at least 8 characters';
      } else {
        inputOldPassword.classList.remove('border-red-500');
        errorMessageOldPw.style.display = 'none';
      }
      if (newPassword.length < 8 && newPassword != '') {
        inputNewPassword.classList.add('border-red-500');
        errorMessageNewPw.style.display = 'block';
        errorMessageNewPw.innerText = 'Input Must Be at least 8 characters';
      } else {
        inputNewPassword.classList.remove('border-red-500');
        errorMessageNewPw.style.display = 'none';
      }
      if (confirmPassword.length < 8 && confirmPassword != '') {
        inputCfPassword.classList.add('border-red-500');
        errorMessageConfirmPw.style.display = 'block';
        errorMessageConfirmPw.innerText = 'Input Must Be at least 8 characters';
      } else {
        inputCfPassword.classList.remove('border-red-500');
        errorMessageConfirmPw.style.display = 'none';
      }

      if (confirmPassword !== newPassword && confirmPassword != '') {
        inputCfPassword.classList.add('border-red-500');
        errorMessageConfirmPw.style.display = 'block';
        errorMessageConfirmPw.innerText = 'Confirm Password Not Matched';
      } else {
        inputCfPassword.classList.remove('border-red-500');
        errorMessageConfirmPw.style.display = 'none';
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [oldPassword, newPassword, confirmPassword]);

  useEffect(() => {
    const decodedToken = decodeAccessToken();
    if (decodedToken && decodedToken.name) {
      setStorageEmail(decodedToken.name);
      const userId = decodedToken ? decodedToken.UserId : null;
      setUserId(userId);
    }
  }, []);

  const formData = {
    userId: userId,
    oldPassword,
    newPassword,
    confirmPassword,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword();
  };

  const changePassword = async () => {
    try {
      const authService = new AuthService();
      const response = await authService.changePasswordUser(
        formData.userId,
        formData.oldPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      if (response.code === 200) {
        toast.success('Change password successfully!');
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <CouterNavbar />
      <div className="min-h-[92vh] bg-gray-100">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h2 className="text-xl text-gray-800 font-bold sm:text-3xl dark:text-white">
                Change Password
              </h2>
            </div>
            <div className="mt-5 p-4 relative z-1 bg-white border rounded-xl sm:mt-10 md:p-10 dark:bg-gray-800 dark:border-gray-700">
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="-space-y-px">
                  <input
                    readOnly
                    className={fixedInputClass}
                    type="email"
                    required={true}
                    placeholder="Email Address"
                    defaultValue={storageEmail}
                  />
                </div>
                <div className="-space-y-px">
                  <input
                    id="oldPassword"
                    className={fixedInputClass}
                    type="password"
                    required={true}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Old Password"
                  />
                  <span className={error_massage} id="error_message_old"></span>
                </div>
                <div className="-space-y-px">
                  <input
                    id="newPassword"
                    className={fixedInputClass}
                    type="password"
                    required={true}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                  <span className={error_massage} id="error_message_new"></span>
                </div>
                <div className="-space-y-px">
                  <input
                    id="confirmPassword"
                    className={fixedInputClass}
                    type="password"
                    required={true}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                  />
                  <span className={error_massage} id="error_message_cf"></span>
                </div>

                <button id="btn-submit" className={fixedButtonClass}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
export default CounterChangePassword;
