import { Button, Text, TextInput, Textarea } from '@coderise-ui/react'
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { api } from '../../../../../lib/axios'
import { useRouter } from 'next/router'

interface ConfirmStepProps {
  schedulingDate: Date
  onCancelConfirmation: () => void
}

type confirmFormData = z.infer<typeof confirmFormSchema>

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 catacteres.' }),
  email: z.string().email({ message: 'Digite um e-mail válido.' }),
  observations: z.string().nullable(),
})

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
  const router = useRouter()
  const username = String(router.query.username)

  async function handleConfirmScheduling(data: confirmFormData) {
    const { email, name, observations } = data

    await api.post(`/users/${username}/schedule`, {
      email,
      name,
      observations,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<confirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput type="email" placeholder="jhondoe@example.com" {...register('email')} />
        {errors.email && <FormError size="sm">{errors.email.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <Textarea {...register('observations')} />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}
