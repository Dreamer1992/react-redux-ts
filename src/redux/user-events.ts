import { AnyAction } from 'redux'

interface IUserEvents {
    id: number
    title: string
    dateStart: string
    dateEnd: string
}

interface IUserEventsReducer {
    byIds: Record<IUserEvents['id'], IUserEvents>
    allIds: IUserEvents['id'][]
}

const initialState = {
    byIds: {},
    allIds: [],
}

const userEvetsReducer = (
    state: IUserEventsReducer = initialState,
    action: AnyAction
) => {
    switch (action.type) {
        default:
            return state
    }
}

export default userEvetsReducer
