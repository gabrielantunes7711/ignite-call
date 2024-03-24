import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarActions,
  CalendarBody,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
  Container,
} from './styles'
import { getWeekDays } from '../../utils/get-week-days'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { api } from '../../lib/axios'

interface CalendarWeek {
  week: number
  days: {
    date: Dayjs
    disabled: boolean
  }[]
}

interface CalendarProps {
  selectedDate: Date | null
  onDateSelected: (date: Date) => void
}

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar({ onDateSelected, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))
  const router = useRouter()

  const username = String(router.query.username)
  const year = currentDate.get('year')
  const month = currentDate.get('month')

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: ['blocked-dates', year, month],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year,
          month: month + 1,
        },
      })

      return response.data
    },
  })

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) return []

    const daysInMonthArray = Array.from({ length: currentDate.daysInMonth() }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')
    const lastWeekDay = currentDate.set('date', currentDate.daysInMonth())

    const previousMonthFillArray = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const daysToComplete = 42 - (daysInMonthArray.length + previousMonthFillArray.length)

    const nextMonthFillArray = Array.from({ length: daysToComplete }).map((_, i) => {
      return lastWeekDay.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => ({
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          blockedDates.blockedWeekDays.includes(date.get('day')) ||
          blockedDates.blockedDates.includes(date.get('date')),
      })),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeek[]>((weeks, _, i, original) => {
      const isNewWeek = i % 7 === 0

      if (isNewWeek) {
        weeks.push({
          week: i / 7 + 1,
          days: original.slice(i, i + 7),
        })
      }

      return weeks
    }, [])

    return calendarWeeks
  }, [currentDate, blockedDates])

  const weekDays = getWeekDays({ weekDayFormat: 'short', toUppercase: true })
  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  function handlePreviousMonth() {
    setCurrentDate((state) => state.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate((state) => state.add(1, 'month'))
  }

  return (
    <Container>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ disabled, date }) => (
                  <td key={date.toString()}>
                    <CalendarDay disabled={disabled} onClick={() => onDateSelected(date.toDate())}>
                      {date.get('date')}
                    </CalendarDay>
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </Container>
  )
}
