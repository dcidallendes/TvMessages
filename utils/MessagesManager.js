import SocketIOClient from 'socket.io-client';
import EventEmitter from 'events';
import * as ccc from 'react-native-config';

export default class MessagesManager {

    static instance = null;

    socket;
    connected = false;
    eventEmitter = new EventEmitter();

    /**
     * @returns {MessagesManager}
     */
    static getInstance() {
        if (MessagesManager.instance === null) {
            MessagesManager.instance = new MessagesManager();
        }

        return this.instance;
    }

    connect() {
        console.log(process.env.SERVER_URL);
        console.log('connect');
        this.socket = SocketIOClient(process.env.SERVER_URL);
        this.socket.on('connect', () => {
            console.log('connected');
            this.connected = true;
            this.eventEmitter.emit('connected');
            

        });
        this.socket.on('connect_timeout', () => {
            console.log('timeout');
        });
        this.socket.on('connect_error', () => {
            this.connected = false;
            console.log('error');
            this.eventEmitter.emit('disconnected');
        });
    }

    isConnected = () =>  {
        return this.connected;
    }

    sendMessage =  (message) => {
        if (this.isConnected()) {
            this.socket.emit('message', {message}, () => {
                console.log('messageSend');
            });
        }
        // if not connected, store the message and send later
    }

    on = this.eventEmitter.on;
}