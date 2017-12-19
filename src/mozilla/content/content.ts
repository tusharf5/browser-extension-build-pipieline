declare var browser;

import { Extension, Dialog, getVersion } from '../../api';
import { ACTIONS } from '../../constants/index';

import {
  onRecieveMessage,
  parsePageData,
  sendMessageToAll,
  createUniqueDivision
} from '../../api';

import '../../common/content.scss';

let dialog = new Dialog();
let Extension = new Extension(getVersion());

createUniqueDivision.apply(this);
if (window.top === window) {
  onRecieveMessage((message, sender, sendResponse) => {
    if (message.action === ACTIONS.USER_LOGGED_IN_OPEN_DIALOG) {
      let iframeUrl = Extension.parseEverythingandMakeUrl(message.payload);
      dialog.show(iframeUrl);
    }
    if (message.action === ACTIONS.USER_LOGGED_OUT_OPEN_DIALOG) {
      sendMessageToAll({ action: ACTIONS.OPEN__TAB, payload: {} }, () => {});
    }
    if (message.action === ACTIONS.INIT_DIALOG_OPEN_REQUEST) {
      sendMessageToAll(
        { action: ACTIONS.GET_USER_STATUS_FOR_DIALOG, payload: {} },
        () => {}
      );
    }
    if (message.action === ACTIONS.GIVE_PAGE_DETAILS_FOR_DIALOG) {
      sendMessageToAll(
        {
          action: ACTIONS.TAKE_PAGE_DETAILS_FOR_DIALOG,
          payload: parsePageData()
        },
        () => {}
      );
    }
  });
}
top.window.addEventListener('message', (message: any) => {
  if (message.data === ACTIONS.INIT_DIALOG_CLOSE_REQUEST) {
    dialog.hide();
  }
  if (message.data === ACTIONS._IS_EXTENSION_INSTALLED) {
    top.window.postMessage(ACTIONS._EXTENSION_AVAILABLE, '*');
  }
});
