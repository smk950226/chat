import React from 'react';
import { Modal } from 'antd';

class AddChatModal extends React.Component {
  render() {
    return (
        <Modal
          centered="20px to Top"
          footer={null}
          visible={this.props.isVisible}
          onCancel={this.props.close}
        >
            dummy
        </Modal>
    );
  }
}

export default AddChatModal;