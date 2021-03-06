import React from 'react';
import { Spinner, Text, Container, Content, Button } from "native-base";
import MessagesManager from '../utils/MessagesManager';
import DataManager from '../utils/DataManager';

export default class VerifyConnectionScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            socketConnected: false,
            error: false
        }
    }

    componentDidMount() {
        DataManager.getToken().then((token) => {
            if (token) {
                MessagesManager.connect({token});
                MessagesManager.eventEmitter.on('connected', () => {this._onConnected()});
                MessagesManager.eventEmitter.on('disconnected', () => {this._onDisconnected()});
            } else {
                this.setState({error: true});
            }
        });
    }

    render() {
        if (this.state.socketConnected && !this.state.error) {
            return this._loadingView();
        } else if (!this.state.socketConnected && !this.state.error) {
            return this._loadingView();
        } else {
            return this._errorView();
        }
    }

    _loadingView() {
        return (
            <Container>
                <Content>
                    <Spinner color='blue' />
                    <Text style={{ textAlign: "center" }}>Cargando</Text>
                </Content>
            </Container>

        );
    }

    _errorView() {
        return (
            <Container>
                <Content>
                    <Spinner color='blue' />
                    <Text style={{ textAlign: "center" }}>Error conectando al servidor, Reconectando...</Text>
                    <Button></Button>
                </Content>
            </Container>
        );
    }

    _onConnected() {
        console.log('onConnected');
        this.setState({ socketConnected: true, error: false });
        this.props.navigation.navigate('App');
    }

    _onDisconnected() {
        this.setState({ socketConnected: false, error: true });
    }
}
