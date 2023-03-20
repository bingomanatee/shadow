import { ReactNode } from 'react'
import { ReactNodeArray } from 'prop-types'

export type GenericPageProps = { children: ReactNode | ReactNodeArray | null };

export type Message = {
  header?: string,
  footer?:string,
  text: string,
  id?: string,
  timeout?: number | false,
  status: string
}
export type UserObj = {
  email: string,
  aud: string,
  id: string
}
export type GlobalStateValue = {
  user?: UserObj,
  width: number,
  height: number,
  messages: Message[],
  closing: string[],
}

export type RecordStateValues = {
  lines: string[],
  recording: boolean,
  name: string,
  progress: unknown,
  savePrompt?: string
}

export type NewAccount = {
  name?: string,
  email: string,
  manager?: string,
  notes?: string
}
export type Account = {
  uid: string,
  account_owner: boolean,
} & NewAccount;
