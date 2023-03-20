import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Heading,
  Layer,
  Menu,
  ResponsiveContext,
  Tab,
  Tabs, Text,
  TextInput
} from 'grommet'
import { User } from 'grommet-icons'
import IconPair from '@/components/IconPair'
import { Forest } from '@wonderlandlabs/forest'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import FormItem from '@/components/FormItem'
import { FormView } from 'grommet-icons'
import ErrorMessage from '@/components/ErrorMessage'
import ModalFrame from '@/components/ModalFrame'
import userLoginState, { UserLoginStateValue } from '../lib/userLoginState'
import { GlobalStateContext } from '@/components/GlobalState'
import Image from 'next/image'

type LoginFormProps = {
  state: Leaf
}

function LoginForm({ state }: LoginFormProps) {
  const emailButton = (<FormItem label="User name">
    <TextInput name="email" type="email" value={state.value.email} onChange={state.do.changeEmail}/>
  </FormItem>)
  const passwordButton = (
    <FormItem label={
      <Box gap="medium" direction="row">
        <Text style={{whiteSpace: 'nowrap'}}>Password</Text>
        <Button onClick={state.do.toggleShowPasswords}><FormView/></Button>
      </Box>
    }>
      <TextInput name="password" value={state.value.password}
                 type={state.value.showPasswords ? 'text' : "password"}
                 onChange={state.do.changePassword}/>
    </FormItem>

  )
  return (state && <Layer background="modal-background" modal>
    <ModalFrame size={600} plain>
      <Card height="small" width="small" background="light-1" fill elevation="none">
        <CardHeader pad={{ top: 'small', right: 'small', left: 'small' }} background="light-2">
          <Box fill="horizontal" flex>
            <Heading level="2" textAlign="center" >Log In or Sign Up</Heading>
          </Box>
          <Button onClick={state.do.close}
                  icon={<Image alt="close-icon" src="/img/icons/close.svg" width="20" height="20"/>}
                  hoverIndicator/>
        </CardHeader>
        <CardBody pad={{ top: 'large', right: 'medium', left: 'medium', bottom: 'medium' }}>
          <Tabs>
            <Tab title="Sign In">
              {emailButton}
              {passwordButton}
              {state.value.joinError && <ErrorMessage>{state.value.joinError}</ErrorMessage>}

              <FormItem label={<>&nbsp;</>}>
                <Button disabled={!state.do.logInnable()} onClick={state.do.login} primary plain={false}>Sign In</Button>
              </FormItem>
            </Tab>

            <Tab title="New Account">
              {emailButton}
              {passwordButton}
              <FormItem label="Password2">
                <TextInput name="password2" value={state.value.password2}
                           type={state.value.showPasswords ? 'text' : "password"}
                           onChange={state.do.changePassword2}/>

              </FormItem>

              {state.value.joinError && <ErrorMessage>{state.value.joinError}</ErrorMessage>}

              <FormItem label={<>&nbsp;</>}>
                <Button disabled={!state.do.joinable()} onClick={state.do.join} primary plain={false}>Create New Account</Button>
              </FormItem>
            </Tab>
          </Tabs>
        </CardBody>
        <CardFooter pad={{ horizontal: "small" }} background="light-2" direction="row-reverse">

        </CardFooter>
      </Card>
    </ModalFrame>
  </Layer>)
}

export default function UserLogin({}) {
  const [value, setValue] = useState<UserLoginStateValue>({
    password: '',
    password2: '',
    showLogin: false,
    showPasswords: false,
    email: ''
  });
  const { state: globalState, value: globalValue } = useContext(GlobalStateContext)

  const state = useMemo(() => new Forest(userLoginState(globalState)), [globalState]);

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);


  if (globalValue?.user) {
    console.log('logged in as ', globalValue?.user);
    const head = `Logged in as ${globalValue.user.email.replace(/^([^@]+)@(.{3}).*/,
      (match: string, name: string, suffix: string) => `${name}@${suffix}...`)}`
    return (<Menu items={[
      { label: 'Log Out', onClick: globalState?.do.logout }
    ]}>
      <IconPair icon={<User color="grey"/>}>
        {head}
      </IconPair>
    </Menu>)
  }

  return (
    <>
      {
        value.showLogin && <LoginForm state={state}/>
      }
      <Button plain onClick={state.do.initLogin}>
        <IconPair icon={<User/>}>
          Log In
        </IconPair>
      </Button>
    </>
  )
}
