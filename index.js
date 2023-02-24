/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Bugsnag from '@bugsnag/react-native';

import App from '@/routers/Routers';
import {name as appName} from './app.json';

if (!__DEV__) {
    console.log = () => {};
}

Bugsnag.start(this);
AppRegistry.registerComponent(appName, () => App);
