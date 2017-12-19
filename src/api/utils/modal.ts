import { DIALOGATTR } from './../../constants/index';

export class Dialog {
  oldBodyOverflow = 'auto';
  ref;

  constructor() {}

  show(iframeURL) {
    if (document.getElementById(DIALOGATTR.IFRAME.ID)) {
      document.body.removeChild(document.getElementById(DIALOGATTR.IFRAME.ID));
    } else {
      let iframe = document.createElement('iframe');
      iframe.setAttribute('name', DIALOGATTR.IFRAME.NAME);
      iframe.setAttribute('id', DIALOGATTR.IFRAME.ID);
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('src', iframeURL);
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.bottom = '0';
      iframe.style.right = '0';
      iframe.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      iframe.style.display = 'flex';
      iframe.style.justifyContent = 'center';
      iframe.style.alignContent = 'center';
      iframe.style.alignItems = 'center';
      iframe.style.flexDirection = 'column';
      iframe.style.zIndex = '16777271';
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      this.ref = document.body.appendChild(iframe);
      this.oldBodyOverflow = document.body.style.overflow;
    }
  }

  hide() {
    if (document.getElementById(DIALOGATTR.IFRAME.ID)) {
      document.body.removeChild(document.getElementById(DIALOGATTR.IFRAME.ID));
    }
    return;
  }
}
