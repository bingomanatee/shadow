import Image from 'next/image'
import { Box } from 'grommet'
import { useCallback, useMemo } from 'react'
import { GenericPageProps } from '@/lib/types'

export default function CheckButton({ value, onChange, onClick, children, add = false }: {
  value?: boolean,
  onChange?: (e:  {target: { value: boolean } }) => void,
  onClick?: () => void,
  add?: boolean
} & GenericPageProps) {
  let background = value ? 'box-button-on' : 'box-button-off';
  if (add) {
    background = '';
  }

  const iconUrl = useMemo(() => {
    if (add) {
      return '/img/icons/box-button-add.svg';
    }
    return value ? '/img/icons/box-button-on.svg' : '/img/icons/box-button-off.svg';
  }, [add, value]);

  return <Box direction="row" gap="medium" fill="horizontal" pad="xsmall"
              background={background}
              margin={{ vertical: 'xsmall' }}
              onClick={add ? onClick : () => onChange && onChange({ target: { value: !value } })}>
    <Image alt="check-icon" src={iconUrl}
           width={24} height={24}/>
    {children}
  </Box>
}
