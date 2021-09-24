/**
 * Created by steve on 2/9/2017.
 */
import React from 'react';
import {render} from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './ducks';
import Root from "./components/Root";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer,
    composeEnhancers(applyMiddleware(thunk))
);

render(
    (<Provider store={store}>
        <Root/>
    </Provider>),
    document.getElementById('app'));
