import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AnyAction } from 'redux'

import {
    deleteUserEvent,
    IUserEvent,
    updateUserEvent,
} from '../../../redux/user-events'

interface IProps {
    event: IUserEvent
}

const EventItem = ({ event }: IProps) => {
    const dispatch = useDispatch()

    const [isEditTitle, setEditTitle] = useState(false)
    const [title, setTitle] = useState(event.title)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClickEditTitle = () => {
        setEditTitle(true)
    }

    useEffect(() => {
        if (isEditTitle) {
            inputRef.current?.focus()
        }
    }, [isEditTitle])

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleBlurInput = () => {
        if (title !== event.title) {
            dispatch(
                updateUserEvent({
                    ...event,
                    title,
                }) as unknown as AnyAction
            )
        }

        setEditTitle(false)
    }

    const handleDeleteEvent = (id: IUserEvent['id']) => {
        dispatch(deleteUserEvent(id) as unknown as AnyAction)
    }

    return (
        <div className="calendar-event">
            <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">
                    {isEditTitle ? (
                        <input
                            type="text"
                            ref={inputRef}
                            value={title}
                            onChange={handleChangeTitle}
                            onBlur={handleBlurInput}
                        />
                    ) : (
                        <span onClick={handleClickEditTitle}>
                            {event.title}
                        </span>
                    )}
                </div>
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
