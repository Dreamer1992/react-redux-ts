// styles
import './Calendar.css'

const Calendar = () => {
    return (
        <div className="calendar">
            <div className="calendar-day">
                <div className="calendar-day-label">
                    <span>2 February</span>
                </div>

                <div className="calendar-events">
                    <div className="calendar-event">
                        <div className="calendar-event-info">
                            <div className="calendar-event-time">
                                10:00 - 12:00
                            </div>
                            <div className="calendar-event-title">
                                Learning Typescript
                            </div>
                        </div>

                        <button className="calendar-event-delete-button">
                            &times;
                        </button>
                    </div>
                </div>
            </div>

            <div className="calendar-day">
                <div className="calendar-day-label">
                    <span>1 February</span>
                </div>

                <div className="calendar-events">
                    <div className="calendar-event">
                        <div className="calendar-event-info">
                            <div className="calendar-event-time">
                                10:00 - 12:00
                            </div>
                            <div className="calendar-event-title">
                                Learning Typescript
                            </div>
                        </div>

                        <button className="calendar-event-delete-button">
                            &times;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calendar
