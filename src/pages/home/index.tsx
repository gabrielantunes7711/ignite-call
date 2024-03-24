import { Heading, Text } from '@coderise-ui/react'
import { Container, Hero, Preview } from './styles'
import Image from 'next/image'

import previewImg from '../../assets/app-preview.png'
import homeBg from '../../assets/home-bg.jpg'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />

      <Container>
        <Image src={homeBg} alt="" className="home-bg" quality={100} />

        <Hero>
          <Heading as="h1" size="3xl">
            Agendamento descomplicado
          </Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImg}
            alt="Calendário simbolizando aplicação em funcionamento"
            height={400}
            quality={100}
            priority
          />
        </Preview>
      </Container>
    </>
  )
}
