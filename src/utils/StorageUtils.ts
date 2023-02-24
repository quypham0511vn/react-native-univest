import AsyncStorage from '@react-native-community/async-storage';

// get saved data by key
function getDataByKeyWithCallback(key: string, callback: any) {
    AsyncStorage.getItem(key).then((value) => {
        // console.log("get key " + key + ' with data ' + value);
        if (value !== null) {
            callback(JSON.parse(value));
        } else {
            callback(null);
        }
    });
};

// save data
function saveDataToKey(key: string, data: string) {
    try {
        AsyncStorage.setItem(key, data);
    } catch (error) {
        console.log(error);
    }
};

// get data from key
async function getDataByKey(key: string) {
    return AsyncStorage.getItem(key);
}

function clearDataOfKey(key: string) {
    try {
        AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(error);
    }
};

function clearDataOfListKey(listKey: string[]) {
    try {
        AsyncStorage.multiRemove(listKey);
    } catch (err) {
        console.log(err);
    }
}

export default {
    getDataByKeyWithCallback,
    saveDataToKey,
    getDataByKey,
    clearDataOfKey,
    clearDataOfListKey
};
