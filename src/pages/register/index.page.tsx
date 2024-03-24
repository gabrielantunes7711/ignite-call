import { Button, Heading, MultiStep, Text, TextInput } from '@coderise-ui/react'
import { Container, Form, FormError, Header } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '../../lib/axios'
import { AxiosError } from 'axios'
import { NextSeo } from 'next-seo'

type RegisterFormData = z.infer<typeof registerFormSchema>

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres.' })
    .regex(/^[a-z_-]+$/, { message: 'Use apenas letras minúsculas hifens e underlines.' }),
  name: z
    .string()
    .min(3, { message: 'Mínimo de 3 caracteres.' })
    .regex(/^[a-z ]+$/i, { message: 'Não utilize números' }),
})

export default function Register() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  async function handleRegister(data: RegisterFormData) {
    const { name, username } = data

    try {
      await api.post('/users', {
        name,
        username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        alert(error.response.data.message)

        return
      }

      console.log(error)
    }
  }

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas
            informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text>Nome de usuário</Text>
            <TextInput prefix="ignite.com/" placeholder="seu_usuario" {...register('username')} />
            {errors.username && <FormError size="sm">{errors.username.message}</FormError>}
          </label>

          <label>
            <Text>Nome completo</Text>
            <TextInput placeholder="Seu Nome" {...register('name')} />
            {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
