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
  Tabs, Tab, TextArea
} from 'grommet'
import ModalFrame from '@/components/ModalFrame'
import FormItem from '@/components/FormItem'
import Image from 'next/image'
import { ChangeEvent, ChangeEventHandler, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ErrorMessage from '@/components/ErrorMessage'
import { Account } from '@/lib/types'
import { accountToLabel } from '@/pages/accounts'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import { GlobalStateContext } from '@/components/GlobalState'
import { Forest } from '@wonderlandlabs/forest'
import { AccountsStateValue } from '@/components/AddAccount'


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

export function AddAccountForm({
                                 state
                               }: {
  state: Leaf
}) {

  const [value, setValue] = useState<AccountsStateValue>({
    bulkAccounts: [],
    bulkNames: '',
    accounts: [],
    name: '',
    email: '',
    account_owner: false,
    manager: '',
    showAddAccount: false,
    showBulkPrompt: false
  });

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  const {email, name, accounts, account_owner, bulkNames, manager} = value;

  const emailErrorMessage = useMemo(() => emailError(email, accounts), [email, accounts]);

  return (<Layer modal background="transparent" onClickOutside={state.do.close}>
    <ModalFrame plain size={800}>
      <Card background="light-1"
            border={{ size: '1px' }}>
        <CardHeader pad={'small'}>
          <Box fill="horizontal" justify="between">
            <Heading level={3} fill
                     margin="0">
              Add An Account
            </Heading>
          </Box>
          <Button plain onClick={state.do.close}
                  icon={<Image alt="close-icon"
                               src="/img/icons/close.svg"
                               width="20"
                               height="20"/>}
                  hoverIndicator/>
        </CardHeader>
        <CardBody pad="small">
          <Text>Add one (or more) accounts to the accounts list</Text>
          <Tabs>
            <Tab title="Single Account">
              <FormItem label="Name">
                <TextInput name="name" value={name} onChange={state.do.updateName}/>
              </FormItem>
              <FormItem label="Email">
                <TextInput type="email" name="email" value={email} onChange={state.do.updateEmail}/>
              </FormItem>
              <ErrorMessage>{emailErrorMessage}</ErrorMessage>
              <FormItem label="Account Owner" align="start">
                <CheckBox name="account_owner" label="Account Owner" pad="0" checked={account_owner} onChange={state.do.updateAccountOwner}/>
              </FormItem>
              <FormItem label="Manager">
                <Select name="manager" value={manager} onChange={state.do.updateManager}
                        labelKey="label"
                        valueKey="value"
                        options={[
                          { value: '', label: '(no manager)' },
                          ...accounts.map((acc: Account) => ({
                            value: acc.uid, label: accountToLabel(acc)
                          }))
                        ]}/>
              </FormItem>


              <FormItem label={<>&nbsp;</>}>
                <Button plain={false} onClick={state.do.commit} disabled={!!emailErrorMessage} primary>Add</Button>
              </FormItem>
            </Tab>
            <Tab title="Bulk Upload">
              <TextArea rows={10} name="bulk_names" value={bulkNames} onChange={state.do.updateBulkNames}>
              </TextArea>
              <FormItem label={<>&nbsp;</>}>
                <Button plain={false} onClick={state.do.commitMany} disabled={!bulkNames} primary>Add Many</Button>
              </FormItem>
            </Tab>
          </Tabs>

        </CardBody>
      </Card>
    </ModalFrame>
  </Layer>)
}
