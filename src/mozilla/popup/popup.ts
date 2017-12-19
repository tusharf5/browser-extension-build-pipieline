import { ACTIONS } from '../../../constants';
import { onRecieveMessage } from '../../api';
import { sendMessageToAll } from '../../api';
import './popup.scss';

let loginStatus;
let loginAction;

document.addEventListener('DOMContentLoaded', function(event) {
  loginStatus = document.getElementById('loginStatus');
  loginAction = document.getElementById('loginAction');
  init();
});

function init() {
  sendMessageToAll(
    {
      action: ACTIONS.GET_USER_STATUS
    },
    () => {}
  );

  onRecieveMessage((message, sender, sendResponse) => {
    if (message.action === ACTIONS.USER_LOGGED_IN) {
      showUserLoggedIn();
    }
    if (message.action === ACTIONS.USER_LOGGED_OUT) {
      showUserLoggedOut();
    }
  });
}

function showUserLoggedOut() {
  loginAction.style.display = 'flex';
  loginStatus.innerHTML = '<span class="negative">Logged Out</span>';
}

function showUserLoggedIn() {
  loginAction.style.display = 'none';
  loginStatus.innerHTML = '<span class="positive">Logged In</span>';
}
