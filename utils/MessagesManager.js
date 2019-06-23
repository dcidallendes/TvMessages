import SocketIOClient from 'socket.io-client';
import EventEmitter from 'events';
import * as ccc from 'react-native-config';

export default class MessagesManager {


    static socket;
    static connected = false;
    static eventEmitter = new EventEmitter();

    static connect(extraHeaders) {
        console.log(process.env.SERVER_URL);
        console.log('connect');
        this.socket = SocketIOClient(process.env.SERVER_URL, {
            extraHeaders: extraHeaders
        });
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

    static isConnected = () => {
        return this.connected;
    }

    static sendMessage = (message) => {
        if (this.isConnected()) {
            this.socket.emit('message', { message }, (data) => {
                this.eventEmitter.emit('messageSent', message);
            });
        }
        // if not connected, store the message and send later
    }

    static on = this.eventEmitter.on;
}