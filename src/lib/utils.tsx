import { ReactNode } from 'react'
import { Text } from 'grommet'

export function short(key: string) {
  return function Short(data: Record<string, ReactNode>) {
    if (!(data && typeof data === 'object')) {
      return '';
    }
    return <Text truncate>{data[key]}</Text>
  }
}
