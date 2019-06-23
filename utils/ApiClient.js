
import buildUrl from 'build-url';

export default class ApiClient {

    SERVER_URL = process.env.SERVER_URL;
    getActivationCode(phoneNumber) {
        url = buildUrl(this.SERVER_URL, {
            path: 'activation',
            queryParams: {
                phoneNumber: phoneNumber
            }
        });
        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });
    }

    activateAccount (phoneNumber, activationCode) {
        url = buildUrl(this.SERVER_URL, {
            path: 'account'
        });
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                activationCode: activationCode,
            }),
        });
    }

    signIn (phoneNumber, secretCode) {
        url = buildUrl(this.SERVER_URL, {
            path: 'account/signin'
        });
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                code: secretCode,
            }),
        });
    }
    
}