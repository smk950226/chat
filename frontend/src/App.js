import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as authActions from './store/actions/auth';
import * as navActions from './store/actions/nav';
import BaseRouter from './routes';
import Sidepanel from './containers/Sidepanel';
import Profile from './containers/Profile';
import AddChatModal from './containers/Popup';

class App extends React.Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        return(
            <Router>
                <div id="frame">
                    <Sidepanel />
                    <div className="content">
                        <AddChatModal isVisible={this.props.showAddChatPopup} close={() => this.props.closeAddChatPopup()}/>
                        <Profile />
                        <BaseRouter />
                    </div>
                </div>
            </Router>
        );
    };
}

const mapStateToProps = state => {
    return {
        showAddChatPopup: state.nav.showAddChatPopup,
        authenticated: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(authActions.authCheckState()),
        closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);