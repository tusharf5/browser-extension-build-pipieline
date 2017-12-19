export const ACTIONS = {
  INIT_DIALOG_OPEN_REQUEST: 'init-dialog-open-request',
  INIT_DIALOG_CLOSE_REQUEST: 'init-dialog-close-request',
  DIALOG_CLOSED: 'dialog-closed',
  GET_USER_STATUS_FOR_DIALOG: 'get-user-status-for-dialog',
  GIVE_PAGE_DETAILS_FOR_DIALOG: 'give-page-details-for-dialog',
  TAKE_PAGE_DETAILS_FOR_DIALOG: 'take-page-details-for-dialog',
  USER_LOGGED_IN_OPEN_DIALOG: 'user-logged-in-open-dialog',
  USER_LOGGED_OUT_OPEN_DIALOG: 'user-logged-out-open-dialog',
  OPEN_TAB: 'open-tab',
  IS_EXTENSION_INSTALLED: 'is-extension-installed',
  EXTENSION_AVAILABLE: 'extension-available'
};

export const UID = {
  CONTEXT_MENU_ID_PAGE: 'context-menu-page',
  CONTEXT_MENU_ID_FRAME: 'context-menu-frame',
  CONTEXT_MENU_ID_IMAGE: 'context-menu-image',
  CONTEXT_MENU_ID_LINK: 'context-menu-link',
  CONTEXT_MENU_ID_SELECTION: 'context-menu-selection',
  CONTEXT_MENU_ID_EDITABLE: 'context-menu-editable',
  SAFARI_CONTEXT_MENU_ITEM: 'post-context-item-clicked',
  SAFARI_TOOLBAR_MENU: 'browser-action-clicked'
};

export const CONTENT = {
  CONTEXT_MENU_TITLE_PAGE: 'context_menu_title_page',
  CONTEXT_MENU_TITLE_FRAME: 'context_menu_title_frame',
  CONTEXT_MENU_TITLE_IMAGE: 'context_menu_title_image',
  CONTEXT_MENU_TITLE_LINK: 'context_menu_title_link',
  CONTEXT_MENU_TITLE_SELECTION: 'context_menu_title_selection',
  CONTEXT_MENU_TITLE_EDITABLE: 'context_menu_title_editable'
};

export const DIALOGATTR = {
  IFRAME: {
    NAME: 'extension-app',
    ID: 'sharer'
  }
};

export function getLoginUrl(broswer: string, version: string) {
  return `https://google.com/?browser=${broswer}-ext&version=${version}`;
}

export function getInstalledUrl(broswer: string, version: string) {
  return `https://google.com/?action=install&browser=${broswer}-ext&version=${version}`;
}

export function getUpdatedUrl(broswer: string, version: string) {
  return `https://google.com/?action=update&browser=${broswer}-ext&version=${version}`;
}

/**
 * FLOW OF ACTIONS
 * [BG] INIT_DIALOG_OPEN_REQUEST --->
 * [CON] GET_USER_STATUS_FOR_DIALOG --->
 * ###### IF LOGGED IN ########
 * [BG] GIVE_PAGE_DETAILS_FOR_DIALOG --->
 * [CON] TAKE_PAGE_DETAILS_FOR_DIALOG --->
 * [BG] USER_LOGGED_IN_OPEN_DIALOG -->
 * ###### IF LOGGED OUT ########
 * [BG] USER_LOGGED_OUT_OPEN_DIALOG --->
 * [CON] OPEN_TAB --->
 */
