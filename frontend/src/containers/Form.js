import React from 'react';
import axios from 'axios';
import {
    Form, Icon, Input, Button, Select
  } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
  
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
            usernames: value
        })
    }

    componentDidMount() {
      this.props.form.validateFields();
    }
  
    handleSubmit = (e) => {
      e.preventDefault();
      const { usernames } = this.state;
      this.props.form.validateFields((err, values) => {
        if (!err) {
            const combinedUsers = [...usernames, this.props.username];
            axios.defaults.headers = {
                "Content-Type": 'application/json',
                "Authorization": `Token ${this.props.token}`
            };
            axios.post("http://127.0.0.1:8000/chat/create/", {
                messages: [],
                participants: combinedUsers
            })
            .then(res => {
                this.props.history.push(`/${res.data.id}`);
                this.props.closeAddChatPopup();
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    error: err
                })
            })
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
        {this.state.error ? `${this.state.error}` : null}
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

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
        getUserChats: (username, token) => {
            dispatch(messageActions.getUserChats(username, token));
        }
    }
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddChatForm));