import React from 'react';
import { reduxForm } from 'redux-form';
import { required, password } from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button, IconTitle } from '../../components';
import { ICONS } from '../../config/constants';

const FormValues = {
  email: {
    type: 'email',
    label: 'Email',
    placeholder: 'Type your email',
    validate: [required],
  },
  password: {
    type: 'password',
    label: 'Password',
    placeholder: 'Type ypur password',
    validate: [required, password],
  }
};

const Form = (props) => {
  const { handleSubmit, submitting, pristine, error, valid, children } = props;
  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="w-100">
        {renderFields(FormValues)}
        {error && <div className="warning_text">{error}</div>}
      </div>
      <Button
        label="Login"
        disabled={pristine || submitting || !valid}
      />
    </form>
  );
}

export default reduxForm({
  form: 'LoginForm',
})(Form);
