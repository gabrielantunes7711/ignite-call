import { Box, Heading, Text, styled } from '@coderise-ui/react'

export const Container = styled('main', {
  maxWidth: '580px',
  margin: '$20 auto $4',
  padding: '0 $5',
})

export const Header = styled('div', {
  padding: '0 $6',

  [`> ${Heading}`]: {
    lineHeight: '$base',
  },

  [`> ${Text}`]: {
    color: '$gray200',
    marginBottom: '$6',
  },
})

export const Form = styled(Box, {
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',

  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  },
})

export const FormError = styled(Text, {
  color: '#f75a68',
})
