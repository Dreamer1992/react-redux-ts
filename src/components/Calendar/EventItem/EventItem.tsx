import { useDispatch } from 'react-redux'
import { AnyAction } from 'redux'

import { deleteUserEvent, IUserEvent } from '../../../redux/user-events'

interface IProps {
    event: IUserEvent
}

const EventItem = ({ event }: IProps) => {
    const dispatch = useDispatch()

    const handleDeleteEvent = (id: IUserEvent['id']) => {
        dispatch(deleteUserEvent(id) as unknown as AnyAction)
    }

    return (
        <div className="calendar-event">
            <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">{event.title}</div>
            </div>

            <button
                onClick={() => handleDeleteEvent(event.id)}
                className="calendar-event-delete-button"
            >
                &times;
            </button>
        </div>
    )
}

export default EventItem
