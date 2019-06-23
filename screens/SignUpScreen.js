import React from 'react';
import { Spinner, Text, Container, Content, Button, Item, Icon, Input, Root } from "native-base";
import MessagesManager from '../utils/MessagesManager';
import DataManager from '../utils/DataManager';
import ApiClient from '../utils/ApiClient';
import {AppLoading} from 'expo';

export default class SignUpScreen extends React.Component {

    CurrentState = Object.freeze({
        EnteringPhoneNumber: Symbol("NumberNotEntered"),
        EnteringCode: Symbol("PhoneNumberEntered"),
        Validating: Symbol("Validating")
    });

    activationCode = null;
    phoneNumber = null;

    constructor(props) {
        super(props);
        this.state = {
            currentState: this.CurrentState.EnteringPhoneNumber,
            phoneNumberValid: false,
            codeValid: false,
            text: '',
            loading: true
        };
    }

    componentWillMount() {
        DataManager.isLoggedIn().then((loggedIn) => {
            if (loggedIn) {
                this.props.navigation.navigate('VerifyConnection');
            } else {
                this.setState({ loading: false });
            }
        });
    }

    render() {
        if (this.state.loading === true) {
            return this._loadingView();
        } else if (this.state.currentState === this.CurrentState.EnteringPhoneNumber) {
            return this._enterPhoneNumberView();
        } else if (this.state.currentState === this.CurrentState.EnteringCode) {
            return this._enterCodeView();
        } else if (this.state.currentState === this.CurrentState.Validating) {
            return this._loadingView();
        }
    }

    _enterPhoneNumberView() {
        return (
            <Container>
                <Content>
                    <Item>
                        <Input placeholder='Ingrese numero de telefono'
                            value={this.state.text} onChangeText={(text) => this.setState({ text })} />
                        <Button iconLeft onPress={this._onSendSmsButtonClick} >
                            <Icon type='FontAwesome' name='phone' />
                            <Text>Enviar</Text>
                        </Button>
                    </Item>
                </Content>
            </Container>);
    }

    _enterCodeView() {
        return (<Container>
            <Content>
                <Item>
                    <Input placeholder='Ingrese codigo de activacion'
                        value={this.state.text} onChangeText={(text) => this.setState({ text })} />
                    <Button iconLeft onPress={this._onCheckCodeButtonClick}>
                        <Icon type='FontAwesome' name='check' />
                        <Text>Comprobar</Text>
                    </Button>
                </Item>
            </Content>
        </Container>);
    }

    _loadingView() {
        return (
            <Root>
                <AppLoading />
            </Root>
        );
    }

    _callGetActivationCode() {
        this.phoneNumber = this.state.text;
        const client = new ApiClient();
        client.getActivationCode(this.phoneNumber).then((response) => {
            if (response) {
                response.json().then((json) => {
                    if (json && json.activationCode) {
                        this._setActivationCode(json.activationCode);
                    }
                });
            }
        });
        this.setState({
            currentState: this.CurrentState.EnteringCode,
            phoneNumberValid: true,
            codeValid: false,
            text: ''
        });
    }

    _onSendSmsButtonClick = () => {
        this._callGetActivationCode();
    }

    _setActivationCode(activationCode) {
        console.log('activationCode', activationCode);
        this.activationCode = activationCode;
    }

    _onCheckCodeButtonClick = () => {
        if (this.state.text === this.activationCode) {
            console.log('code checked');
            this.setState({ currentState: this.CurrentState.Validating });
            const client = new ApiClient();
            client.activateAccount(this.phoneNumber, this.activationCode)
                .then((response) => {
                    console.log('response', response);
                    if (response) {
                        return response.json();
                    } else {
                        throw new Error('No activateAccount response');
                    }
                })
                .then((json) => {
                    console.log('json', json);
                    if (json && json.code) {
                        return client.signIn(this.phoneNumber, json.code);
                    } else {
                        throw new Error('Invalid activateAccount data');
                    }
                })
                .then((response) => {
                    console.log('response', response);
                    if (response) {
                        return response.json();
                    } else {
                        throw new Error('No SignIn response');
                    }
                })
                .then(async (json) => {
                    console.log('json', json);
                    if (json.phoneNumber && json.token) {
                        await DataManager.setPhoneNumber(json.phoneNumber);
                        await DataManager.setToken(json.token);
                        console.log('okokokokokokokokkokokokokokokokokokokokokokokok');
                    } else {
                        throw new Error('Invalid signIn response');
                    }
                }).catch((error) => {
                    console.log('Error', error);
                });
        }
    }
}
