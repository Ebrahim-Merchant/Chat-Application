import { authUser } from './actionCreator';
import { IAppState } from './types';
import { Middleware } from '@reduxjs/toolkit';

export const routeMiddleware: Middleware<{}, IAppState> = (store) => (next) => (
  action
) => {
  console.log(action);
  switch(action.type) {
    case authUser.fulfilled.type: 
      window.location.href = '/chat';
      break;
  }
  // if (action.type === authUser.fulfilled.type) {
  //   window.location.href="/chat";
  // } else if
  return next(action);
};

export const dispatchMiddleware: Middleware<{}, IAppState> = (store) => (next) => (
  action
) => {
  if(Array.isArray(action)) {
    action.forEach((action) => 
      store.dispatch(action)
    )
  } else {
    return next(action);
  }
};
