import {
  Avatar,
  Box,
  BoxProps,
  Flex,
  forwardRef,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { FiPackage } from 'react-icons/fi'
import type { DependencyInfo } from '../../engine'

export interface DependencyProps extends BoxProps {
  info: DependencyInfo
}

export const Dependency = forwardRef<DependencyProps, 'div'>(
  ({ info, ...props }, ref) => {
    return (
      <Box ref={ref} rounded="md" px={3} py={2} borderWidth="1px" {...props}>
        <Flex alignItems="center">
          <Avatar src={info.avatarUrl} size="sm" />
          <Box ml={3}>
            <a href={info.repoUrl}>
              <Heading
                as="h3"
                fontSize="md"
                _hover={{
                  textDecoration: 'underline',
                }}
                dangerouslySetInnerHTML={{
                  __html: info.prettyName,
                }}
              />
            </a>
            <a href={`https://github.com/${info.owner}`}>
              <Text
                fontSize="sm"
                color={useColorModeValue('gray.500', 'gray.500')}
                _hover={{
                  textDecoration: 'underline',
                }}
              >
                @{info.owner}
              </Text>
            </a>
          </Box>
          <Flex flexDirection="row" ml="auto" alignItems="center" opacity={0.7}>
            {/* <IconButton
              as="a"
              href={info.repoUrl}
              size="xs"
              aria-label="Repository"
              icon={<FiGithub />}
              variant="ghost"
              rounded="full"
            /> */}
            <IconButton
              as="a"
              href={`https://www.npmjs.com/package/${info.packageName}`}
              size="sm"
              aria-label="NPM Package"
              icon={<FiPackage />}
              variant="ghost"
              rounded="full"
            />
          </Flex>
        </Flex>
      </Box>
    )
  }
)
