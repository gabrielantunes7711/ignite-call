import { Heading, Text, styled } from '@coderise-ui/react'

export const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
  minHeight: '100vh',
  justifyContent: 'center',
  padding: '$5',

  '@media (max-width: 1200px)': {
    flexDirection: 'column',
  },

  '.home-bg': {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '-1',
  },
})

export const Hero = styled('div', {
  maxWidth: '480px',
  flexShrink: 0,

  [`> ${Heading}`]: {
    '@media (max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  flex: 1,
  maxWidth: '750px',

  '@media (max-width: 1200px)': {
    flex: 'none',
  },

  img: {
    width: '100%',
    height: 'auto',
  },
})
