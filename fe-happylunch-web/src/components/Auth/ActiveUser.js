import React from 'react';
import { useState } from 'react';
import { activeAccountFields } from '../../constants/formFields';
import FormAction from './LoginFormAction';
import Input from './LoginInput';
import AuthService from '../../services/AuthService';
import { ToastContainer, toast } from 'react-toastify';

const fields = activeAccountFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ''));

export default function ActiveAccountUser() {
  const [signupState, setSignupState] = useState(fieldsState);
  const authService = new AuthService();
  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    activeAccount();
  };

  //handle Signup API Integration here
  const activeAccount = async () => {
    try {
      const response = await authService.activeAccountUser(
        signupState.emailAddress,
        signupState.password,
        signupState.confirmPassword
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
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          <FormAction handleSubmit={handleSubmit} text="Activated" />
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
