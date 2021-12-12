import { Helper } from 'react-native-maestro';

export default class NavigationHelper extends Helper {
  static get instanceKey() {
    return 'navigationHelper';
  }

  openScreen(screenName) {
    this.maestro.dispatchEvent('OPEN_SCREEN', { screenName });
  }
}
