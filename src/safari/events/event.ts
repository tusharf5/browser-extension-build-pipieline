import {
  CONTENT,
  getInstalledUrl,
  getLoginUrl,
  getUpdatedUrl
} from '../../constants/index';
import {
  ExtensionWorker,
  ClickedData,
  User,
  updateRoutine,
  getVersion,
  onContextMenuOpened
} from '../../api';
import { ACTIONS, UID } from '../../constants';
import {
  onExtensionInstalled,
  onContextMenuClick,
  sendMessageToTab,
  parseClickData,
  onRecieveMessage,
  sendMessageToAll,
  parsePageData,
  openNewTab
} from '../../api';

let clickedData = new ClickedData();
let user = new User();

onExtensionInstalled(installed => {
  if (installed.reason === 'update') {
    openNewTab(
      {
        url: getUpdatedUrl(BROWSER, getVersion()),
        active: true
      },
      tab => {}
    );
  } else {
    openNewTab(
      {
        url: getInstalledUrl(BROWSER, getVersion()),
        active: true
      },
      tab => {}
    );
  }
  updateRoutine();
});

onContextMenuClick(clickData => {
  if (clickData.command === UID.SAFARI_CONTEXT_MENU_ITEM) {
    clickedData.update(clickData);
    sendMessageToTab(
      {
        action: ACTIONS.INIT_DIALOG_OPEN_REQUEST,
        payload: {}
      },
      e => {}
    );
  }
  if (clickData.command === UID.SAFARI_TOOLBAR_MENU) {
    clickedData.update(clickData);
    sendMessageToTab(
      {
        action: ACTIONS.INIT_DIALOG_OPEN_REQUEST,
        payload: {
          from: 'TOOLBAR'
        }
      },
      e => {}
    );
  }
});

onContextMenuOpened(event => {
  getDataFromContextOpenedEvent(event);
});

onRecieveMessage(message => {
  if (message.name === ACTIONS.TAKE_PAGE_DETAILS_FOR_DIALOG) {
    clickedData.pageData = message.message;
    sendMessageToTab(
      {
        action: ACTIONS.USER_LOGGED_IN_OPEN_DIALOG,
        payload: parseClickData(clickedData.clickedData, clickedData.pageData)
      },
      e => e
    );
  }
  if (message.name === ACTIONS.OPEN_TAB) {
    openNewTab(
      {
        url: getLoginUrl(BROWSER, getVersion()),
        active: true
      },
      tab => {}
    );
  }
  if (message.name === ACTIONS.GET_USER_STATUS_FOR_DIALOG) {
    fetchUser()
      .then(function(response) {
        var contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          if (response.status === 200) {
            sendMessageToTab(
              { action: ACTIONS.GIVE_PAGE_DETAILS_FOR_DIALOG, payload: {} },
              e => {}
            );
          } else {
            sendMessageToTab(
              { action: ACTIONS.USER_LOGGED_OUT_OPEN_DIALOG, payload: {} },
              e => {}
            );
          }
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      })
      .catch(e => {
        sendMessageToTab(
          { action: ACTIONS.USER_LOGGED_OUT_OPEN_DIALOG, payload: {} },
          e => {}
        );
      });
  }
});

function fetchUser() {
  return fetch('https://google.com/user', {
    method: 'GET',
    credentials: 'include'
  });
}

function getDataFromContextOpenedEvent(event) {
  clickedData.update(event.userInfo);
  return;
}
