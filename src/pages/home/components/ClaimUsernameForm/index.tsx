import { Button, TextInput } from '@coderise-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres.' })
    .regex(/^[a-z_-]+$/, { message: 'Use apenas letras minúsculas hifens e underlines.' }),
})

export function ClaimUsernameForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUserNameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu_usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation size="sm">
        {errors.username ? errors.username.message : 'Digite o nome do usuário desejado'}
      </FormAnnotation>
    </>
  )
}
