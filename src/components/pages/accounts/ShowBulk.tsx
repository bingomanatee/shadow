import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Layer,
  Select,
  Text,
  TextInput,
  CheckBox,
  Tabs, Tab, TextArea, DataTable, ResponsiveContext
} from 'grommet'
import ModalFrame from '@/components/ModalFrame'
import FormItem from '@/components/FormItem'
import Image from 'next/image'
import { ChangeEvent, ChangeEventHandler, useCallback, useContext, useMemo } from 'react'
import ErrorMessage from '@/components/ErrorMessage'
import { Account, NewAccount } from '@/lib/types'
import { accountToLabel } from '@/pages/accounts'


const emailError = (email: string, accounts: Account[]) => {
  if (!email) {
    return 'Required';
  }
  if (accounts && accounts.find((account: Account) => account.email.toLowerCase().trim() === email.toLowerCase().trim())) {
    return 'Exists'
  }
  if (!/^.*@.*\.[\w]{2,}$/.test(email)) {
    return 'Use Email Format (name@domain.suffix)';
  }
  return null;
}

export function ShowBulk({
                           bulkAccounts,
                           handleClose,
                           accounts,
                           manager,
                           commitMany,
                           setManager,
                         }: {
  manager: string,
  handleClose: () => void,
  accounts: Account[],
  setManager: (e: unknown) => void,
  bulkAccounts: NewAccount[],
  commitMany: () => void,
}) {

  const size = useContext(ResponsiveContext)

  return (<Layer modal background="transparent" onClickOutside={handleClose}>
    <ModalFrame plain size={800}>
      <Card background="light-1"
            border={{ size: '1px' }}>
        <CardHeader pad={'small'}>
          <Box fill="horizontal" justify="between">
            <Heading level={3} fill
                     margin="0">
              Commit these {bulkAccounts.length} bulk accounts?
            </Heading>
          </Box>
          <Button plain onClick={handleClose}
                  icon={<Image alt="close-icon"
                               src="/img/icons/close.svg"
                               width="20"
                               height="20"/>}
                  hoverIndicator/>
        </CardHeader>
        <CardBody pad="small">
          <FormItem label="Manager">
            <Select name="manager" value={manager} onChange={setManager}
                    labelKey="label"
                    valueKey="value"
                    options={[
                      { value: '', label: '(no manager)' },
                      ...accounts.map((acc) => ({
                        value: acc.uid, label: accountToLabel(acc)
                      }))
                    ]}/>
          </FormItem>
          <Text textAlign="center" size="small">Optional -- if set then <b>All</b> of these accounts will have that manager!</Text>
          <Box height={{ max: '33vh' }} overflow="scroll">
            <DataTable columns={[
              { property: 'email', header: 'Email' },
              { property: 'name', header: 'Name', size: size === 'large' ? '400px' : '25vw', },
            ]} data={bulkAccounts}/>
          </Box>
          <FormItem label={<>&nbsp;</>}>
            <Button plain={false} onClick={commitMany} disabled={!bulkAccounts.length} primary>Add Accounts</Button>
          </FormItem>
        </CardBody>
      </Card>
    </ModalFrame>
  </Layer>)
}
