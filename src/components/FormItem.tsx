import { ReactNode, useContext } from 'react'
import { Box, Text, ResponsiveContext } from 'grommet'
import { GenericPageProps } from '@/lib/types'


export default function FormItem({
                                   children,
                                   align = 'baseline',
                                   label
                                 }: { label: string | ReactNode, align?: string } & GenericPageProps) {
  const size = useContext(ResponsiveContext);

  if (size === 'small') {
    <Box direction="column" gap="small" align="baseline" margin={{ top: 'small', bottom: 'medium' }}>
      <Text>{label}</Text>
      {children}
    </Box>
  }

  return (
    <Box direction="row" gap="medium" align={align} margin={{ top: 'small', bottom: 'small' }}>
      <Box width="min(400px, 33%)" direction="row" align="baseline"><Text>{label}</Text></Box>
      <Box flex align="baseline">{children}</Box>
    </Box>
  )
}
