import { Nav, Box } from 'grommet'
import Link from 'next/link'
import { Microphone, Home } from 'grommet-icons'
import UserLogin from '@/components/UserLogin'
import IconPair from './IconPair'
import { useContext } from 'react'
import { GlobalStateContext } from '@/components/GlobalState'
import Image from 'next/image'

export default function Navigation() {
  const { value } = useContext(GlobalStateContext)
  return (
    <Nav pad="small" direction="row">
      <Box direction="row" justify="between" fill="horizontal">
        <Box direction="row" gap="large">
          <Link href={"/"}>
            <IconPair icon={<Home/>}>Home Page</IconPair>
          </Link>
          <Link href={"/record"}>
            <IconPair icon={<Microphone/>}>Record Conversation</IconPair>
          </Link>
          {value.user &&
            <Link href={"/transcripts"}>
              <IconPair icon={<Image src="/img/icons/transcripts.svg" width={20} height={20}
                                     alt="transcript-icon"/>}>Transcripts</IconPair>

            </Link>}
          {value.user && <Link href={"/accounts"}>
            <IconPair icon={<Image src="/img/icons/accounts.svg" width={20} height={20}
                                   alt="transcript-icon"/>}>Accounts</IconPair>
          </Link>}
        </Box>

        <UserLogin/>
      </Box>
    </Nav>
  )
}
