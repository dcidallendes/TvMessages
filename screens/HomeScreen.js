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
  Item,
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
  }

  componentDidMount() {
  }
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
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

        <Grid>
          <Row size={3}>
          <List
            dataArray={this.state.listData}
            renderRow={data =>
              <ListItem>
                <Left>
                  <Text>
                    {data.message}
                  </Text>
                </Left>
                <Right>
                  <Text>{data.time}</Text>
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
      const message = this.state.text;
      this.listData.push({ message, time: new Date().toLocaleTimeString() });
      this._pushMessage(message);
      this.setState({ listData: [...this.listData], text: '' });
      
    }
  }

  _pushMessage(message) {
    MessagesManager.getInstance().sendMessage(message);
  }

  _onAddMessageInput = (event) => {
    this._processOutcomingMessage();
  }
  _onAddMessageButtonClick = () => {
    this._processOutcomingMessage();
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