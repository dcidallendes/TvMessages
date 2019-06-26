import React from 'react';
import {
  View,
  Card,
  CardItem,
  Container,
  FlatList,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Label,
  Input,
  Body,
  Left,
  List,
  Right,
  ListItem,
  Form,
  Text,
  Root
} from "native-base";
import { Font, AppLoading, WebBrowser } from "expo";

import { GiftedChat, Send } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MessagesManager from '../utils/MessagesManager';
import Message from '../data/Message';

import * as _ from 'lodash';
import DataManager from '../utils/DataManager';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  input;
  listData = [];
  token = null;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      messages: [],
      text: ''
    }
    MessagesManager.eventEmitter.on('messageSent', (message) => { this._onMessageSent(message) });
  }

  componentWillMount() {
    DataManager.getToken().then((token) => {
      if (token) {
        console.log('token', token);
        this.token = token;
      }
    });
    this.setState({ text: '', listData: [...this.listData], loading: false });
  }

  render() {
    if (this.state.loading) {
      return (<Root>
        <AppLoading />
      </Root>);
    }
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>Tv Messenger</Title>
          </Body>
          <Right />
        </Header>
        <GiftedChat
          placeholder='Ingrese un mensaje...'
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderSend={this._renderSend}
          user={{
            _id: 1,
          }}
        />
        <KeyboardSpacer />
      </Container>
    );
  }

  _renderSend(props) {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 15 }}>
            <Text>Enviar</Text>
        </View>
      </Send>
    );
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    messages.forEach(message => {
      this._processOutcomingMessage(message);
    });
  }

  _processOutcomingMessage(chatMessage) {
    const message = new Message();
    message.text = chatMessage.text;
    message.id = chatMessage._id;
    this._pushMessage(message);
  }

  _pushMessage(message) {
    MessagesManager.sendMessage(message);
  }

  _onMessageSent = (message) => {
    console.log('onMessageSent', message);
    const messageIndex = _.findIndex(this.state.messages, {_id: message.id});
    if(messageIndex >= 0) {
      const messages = this.state.messages;
      messages[messageIndex].sent = true;
      this.setState({messages});
    }

  };


}