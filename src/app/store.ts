import { ADD_THREAD_UNSEEN_MSG_CNT, ADD_NOTIFICATION } from './actions';
import { Notification } from "./notification/notification.model";

export interface IAppState {
   threadsUnseenMsgs: Object[];
   stateNotifications: Notification[];
}

export const INITIAL_STATE: IAppState = {
  threadsUnseenMsgs: [],
  stateNotifications: []
}

const newState = (state, newData) => {
  return Object.assign({}, state, newData);
}

export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case ADD_THREAD_UNSEEN_MSG_CNT: 
      const thread = state.threadsUnseenMsgs.find(
        thread => thread['tid'] == action.threadUnseenMsgs.tid
      );
      const threadIndex = state.threadsUnseenMsgs.indexOf(thread);
      if(threadIndex < 0){
        // add
        const data = state.threadsUnseenMsgs.concat(Object.assign({}, action.threadUnseenMsgs));
        return newState(state, {threadsUnseenMsgs: data});
      }
      else {
        // update
        const data = [
          ...state.threadsUnseenMsgs.slice(0, threadIndex),
          Object.assign({}, thread, action.threadUnseenMsgs),
          ...state.threadsUnseenMsgs.slice(threadIndex+1)
        ];
        return newState(state, {threadsUnseenMsgs: data});
      }
    case ADD_NOTIFICATION:
      const notification = state.stateNotifications.find(
        notification => notification.id == action.notification.id
      );
      const notifIndex  = state.stateNotifications.indexOf(notification);
      if(notifIndex < 0) {
        // add
        const data = state.stateNotifications.concat(Object.assign({}, action.notification));
        return newState(state, {stateNotifications: data});
      }
      else {
        // udate
        const data = [
          ...state.stateNotifications.slice(0, notifIndex),
          Object.assign({}, notification, action.notifications),
          ...state.stateNotifications.slice(notifIndex+1)
        ];
        return newState(state, {stateNotifications: data});
      }
  }
  return state;
}