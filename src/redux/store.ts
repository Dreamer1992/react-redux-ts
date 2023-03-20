import { combineReducers, legacy_createStore as createStore } from 'redux'

import userEvetsReducer from './user-events'
import recorderReducer from './recorder'

const rootReducer = combineReducers({
    userEvents: userEvetsReducer,
    recorder: recorderReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store
