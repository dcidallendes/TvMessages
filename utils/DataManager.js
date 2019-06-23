import { AsyncStorage } from 'react-native';

export default class DataManager {

    static getToken = async () => {
        return await DataManager.getValue('token');
    };

    static setToken = async (token) => {
        await DataManager.setValue('token', token);
    };

    static isLoggedIn = async () => {
        var token = await DataManager.getToken();
        return await DataManager.getToken() != null;
    }

    static getPhoneNumber = async () => {
        return await DataManager.getValue('phoneNumber');
    };

    static setPhoneNumber = async (phoneNumber) => {
        await DataManager.setValue('phoneNumber', phoneNumber);
    };

    static getValue = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            return null;
        }
    };

    static setValue = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

}