import { Container } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Stack Badge</title>
        <meta name="description" content="Show off your stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>Foo</main>
    </Container>
  )
}

export default Home
