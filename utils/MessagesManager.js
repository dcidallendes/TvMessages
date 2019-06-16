import SocketIOClient from 'socket.io-client';
import EventEmitter from 'events';

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
        console.log('connect');
        this.socket = SocketIOClient('http://192.168.0.27:3000');
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