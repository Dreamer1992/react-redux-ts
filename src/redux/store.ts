import {
    combineReducers,
    legacy_createStore as createStore,
    applyMiddleware,
} from 'redux'
import thunk from 'redux-thunk'

// reducers
import userEvetsReducer from './user-events'
import recorderReducer from './recorder'

const rootReducer = combineReducers({
    userEvents: userEvetsReducer,
    recorder: recorderReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
