
export default class Message {
    /**
     * uuid key for the message
     */
    id;
    text;
    date = new Date().toLocaleTimeString();
    received = false;
    /**`
     * Boolean value that tells if the message has been sent to the server
     */
    sent;
    /**
     * Boolean value that tells if the message has been received by the other user
     */
    received;

    toString = () =>{
        return 'text: ' + this.text + ', sent: ' + this.sent;
    };
}