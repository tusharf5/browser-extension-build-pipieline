/// <reference types="@types/chrome"/>
/// <reference types="../src/typings"/>
import { ExtensionAPI } from '../../extension/interface';

export const ChromeApi: ExtensionAPI = {
  createContextMenu(contextMenuItem: IExtension.ContextMenuItem): void {
    chrome.contextMenus.create(contextMenuItem);
  },
  updateRoutine() {
    // Check if the version has changed.
    let currVersion = this.getVersion();
    this.getValueFromStorage('AppVersion', (item: any) => {
      let prevVersion = item.AppVersion;
      if (currVersion !== prevVersion) {
        // Check if we just installed this extension.
        if (typeof prevVersion == 'undefined') {
          this.reloadExtension();
        } else {
          this.reloadExtension();
        }
        this.storeValueToStorage({ AppVersion: currVersion }, function() {
          // done
        });
      }
    });
  },
  getVersion(): string {
    return chrome.runtime.getManifest().version;
  },
  reloadExtension() {
    chrome.tabs.query({}, tabs => {
      tabs.forEach(tab => {
        if (!tab.url.startsWith('chrome:')) {
          chrome.tabs.executeScript(
            tab.id,
            {
              file: 'content.js'
            },
            () => {}
          );
        }
      });
    });
  },
  storeValueToStorage(obj, cb) {
    chrome.storage.sync.set(obj, function() {
      cb();
    });
  },
  getValueFromStorage(key, cb: (obj: any) => void) {
    chrome.storage.sync.get(key, function(obj) {
      cb(obj);
    });
  },
  onContextMenuClick(
    callBack: (
      info: chrome.contextMenus.OnClickData,
      tab?: chrome.tabs.Tab
    ) => void
  ): void {
    chrome.contextMenus.onClicked.addListener(callBack);
  },
  onExtensionInstalled(
    callback: (details: chrome.runtime.InstalledDetails) => void
  ): void {
    chrome.runtime.onInstalled.addListener(callback);
  },
  onBrowserActionClicked(callback) {
    chrome.browserAction.onClicked.addListener(callback);
  },
  sendMessageToAll(message, responseCallback): void {
    chrome.runtime.sendMessage(message, responseCallback);
  },
  sendMessageToTab(message, responseCallback): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs): void => {
      chrome.tabs.sendMessage(tabs[0].id, message, responseCallback);
    });
  },
  onRecieveMessage(callback): void {
    chrome.runtime.onMessage.addListener(callback);
  },
  openNewTab(options: chrome.tabs.CreateProperties, callback) {
    chrome.tabs.create(options, callback);
  },
  parseClickData(
    data: chrome.contextMenus.OnClickData,
    pageData: IExtension.PageData
  ): IExtension.BrewData {
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
    return chrome.i18n.getMessage(key);
  }
};
