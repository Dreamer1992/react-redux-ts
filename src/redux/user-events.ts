import { AnyAction, Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

// types
import { RootState } from './store'

interface IUserEvent {
    id: number
    title: string
    dateStart: string
    dateEnd: string
}

interface IUserEventsState {
    byIds: Record<IUserEvent['id'], IUserEvent>
    allIds: IUserEvent['id'][]
}

const LOAD_REQUEST = 'userEvents/load_request'
interface ILoadRequestAction extends Action<typeof LOAD_REQUEST> {}

const LOAD_SUCCESS = 'userEvents/load_success'
interface ILoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: IUserEvent[]
    }
}

const LOAD_FAILURE = 'userEvents/load_failure'
interface ILoadFailureAction extends Action<typeof LOAD_FAILURE> {
    error: string
}

export const loadUserEvents =
    (): ThunkAction<
        void,
        RootState,
        undefined,
        ILoadRequestAction | ILoadSuccessAction | ILoadFailureAction
    > =>
    async (dispatch, getState) => {
        dispatch({ type: LOAD_REQUEST })

        try {
            const response = await fetch('http://localhost:3001/events')
            const events: IUserEvent[] = await response.json()

            dispatch({ type: LOAD_SUCCESS, payload: { events } })
        } catch (e) {
            dispatch({ type: LOAD_FAILURE, error: 'Failed to load events' })
        }
    }

const initialState = {
    byIds: {},
    allIds: [],
}

const userEvetsReducer = (
    state: IUserEventsState = initialState,
    action: ILoadSuccessAction
) => {
    switch (action.type) {
        case LOAD_SUCCESS: {
            const { events } = action.payload

            return {
                ...state,
                allIds: events.map(({ id }) => id),
                byIds: events.reduce<IUserEventsState['byIds']>(
                    (byIds, event) => {
                        byIds[event.id] = event
                        return byIds
                    },
                    {}
                ),
            }
        }
        default:
            return state
    }
}

export default userEvetsReducer
