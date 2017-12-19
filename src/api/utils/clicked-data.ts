export class ClickedData {
  _clickedData;
  _openDialogRequest;
  _pageData: IExtension.PageData;

  get clickedData() {
    return this._clickedData;
  }

  set clickedData(data) {
    this._clickedData = data;
  }

  get openDialogRequest() {
    return this._openDialogRequest;
  }

  set openDialogRequest(data: boolean) {
    this._openDialogRequest = data;
  }

  get pageData() {
    return this._pageData;
  }

  set pageData(data: IExtension.PageData) {
    this._pageData = data;
  }

  constructor() {}

  update(data) {
    this.clickedData = data;
  }
}
