/// <reference types="../src/typings"/>
declare var safari: any;
import { ExtensionAPI } from '../../extension/interface';

export const SafariApi: ExtensionAPI = {
  onExtensionInstalled(callBack) {
    // Check if the version has changed.
    let currVersion = this.getVersion().toString();
    this.getValueFromStorage('AppVersion', item => {
      let prevVersion = item.AppVersion;
      if (currVersion != prevVersion) {
        // Check if we just installed this extension.
        if (
          typeof prevVersion == 'undefined' ||
          typeof prevVersion == 'object'
        ) {
          // onInstall
          this.reloadExtension();
          callBack.call(this, { reason: 'install' });
        } else {
          // onUpdate
          this.reloadExtension();
          callBack.call(this, { reason: 'update' });
        }
        this.storeValueToStorage(
          'AppVersion',
          function() {
            // done
          },
          currVersion
        );
      }
    });
  },

  getVersion(): string {
    return safari.extension.displayVersion;
  },

  onBrowserActionClicked() {
    // No use
  },

  getTranslation(): string {
    return '';
  },

  updateRoutine(callback) {
    //
  },

  reloadExtension() {
    // let browserWindows = safari.application.browserWindows;
    // for (let i = 0; i < browserWindows.length; i++) {
    //   let tabs = browserWindows[i].tabs;
    //   for (let j = 0; j < tabs.length; j++) {
    //     tabs[j].url = tabs[j].url;
    //   }
    // }
  },

  storeValueToStorage(key, cb, data) {
    localStorage.setItem(key, data);
    cb();
  },

  getValueFromStorage(key, cb: (obj: any) => void) {
    let value = localStorage.getItem(key);
    cb({ [key]: value });
  },
  onContextMenuClick(callBack) {
    safari.application.addEventListener('command', callBack, false);
  },
  createContextMenu() {
    document.addEventListener(
      'contextmenu',
      (event: any) => {
        safari.self.tab.setContextMenuEventUserInfo(event, {
          mediaType: this.getMediaType(event.target),
          type: this.getType(event.target, window.getSelection().toString()),
          srcUrl: this.getUrl(event.target, 'IMG'),
          linkUrl: this.getUrl(event.target, 'A'),
          pageUrl: event.target.baseURI,
          selectionText: window.getSelection().toString()
        });
      },
      false
    );
  },
  getUrl(node, nodeName) {
    if (nodeName === 'A') {
      return node.href;
    } else if (nodeName === 'IMG') {
      return node.currentSrc;
    } else {
      return undefined;
    }
  },
  getMediaType(node) {
    if (node.nodeName.toLowerCase() === 'img') {
      return 'image';
    }
    return undefined;
  },
  getType(node, selection) {
    if (node.nodeName === 'A') {
      return 'link';
    } else if (node.nodeName === 'IMG') {
      return 'image';
    } else if (selection === '') {
      return 'page';
    } else {
      return 'text';
    }
  },
  onContextOpened(callBack) {
    safari.application.addEventListener('contextmenu', callBack);
    // This will be registered all the time. @FIXME
    safari.application.addEventListener(
      'validate',
      this.validateMenuItem,
      false
    );
  },
  validateMenuItem(event: any) {
    if (event) {
      if (event.userInfo) {
        if (event.userInfo.type) {
          if (event.userInfo.type === 'link') {
            event.target.title = 'Brew this Link';
          } else if (event.userInfo.type === 'page') {
            event.target.title = 'Brew this Page';
          } else if (event.userInfo.type === 'image') {
            event.target.title = 'Brew this Image';
          } else if (event.userInfo.type === 'text') {
            event.target.title = 'Brew this Text';
          } else {
            event.target.title = 'Brew Your Selection';
          }
        }
      }
    }
  },
  sendMessageToAll(message, responseCallback): void {
    safari.self.tab.dispatchMessage(message.action, message.payload);
    responseCallback();
  },
  sendMessageToTab(message, responseCallback): void {
    safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(
      message.action,
      message.payload
    );
    responseCallback();
  },

  onRecieveMessage(callback, isTab): void {
    if (isTab) {
      safari.self.addEventListener('message', callback, false);
    } else {
      safari.application.addEventListener('message', callback, false);
    }
  },

  openNewTab(options: chrome.tabs.CreateProperties, callback) {
    let newTab = safari.application.activeBrowserWindow.openTab();
    newTab.url = options.url;
  },

  parseClickData(eventData, pageData: IExtension.PageData): IExtension.BrewData {
    const { userInfo } = eventData;
    let parsedData: IExtension.BrewData = {
      type: undefined,
      pageUrl: undefined
    };
    // If coming from extension toolbar
    if (!userInfo) {
      parsedData.pageUrl = eventData.target.browserWindow.activeTab.url;
      parsedData.type = 'page';
    } else {
      parsedData.pageUrl = userInfo.pageUrl;

      if (userInfo.linkUrl) {
        parsedData.linkUrl = userInfo.linkUrl;
      }

      if (userInfo.srcUrl) {
        parsedData.imageUrl = userInfo.srcUrl;
      }

      if (userInfo.pageUrl) {
        parsedData.pageUrl = userInfo.pageUrl;
      }

      if (userInfo.selectionText) {
        parsedData.selectionText = userInfo.selectionText;
      }

      parsedData.type = userInfo.type;
    }
    return Object.assign(parsedData, pageData);
  }
};
