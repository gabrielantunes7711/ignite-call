import { Avatar, Button, Heading, MultiStep, Text, Textarea } from '@coderise-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { Session } from 'next-auth'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

interface UpdateProfileProps {
  session: Session | null
}
type updateProfileData = z.infer<typeof updateProfileSchema>

const updateProfileSchema = z.object({
  bio: z.string(),
})

export default function UpdateProfile({ session }: UpdateProfileProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  async function handleUpdateProfile(data: updateProfileData) {
    const { bio } = data

    await api.put('/users/profile', { bio })

    await router.push(`/schedule/${session?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>

          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas
            informações depois.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text>Foto de perfil</Text>
            <Avatar src={session?.user.avatar_url} width={64} height={64} />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <Textarea rows={6} {...register('bio')} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<UpdateProfileProps> = async ({ req, res }) => {
  const session = await getServerSession(req, res, buildNextAuthOptions(req, res))

  return {
    props: {
      session,
    },
  }
}
