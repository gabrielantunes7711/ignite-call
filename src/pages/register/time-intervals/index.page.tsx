import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from '@coderise-ui/react'
import { Header, Container } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, Form, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '../../../utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '../../../utils/convert-time-string-to-minutes'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      }))
    )
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        )
      },
      {
        message: 'O intervalo de horário deve ser igual ou maior a 1h.',
      }
    ),
})

export default function TimeIntervals() {
  const router = useRouter()
  const weekDays = getWeekDays()

  const {
    register,
    formState: { isSubmitting, errors },
    control,
    watch,
  } = useForm({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const { fields } = useFieldArray({
    name: 'intervals',
    control,
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    await api.post('/users/time-intervals', data)

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>

          <Text>
            Defina o intervalo de horários que você está disponível em cada dia da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </Header>

        <Form<TimeIntervalsFormInput, TimeIntervalsFormOutput>
          control={control}
          onSubmit={({ data }) => handleSetTimeIntervals(data)}
        >
          <IntervalBox>
            <IntervalsContainer>
              {fields.map((field, i) => (
                <IntervalItem key={field.id}>
                  <IntervalDay>
                    <Controller
                      name={`intervals.${i}.enabled`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value}
                        />
                      )}
                    />
                    <Text>{weekDays[field.weekDay]}</Text>
                  </IntervalDay>

                  <IntervalInputs>
                    <TextInput
                      size="sm"
                      type="time"
                      step="60"
                      {...register(`intervals.${i}.startTime`)}
                      disabled={!intervals[i].enabled}
                    />
                    <TextInput
                      size="sm"
                      type="time"
                      step="60"
                      {...register(`intervals.${i}.endTime`)}
                      disabled={!intervals[i].enabled}
                    />
                  </IntervalInputs>
                </IntervalItem>
              ))}
            </IntervalsContainer>

            {errors.intervals && <FormError size="sm">{errors.intervals?.root?.message}</FormError>}

            <Button type="submit" disabled={isSubmitting}>
              Próximo passo
              <ArrowRight />
            </Button>
          </IntervalBox>
        </Form>
      </Container>
    </>
  )
}
