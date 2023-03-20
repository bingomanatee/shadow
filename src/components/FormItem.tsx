import { ReactNode, useContext } from 'react'
import { Box, Text, ResponsiveContext } from 'grommet'
import { GenericPageProps } from '@/lib/types'


export default function FormItem({
                                   children,
                                   align = 'baseline',
                                   label,
                                   vertical = false
                                 }: { label: string | ReactNode, vertical?: boolean, align?: string } & GenericPageProps) {
  const size = useContext(ResponsiveContext);

  if (vertical || (size === 'small')) {
   return <Box direction="column" gap="small" align="baseline" margin={{ top: 'xxsmall', bottom: 'xsmall' }}>
      <Text>{label}</Text>
      {children}
    </Box>
  }

  return (
    <Box direction="row" gap="medium" align={align} margin={{ top: 'xxsmall', bottom: 'xsmall' }}>
      <Box width="min(400px, 33%)" direction="row" align="baseline"><Text>{label}</Text></Box>
      <Box flex align="baseline">{children}</Box>
    </Box>
  )
}
