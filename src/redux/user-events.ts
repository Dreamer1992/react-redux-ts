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
const LOAD_SUCCESS = 'userEvents/load_success'
const LOAD_FAILURE = 'userEvents/load_failure'

interface ILoadRequestAction extends Action<typeof LOAD_REQUEST> {}

interface ILoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: IUserEvent[]
    }
}

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

const CREATE_USER_REQUEST = 'userEvents/create_user_request'
const CREATE_USER_SUCCESS_REQUEST = 'userEvents/create_user_success_request'
const CREATE_USER_FAILURE_REQUEST = 'userEvents/create_user_failure_request'

interface ICreateUserAction extends Action<typeof CREATE_USER_REQUEST> {}

interface ICreateUserSuccessAction
    extends Action<typeof CREATE_USER_SUCCESS_REQUEST> {
    payload: {
        event: IUserEvent
    }
}

interface ICreateUserFailureAction
    extends Action<typeof CREATE_USER_FAILURE_REQUEST> {}

export const createUserEvent =
    (): ThunkAction<
        Promise<void>,
        RootState,
        undefined,
        ICreateUserAction | ICreateUserSuccessAction | ICreateUserFailureAction
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

const DELETE_USER_REQUEST = 'userEvents/delete_user_request'
const DELETE_USER_SUCCESS_REQUEST = 'userEvents/delete_user_success_request'
const DELETE_USER_FAILURE_REQUEST = 'userEvents/delete_user_failure_request'

interface IDeleteUserAction extends Action<typeof DELETE_USER_REQUEST> {}

interface IDeleteUserSuccessAction
    extends Action<typeof DELETE_USER_SUCCESS_REQUEST> {
    payload: { id: IUserEvent['id'] }
}

interface IDeleteUserFailureAction
    extends Action<typeof DELETE_USER_FAILURE_REQUEST> {}

export const deleteUserEvent =
    (
        id: IUserEvent['id']
    ): ThunkAction<
        Promise<void>,
        RootState,
        undefined,
        IDeleteUserAction | IDeleteUserSuccessAction | IDeleteUserFailureAction
    > =>
    async (dispatch) => {
        try {
            dispatch({ type: DELETE_USER_REQUEST })

            const res = await fetch(`http://localhost:3001/events/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                dispatch({
                    type: DELETE_USER_SUCCESS_REQUEST,
                    payload: { id },
                })
            }
        } catch (e) {
            dispatch({ type: DELETE_USER_FAILURE_REQUEST })
        }
    }

const UPDATE_USER_REQUEST = 'userEvents/update_user_request'
const UPDATE_USER_SUCCESS_REQUEST = 'userEvents/update_user_success_request'
const UPDATE_USER_FAILURE_REQUEST = 'userEvents/update_user_failure_request'

interface IUpdateUserRequestAction extends Action<typeof UPDATE_USER_REQUEST> {}

interface IUpdateUserSuccessAction
    extends Action<typeof UPDATE_USER_SUCCESS_REQUEST> {
    payload: { event: IUserEvent }
}

interface IUpdateUserFailureAction
    extends Action<typeof UPDATE_USER_FAILURE_REQUEST> {}

export const updateUserEvent =
    (
        event: IUserEvent
    ): ThunkAction<
        Promise<void>,
        RootState,
        undefined,
        | IUpdateUserRequestAction
        | IUpdateUserSuccessAction
        | IUpdateUserFailureAction
    > =>
    async (dispatch) => {
        dispatch({
            type: UPDATE_USER_REQUEST,
        })

        try {
            const response = await fetch(
                `http://localhost:3001/events/${event.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(event),
                }
            )
            const updatedEvent: IUserEvent = await response.json()

            dispatch({
                type: UPDATE_USER_SUCCESS_REQUEST,
                payload: { event: updatedEvent },
            })
        } catch (e) {
            dispatch({
                type: UPDATE_USER_FAILURE_REQUEST,
            })
        }
    }

const selectUserEventsState = (rootState: RootState) => rootState.userEvents
export const selectUserEventsArray = (rootState: RootState) => {
    const state = selectUserEventsState(rootState)
    return state.allIds.map((id) => state.byIds[id])
}

const initialState = {
    byIds: {},
    allIds: [],
}

const userEvetsReducer = (
    state: IUserEventsState = initialState,
    action:
        | ILoadSuccessAction
        | ICreateUserSuccessAction
        | IDeleteUserSuccessAction
        | IUpdateUserSuccessAction
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
        case DELETE_USER_SUCCESS_REQUEST: {
            const { id } = action.payload

            const newState = {
                ...state,
                byIds: { ...state.byIds },
                allIds: state.allIds.filter((storedId) => storedId !== id),
            }
            delete newState.byIds[id]
            return newState
        }
        case UPDATE_USER_SUCCESS_REQUEST: {
            const { event: updatedEvent } = action.payload

            return {
                ...state,
                byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent },
            }
        }
        default:
            return state
    }
}

export default userEvetsReducer
