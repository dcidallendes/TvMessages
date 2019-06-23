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
import { Col, Row, Grid } from "react-native-easy-grid";

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

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      text: ''
    }
    MessagesManager.eventEmitter.on('messageSent', (message) => {this._onMessageSent(message)});
  }

  componentDidMount() {
    DataManager.getToken().then((token) => {
      if(token) {
        console.log('token', token);
      }
    });
  }
  
  componentWillMount() {
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

        <Grid>
          <Row size={3}>
          <List
            dataArray={this.state.listData}
            renderRow={m =>
              <ListItem>
                <Left>
                  <Text>
                    {m.text}
                  </Text>
                </Left>
                <Right>
                  {m.sent === true ? <Icon type='FontAwesome' name='check'></Icon> : null}
                  <Text>{m.toString()}</Text>
                </Right>
              </ListItem>}
          />
          </Row>
          <Row size={2}>
            <Content padder>
              <Card>
                <CardItem>
                  <Body>
                      <Input block value={this.state.text} onChangeText={(text) => this.setState({ text })}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onSubmitEditing={this._onAddMessageInput}
                        returnKeyType='send'
                        autoFocus={true}
                        blurOnSubmit={false}
                      />
                    <Button onPress={this._onAddMessageButtonClick} block style={{ margin: 15 }}>
                      <Text>Enviar</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Row>
        </Grid>
      </Container>
    );
  }

  _processOutcomingMessage() {
    if (this.state && this.state.text) {
      const message = new Message();
      message.text = this.state.text;
      const data = this.state.listData;
      data.push(message);
      this.setState({listData: data, text: ''});
      //this.forceUpdate();
      this._pushMessage(message);
    }
  }

  _pushMessage(message) {
    MessagesManager.sendMessage(message);
  }

  _onAddMessageInput = (event) => {
    this._processOutcomingMessage();
  }
  _onAddMessageButtonClick = () => {
    this._processOutcomingMessage();
  };

  _onMessageSent = (message) => {
    console.log('onMessageSent');
    var messageIndex = _.findIndex(this.state.listData, {id: message.id});
    if (messageIndex >= 0) {
      this._updateMessageItem(messageIndex);
      this.setState(this.state);
      /*var data = this.state.listData;
      data[messageIndex].sent = true;
      this.setState({listData: data}, () => {
        console.log('message', this.state.listData);
        

      });*/
    }
  };

  _updateMessageItem = (index) =>{
    const data = this.state.listData;
    data[index].sent = true;
    this.setState({listData: data});
    console.log('_updateMessageItem', this.state.listData);
  };

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}