import { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'

// types
import { RootState } from '../../redux/store'
import { IUserEvent } from '../../redux/user-events'

// selectors
import { selectUserEventsArray } from '../../redux/user-events'

// thunks
import { loadUserEvents } from '../../redux/user-events'

// utils
import { addZero } from '../../lib/utils'

// styles
import './Calendar.css'

const mapState = (state: RootState) => ({
    events: selectUserEventsArray(state),
})

const mapDispatch = {
    loadUserEvents,
}

const connector = connect(mapState, mapDispatch)

type TPropsFromRedux = ConnectedProps<typeof connector>

interface IProps extends TPropsFromRedux {}

const createDateKey = (date: Date) => {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()

    return `${year}-${addZero(month)}-${addZero(day)}`
}

const groupEventsByDay = (events: IUserEvent[]) => {
    const groups: Record<string, IUserEvent[]> = {}

    const addToGroup = (dateKey: string, event: IUserEvent) => {
        if (groups[dateKey] === undefined) {
            groups[dateKey] = []
        }

        groups[dateKey].push(event)
    }

    events.forEach((event) => {
        const dateStartKey = createDateKey(new Date(event.dateStart))
        const dateEndKey = createDateKey(new Date(event.dateEnd))

        addToGroup(dateStartKey, event)

        if (dateEndKey !== dateStartKey) {
            addToGroup(dateEndKey, event)
        }
    })

    return groups
}

const Calendar = ({ events, loadUserEvents }: IProps) => {
    useEffect(() => {
        loadUserEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined
    let sortedGroupKeys: string[] | undefined

    if (events.length) {
        groupedEvents = groupEventsByDay(events)
        sortedGroupKeys = Object.keys(groupedEvents).sort(
            (date1, date2) => +new Date(date2) - +new Date(date1)
        )
    }

    return groupedEvents && sortedGroupKeys ? (
        <div className="calendar">
            {sortedGroupKeys.map((dayKey) => {
                const events = groupedEvents ? groupedEvents[dayKey] : []
                const groupDate = new Date(dayKey)
                const day = groupDate.getDate()
                const month = groupDate.toLocaleString(undefined, {
                    month: 'long',
                })

                return (
                    <div key={dayKey} className="calendar-day">
                        <div className="calendar-day-label">
                            <span>
                                {day} {month}
                            </span>
                        </div>

                        <div className="calendar-events">
                            {events.map((event) => (
                                <div key={event.id} className="calendar-event">
                                    <div className="calendar-event-info">
                                        <div className="calendar-event-time">
                                            10:00 - 12:00
                                        </div>
                                        <div className="calendar-event-title">
                                            {event.title}
                                        </div>
                                    </div>

                                    <button className="calendar-event-delete-button">
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    ) : (
        <p>Loading...</p>
    )
}

export default connector(Calendar)
