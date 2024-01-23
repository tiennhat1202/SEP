import React from 'react';
import { useState } from 'react';
import { resetPasswordFields } from '../../constants/formFields';
import FormAction from './LoginFormAction';
import Input from './LoginInput';
import AuthService from '../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';

const fields = resetPasswordFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ''));

export default function ResetPassword() {
  const [resetPassState, setResetPassState] = useState(fieldsState);
  const authService = new AuthService();
  const handleChange = (e) =>
    setResetPassState({ ...resetPassState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

  const resetPassword = async () => {
    try {
      const response = await authService.resetCustomerPassword(
        resetPassState.emailAddress,
        resetPassState.phone
      );
      if (response && response.code === 200) {
        toast.success(response.response.data);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={resetPassState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          <FormAction handleSubmit={handleSubmit} text="Reset Password" />
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
