const loginFields = [
  {
    labelText: 'Email address',
    labelFor: 'email-address',
    id: 'emailAddress',
    name: 'email',
    type: 'text',
    autoComplete: 'email',
    isRequired: true,
    placeholder: 'Email address'
  },
  {
    labelText: 'Password',
    labelFor: 'password',
    id: 'password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    isRequired: true,
    placeholder: 'Password'
  }
];

const activeAccountFields = [
  {
    labelText: 'Email address',
    labelFor: 'email-address',
    id: 'emailAddress',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    isRequired: true,
    placeholder: 'Email address'
  },
  {
    labelText: 'Password',
    labelFor: 'password',
    id: 'password',
    name: 'password',
    type: 'password',
    autoComplete: 'current-password',
    isRequired: true,
    placeholder: 'Password'
  },
  {
    labelText: 'Confirm Password',
    labelFor: 'confirm-password',
    id: 'confirmPassword',
    name: 'confirm-password',
    type: 'password',
    autoComplete: 'confirm-password',
    isRequired: true,
    placeholder: 'Confirm Password'
  }
];


const resetPasswordFields = [
  {
    labelText: 'Email address',
    labelFor: 'email-address',
    id: 'emailAddress',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    isRequired: true,
    placeholder: 'Email address'
  },
  {
    labelText: 'Phone Number',
    labelFor: 'Phone Number',
    id: 'phone',
    name: 'phone',
    type: 'phone',
    autoComplete: 'Phone Number',
    isRequired: true,
    placeholder: 'Phone Number'
  },
];

export { loginFields, activeAccountFields, resetPasswordFields };
