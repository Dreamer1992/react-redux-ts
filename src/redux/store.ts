import {
    combineReducers,
    legacy_createStore as createStore,
    applyMiddleware,
} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// reducers
import userEvetsReducer from './user-events'
import recorderReducer from './recorder'

const rootReducer = combineReducers({
    userEvents: userEvetsReducer,
    recorder: recorderReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = createStore(rootReducer, composedEnhancer)

export default store
