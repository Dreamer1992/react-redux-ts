import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from 'redux'

// third-party
import cx from 'classnames'

// actions
import { start, stop } from '../../redux/recorder'

// selectors
import { selectDateStart } from '../../redux/recorder'

// utils
import { addZero } from '../../lib/utils'

// thunks
import { createUserEvent } from '../../redux/user-events'

// styles
import './Recorder.css'

const Recorder = () => {
    const dispatch = useDispatch()

    const dateStart = useSelector(selectDateStart)

    const [, setCount] = useState(0)

    const started = dateStart !== ''
    let interval = useRef<number>(0)

    const handleClickDateStart = () => {
        if (started) {
            window.clearInterval(interval.current)

            dispatch(createUserEvent() as unknown as AnyAction)

            dispatch(stop())
        } else {
            dispatch(start())

            interval.current = window.setInterval(() => {
                setCount((prevState) => prevState + 1)
            }, 1000)
        }
    }

    useEffect(() => {
        return () => {
            window.clearInterval(interval.current)
        }
    }, [])

    let seconds = started
        ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
        : 0
    const hours = seconds ? Math.floor(seconds / 60 / 60) : 0
    seconds -= hours * 60 * 60
    const minutes = seconds ? Math.floor(seconds / 60) : 0
    seconds -= minutes * 60

    return (
        <div className={cx('recorder', { 'recorder-started': started })}>
            <button onClick={handleClickDateStart} className="recorder-record">
                <span />
            </button>

            <div className="recorder-counter">
                {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
            </div>
        </div>
    )
}

export default Recorder
