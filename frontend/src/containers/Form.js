import React from 'react';
import {
    Form, Icon, Input, Button, Select
  } from 'antd';
  
  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  
  class HorizontalAddChatForm extends React.Component {
    state = {
        usernames: [],
        error: null
    };

    handleChange = value => {
        this.setState({
            usrenames: value
        })
    }

    componentDidMount() {
      this.props.form.validateFields();
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    }
  
    render() {
      const {
        getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
      } = this.props.form;
  
      // Only show error after a field is touched.
      const userNameError = isFieldTouched('userName') && getFieldError('userName');
      return (
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item
            validateStatus={userNameError ? 'error' : ''}
            help={userNameError || ''}
          >
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
                <Select mode="tags" style={{width: "100%"}} placeholder="Add a user" onChange={this.handleChange}>{[]}</Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Start a chat
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
  
  const AddChatForm = Form.create({ name: 'horizontal_login' })(HorizontalAddChatForm);
  
export default AddChatForm;