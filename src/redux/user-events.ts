import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'

// sleectors
import { selectDateStart } from './recorder'

// types
import { RootState } from './store'

export interface IUserEvent {
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

const selectUserEventsState = (rootState: RootState) => rootState.userEvents
export const selectUserEventsArray = (rootState: RootState) => {
    const state = selectUserEventsState(rootState)
    return state.allIds.map((id) => state.byIds[id])
}

const CREATE_USER_REQUEST = 'userEvents/create_user_request'

interface ICreateUserRequest extends Action<typeof CREATE_USER_REQUEST> {}

const CREATE_USER_SUCCESS_REQUEST = 'userEvents/create_user_success_request'

interface ICreateUserSuccessRequest
    extends Action<typeof CREATE_USER_SUCCESS_REQUEST> {
    payload: {
        event: IUserEvent
    }
}

const CREATE_USER_FAILURE_REQUEST = 'userEvents/create_user_failure_request'

interface ICreateUserFailureRequest
    extends Action<typeof CREATE_USER_FAILURE_REQUEST> {}

export const createUserEvent =
    (): ThunkAction<
        Promise<void>,
        RootState,
        undefined,
        | ICreateUserRequest
        | ICreateUserSuccessRequest
        | ICreateUserFailureRequest
    > =>
    async (dispatch, getState) => {
        dispatch({ type: CREATE_USER_REQUEST })

        try {
            const dateStart = selectDateStart(getState())

            const event: Omit<IUserEvent, 'id'> = {
                title: 'No name',
                dateStart,
                dateEnd: new Date().toISOString(),
            }

            const res = await fetch('http://localhost:3001/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            })

            const createdEvent: IUserEvent = await res.json()

            dispatch({
                type: CREATE_USER_SUCCESS_REQUEST,
                payload: { event: createdEvent },
            })
        } catch (e) {
            dispatch({ type: CREATE_USER_FAILURE_REQUEST })
        }
    }

const initialState = {
    byIds: {},
    allIds: [],
}

const userEvetsReducer = (
    state: IUserEventsState = initialState,
    action: ILoadSuccessAction | ICreateUserSuccessRequest
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
        case CREATE_USER_SUCCESS_REQUEST: {
            const { event } = action.payload

            return {
                ...state,
                allIds: [...state.allIds, event.id],
                byIds: { ...state.byIds, [event.id]: event },
            }
        }
        default:
            return state
    }
}

export default userEvetsReducer
