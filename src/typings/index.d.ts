declare namespace IExtension {
  interface Message {
    action: string;
    payload: any;
  }

  interface PageData {
    pageTitle: any;
    pageDescription: any;
  }

  interface ContextMenuItem {
    id: string;
    title: string;
    contexts: string[];
  }

  interface NewTabProps {
    active: boolean;
    openerTabId?: number;
    url: string;
  }

  interface BrewData {
    type: dataType;
    pageUrl: string;
    selectionText?: string;
    imageUrl?: string;
    linkUrl?: string;
    linkText?: string;
    pageTitle?: string;
    pageDescription?: string;
  }

  type browserType = 'chrome' | 'safari' | 'mozilla';
  type dataType = 'text' | 'image' | 'link' | 'page';
}

declare var BROWSER: string;
