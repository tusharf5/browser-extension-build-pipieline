/// <reference types="../../src/typings"/>

export interface ExtensionAPI {
    createContextMenu: (contextMenuItem?: IExtension.ContextMenuItem) => void,
    onExtensionInstalled: (callBack: () => void) => void,
    onContextMenuClick: (callBack: () => void) => void,
    sendMessageToAll: (message: IExtension.Message, callBack:() => void) => void,
    sendMessageToTab: (message: IExtension.Message, callBack:() => void) => void,
    onBrowserActionClicked: (callback:() => void) => void,
    onRecieveMessage: (callBack:() => void, isTab:boolean) => void,
    parseClickData: (data, pageData: IExtension.PageData) => void,
    openNewTab: (options: IExtension.NewTabProps, callback:() => void) => void,
    getTranslation: (key: string) => string,
    updateRoutine: (callback?: (installed: any) => void) => void,
    storeValueToStorage: (obj,cb:() => void,val?) => void,
    getValueFromStorage: (key: string, cb:() => void) => void,
    reloadExtension: () => void,
    getVersion: () => string
    getUrl?: (node: any,nodeName: string) => any,
    getMediaType?: (node: any) => any,
    getType?: (node: any, selection: string) => any,
    onContextOpened?: (callBack: () => void) => void,
    validateMenuItem?: (event: Event) => void
}
