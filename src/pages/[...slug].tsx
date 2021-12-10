import { Container, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { DependencyInfo, process } from '../modules/engine'
import { Dependency } from '../modules/ui/components/Dependency'

export interface RepoPageProps {
  dependencies: DependencyInfo[]
  devDependencies: DependencyInfo[]
}

const RepoPage: NextPage<RepoPageProps> = ({
  dependencies,
  devDependencies,
}) => {
  return (
    <Container py={12}>
      <SimpleGrid columns={2} gap={8}>
        <VStack spacing={4}>
          <Heading as="h2" fontSize="xl">
            Made with
          </Heading>
          {dependencies.map((info) => (
            <Dependency key={info.packageName} info={info} width="100%" />
          ))}
        </VStack>
        <VStack spacing={4}>
          <Heading as="h2" fontSize="xl">
            Tooling powered by
          </Heading>
          {devDependencies.map((info) => (
            <Dependency key={info.packageName} info={info} width="100%" />
          ))}
        </VStack>
      </SimpleGrid>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps<RepoPageProps> = async (
  ctx
) => {
  try {
    if (!ctx.params) {
      throw new Error('missing params')
    }
    if (!ctx.params.slug || typeof ctx.params.slug === 'string') {
      throw new Error('slug should be an array')
    }
    const slug = ctx.params.slug.join('/')
    const { dependencies, devDependencies } = await process(slug)
    return {
      props: {
        dependencies,
        devDependencies,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}

export default RepoPage
