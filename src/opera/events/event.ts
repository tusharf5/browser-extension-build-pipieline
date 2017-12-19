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
  getVersion
} from '../../api';
import { ACTIONS, UID } from '../../constants';
import {
  createContextMenu,
  onExtensionInstalled,
  onContextMenuClick,
  sendMessageToTab,
  parseClickData,
  onRecieveMessage,
  sendMessageToAll,
  parsePageData,
  openNewTab,
  getTranslation,
  onBrowserActionClicked
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
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_PAGE,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_PAGE),
    contexts: ['page']
  });
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_FRAME,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_FRAME),
    contexts: ['frame']
  });
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_SELECTION,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_SELECTION),
    contexts: ['selection']
  });
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_LINK,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_LINK),
    contexts: ['link']
  });
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_EDITABLE,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_EDITABLE),
    contexts: ['editable']
  });
  createContextMenu({
    id: UID.CONTEXT_MENU_ID_IMAGE,
    title: getTranslation(CONTENT.CONTEXT_MENU_TITLE_IMAGE),
    contexts: ['image']
  });
});

onContextMenuClick(clickData => {
  if (
    clickData.menuItemId === UID.CONTEXT_MENU_ID_PAGE ||
    clickData.menuItemId === UID.CONTEXT_MENU_ID_FRAME ||
    clickData.menuItemId === UID.CONTEXT_MENU_ID_SELECTION ||
    clickData.menuItemId === UID.CONTEXT_MENU_ID_LINK ||
    clickData.menuItemId === UID.CONTEXT_MENU_ID_EDITABLE ||
    clickData.menuItemId === UID.CONTEXT_MENU_ID_IMAGE
  ) {
    clickedData.update(clickData);

    sendMessageToTab(
      {
        action: ACTIONS.INIT_DIALOG_OPEN_REQUEST,
        payload: {}
      },
      e => e
    );
  }
});

onBrowserActionClicked(tab => {
  clickedData.update({
    pageUrl: tab.url,
    type: 'page'
  });
  sendMessageToTab(
    {
      action: ACTIONS.INIT_DIALOG_OPEN_REQUEST,
      payload: {}
    },
    e => e
  );
});

onRecieveMessage(message => {
  if (message.action === ACTIONS.TAKE_PAGE_DETAILS_FOR_DIALOG) {
    clickedData.pageData = message.payload;
    sendMessageToTab(
      {
        action: ACTIONS.USER_LOGGED_IN_OPEN_DIALOG,
        payload: parseClickData(clickedData.clickedData, clickedData.pageData)
      },
      e => e
    );
  }
  if (message.action === ACTIONS.OPEN_TAB) {
    openNewTab(
      {
        url: getLoginUrl(BROWSER, getVersion()),
        active: true
      },
      tab => {}
    );
  }
  if (message.action === ACTIONS.GET_USER_STATUS_FOR_DIALOG) {
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
  return fetch('https://google.com/usre', {
    method: 'GET',
    credentials: 'include'
  });
}
