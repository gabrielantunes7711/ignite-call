export interface GetWeekDaysParams {
  weekDayFormat?: 'long' | 'short' | 'narrow'
  toUppercase?: boolean
}

export function getWeekDays({
  weekDayFormat = 'long',
  toUppercase = false,
}: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('pt-br', { weekday: weekDayFormat })

  return Array.from(Array(7).keys()).map((day) => {
    if (toUppercase) {
      return formatter.format(new Date(Date.UTC(2021, 5, day))).toUpperCase()
    }

    return formatter.format(new Date(Date.UTC(2021, 5, day)))
  })
}
