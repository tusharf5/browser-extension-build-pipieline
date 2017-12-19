import { ChromeApi } from '../native/chrome';

import { SafariApi } from '../native/safari';

import { MozillaApi } from '../native/mozilla';

import { OperaAPI } from '../native/opera';

import { ExtensionAPI } from './interface';

function getBrowser(): ExtensionAPI {
  switch (BROWSER) {
    case 'chrome':
      return ChromeApi;
    case 'safari':
      return SafariApi;
    case 'mozilla':
      return MozillaApi;
    case 'opera':
      return OperaAPI;
    default:
      return null;
  }
}

export function onContextMenuClick(callBack) {
  getBrowser().onContextMenuClick(callBack);
}

export function createContextMenu(contextMenuItem?: IExtension.ContextMenuItem) {
  getBrowser().createContextMenu(contextMenuItem);
}

export function onExtensionInstalled(callBack) {
  getBrowser().onExtensionInstalled(callBack);
}

export function sendMessageToAll(message: IExtension.Message, callBack) {
  getBrowser().sendMessageToAll(message, callBack);
}

export function sendMessageToTab(message: IExtension.Message, callBack) {
  getBrowser().sendMessageToTab(message, callBack);
}

export function onBrowserActionClicked(callBack) {
  getBrowser().onBrowserActionClicked(callBack);
}

export function onRecieveMessage(callBack, isTab = false) {
  getBrowser().onRecieveMessage(callBack, isTab);
}

export function parseClickData(data, pageData: IExtension.PageData) {
  return getBrowser().parseClickData(data, pageData);
}

export function openNewTab(options: IExtension.NewTabProps, callback) {
  getBrowser().openNewTab(options, callback);
}

export function getTranslation(key): string {
  return getBrowser().getTranslation(key);
}

export function updateRoutine(callback?: (installed: any) => void) {
  getBrowser().updateRoutine(callback);
}

export function getVersion(): string {
  return getBrowser().getVersion();
}

export function onContextMenuOpened(callback) {
  return getBrowser().onContextOpened(callback);
}

export function createUniqueDivision() {
  let uniqueDiv = document.createElement('div');
  uniqueDiv.setAttribute('id', 'extensionDivUniqueIdentifier');
  uniqueDiv.style.display = 'none';
  document.body.appendChild(uniqueDiv);
}

export function parsePageData() {
  let ogTitle;
  let twitterTitle;
  let ogDescription;
  let twitterDescription;
  let description;

  let tempOgTitle: any = document.querySelector('meta[property="og:title"]');

  if (tempOgTitle) {
    ogTitle = tempOgTitle.content;
  }

  let tempTwitterTitle: any = document.querySelector(
    'meta[name="twitter:title"]'
  );
  if (tempTwitterTitle) {
    twitterTitle = tempTwitterTitle.content;
  }

  let title: any = document.title;

  let tempOgDesc: any = document.querySelector(
    'meta[property="og:description"]'
  );
  if (tempOgDesc) {
    ogDescription = tempOgDesc.content;
  }

  let tempTwitterDesc: any = document.querySelector(
    'meta[name="twitter:description"]'
  );
  if (tempTwitterDesc) {
    twitterDescription = tempTwitterDesc.content;
  }

  let tempDesc: any = document.querySelector('meta[name="description"]');
  if (tempDesc) {
    description = tempDesc.content;
  }

  return {
    pageTitle: ogTitle || twitterTitle || title,
    pageDescription: ogDescription || twitterDescription || description
  };
}

export class ExtensionWorker {
  _version;
  _prefixUrl = 'https://google.com';

  get version() {
    return this._version;
  }

  set version(extVersion) {
    this._version = extVersion;
  }

  constructor(extVersion) {
    this.version = extVersion;
  }

  generateExtUrl(data: {
    pageUrl: string,
    mediaUrl: string,
    text: string,
    linkUrl: string,
    srcUrl: string,
    pageTitle: string,
    pageDescription: string,
    platform: string,
    type: string
  }) {
    const allData = {
      sharedVia: BROWSER,
      version: this._version,
      pageUrl: data.pageUrl,
      mediaUrl: data.mediaUrl,
      text: data.text,
      srcUrl: data.srcUrl,
      linkUrl: data.linkUrl,
      pageTitle: data.pageTitle,
      pageDescription: data.pageDescription,
      platform: BROWSER,
      type: data.type
    };

    const urlParts = [...Object.keys(allData)];

    return urlParts.reduce((previousValue, currentValue, currentIndex) => {
      // encodeUri converts undefined to "undefined"
      if (allData[currentValue] !== 'undefined') {
        if (currentIndex === urlParts.length - 1) {
          return `${previousValue}${currentValue}=${allData[currentValue]}`;
        }
        return `${previousValue}${currentValue}=${allData[currentValue]}&`;
      } else {
        return `${previousValue}`;
      }
    }, this._prefixUrl);
  }

  parseEverythingandMakeUrl(data: IExtension.BrewData) {
    const sendingData = {
      pageUrl: encodeURIComponent(data.pageUrl),
      mediaUrl: encodeURIComponent(data.imageUrl),
      text: data.selectionText,
      linkUrl: encodeURIComponent(data.linkUrl),
      pageTitle: encodeURIComponent(data.pageTitle),
      pageDescription: encodeURIComponent(data.pageDescription),
      platform: BROWSER
    };

    switch (data.type) {
      case 'image':
        return this.generateExtUrl(
          Object.assign({}, sendingData, {
            type: 'image',
            srcUrl:
              sendingData.mediaUrl !== 'undefined'
                ? sendingData.mediaUrl
                : sendingData.pageUrl,
            text: sendingData.pageTitle
          })
        );
      case 'page':
        return this.generateExtUrl(
          Object.assign({}, sendingData, {
            type: 'page',
            srcUrl: sendingData.pageUrl,
            text: sendingData.pageTitle
          })
        );
      case 'link':
        return this.generateExtUrl(
          Object.assign({}, sendingData, {
            type: 'link',
            srcUrl:
              sendingData.linkUrl !== 'undefined'
                ? sendingData.linkUrl
                : sendingData.pageUrl,
            text: sendingData.text || sendingData.pageTitle
          })
        );
      case 'text':
        return this.generateExtUrl(
          Object.assign({}, sendingData, {
            type: 'text',
            srcUrl: sendingData.pageUrl,
            text: sendingData.text
          })
        );
      default:
        return this.generateExtUrl(
          Object.assign({}, sendingData, {
            type: 'other',
            srcUrl: sendingData.pageUrl,
            text: sendingData.pageTitle
          })
        );
    }
  }
}
