import { combineReducers, legacy_createStore as createStore } from 'redux'

import userEvetsReducer from './user-events'

const rootReducer = combineReducers({
    userEvents: userEvetsReducer,
})

export type RootStore = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store
