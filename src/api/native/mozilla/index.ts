/// <reference types="../src/typings"/>
/// <reference types="@types/chrome"/>
import { ExtensionAPI } from '../../extension/interface';

declare var browser: any;

export const MozillaApi: ExtensionAPI = {
  updateRoutine() {
    // Check if the version has changed.
    let currVersion = this.getVersion();
    this.getValueFromStorage('AppVersion', item => {
      let prevVersion = item.AppVersion;
      if (currVersion != prevVersion) {
        // Check if we just installed this extension.
        if (typeof prevVersion == 'undefined') {
          // onInstall No Need to inject in Mozilla
          // this.reloadExtension();
        } else {
          // onUpdate No Need to inject in Mozilla
          // this.reloadExtension();
        }
        this.storeValueToStorage({ AppVersion: currVersion }, function() {});
      }
    });
  },
  getVersion(): string {
    return browser.runtime.getManifest().version;
  },
  reloadExtension() {
    let queryTabs = browser.tabs.query({});

    queryTabs.then((tabs: any) => {
      tabs.forEach(tab => {
        if (!tab.url.startsWith('about:')) {
          browser.tabs.executeScript(tab.id, {
            file: '/content.js'
          });
        }
      });
    });
  },

  createContextMenu(contextMenuItem: IExtension.ContextMenuItem): void {
    browser.contextMenus.create(contextMenuItem);
  },

  onContextMenuClick(callBack) {
    browser.contextMenus.onClicked.addListener(callBack);
  },

  onExtensionInstalled(callbackll) {
    browser.runtime.onInstalled.addListener(callbackll);
  },

  onBrowserActionClicked(callback) {
    browser.browserAction.onClicked.addListener(callback);
  },

  sendMessageToAll(message, responseCallback): void {
    browser.runtime.sendMessage(message);
    responseCallback();
  },

  storeValueToStorage(obj, cb) {
    browser.storage.local.set(obj);
    cb();
  },

  getValueFromStorage(key, cb: (result: any) => any) {
    browser.storage.local
      .get(key)
      .then(results => {
        cb(results);
      })
      .catch(err => {
        cb(err);
      });
  },
  sendMessageToTab(message, responseCallback): void {
    let queryTabs = browser.tabs.query({
      active: true
    });
    queryTabs.then(tabs => {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, message).then(response => {
          responseCallback();
        });
      });
    });
  },
  onRecieveMessage(callback): void {
    browser.runtime.onMessage.addListener(callback);
  },
  openNewTab(
    options: chrome.tabs.CreateProperties,
    callback: (tab: any) => void
  ) {
    browser.tabs.create(options).then(tab => {
      callback(tab);
    });
  },

  parseClickData(data, pageData: IExtension.PageData): IExtension.BrewData {
    let parsedData: IExtension.BrewData = {
      type: undefined,
      pageUrl: data.pageUrl
    };

    if (data.linkUrl) {
      parsedData.linkUrl = data.linkUrl;
    }

    if (data.srcUrl) {
      parsedData.imageUrl = data.srcUrl;
    }

    if (data.pageUrl) {
      parsedData.pageUrl = data.pageUrl;
    }

    if (data.selectionText) {
      parsedData.selectionText = data.selectionText;
    }

    /**
   * It's a text
   */

    if (!data.linkUrl) {
      parsedData.type = 'text';
    }

    /**
   * It is a text Link
   */

    if (data.linkUrl && !data.srcUrl) {
      parsedData.type = 'link';
    }

    /**
   * It's an Image
   */

    if (data.mediaType) {
      if (data.mediaType === 'image') {
        parsedData.type = 'image';
      }
    }

    /**
   * It's a click on the Page
   */
    if (!data.linkUrl && !data.srcUrl && !data.selectionText) {
      parsedData.type = 'page';
    }

    return Object.assign(parsedData, pageData);
  },
  getTranslation(key): string {
    return browser.i18n.getMessage(key);
  }
};
