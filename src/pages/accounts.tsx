import { ChangeEvent, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GlobalStateContext } from '@/components/GlobalState'
import axios from 'axios'
import {
  Box,
  Button,
  ColumnConfig,
  DataTable,
  Heading,
  PageHeader,
  Paragraph,
  ResponsiveContext,
  Text,
  TextInput
} from 'grommet'
import Link from 'next/link'
import dayjs, { Dayjs } from 'dayjs'
import { Forest } from '@wonderlandlabs/forest'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import AddAccount from '@/components/AddAccount'
import { Checkbox, CheckboxSelected, Search } from 'grommet-icons'
import FormItem from '@/components/FormItem'
import { short } from '@/lib/utils'


function accountConfig() {
  return ({
    $value: {
      accounts: [],
      selected: [],
      search: '',
    },
    actions: {
      async deleteSelected(leaf: Leaf) {
        await axios.post('/api/accounts/delete', { ids: leaf.value.selected });
        leaf.do.load();
      },
      updateSearch(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
        leaf.do.set_search(e.target.value);
      },
      async load(leaf: Leaf) {
        console.log('accp loading');
        const response = await axios.get('/api/accounts/list');
        let data = response.data.accounts;
        leaf.do.set_accounts(data);
      }
    }
  });
}

type Account = {
  uid: string,
  email: string,
  name?: string,
  date?: Dayjs,
  timestamp?: number,
  account_owner: boolean,
  manager?: string,
}

type AccountStateValue = {
  accounts: Account[],
  search: string,
  selected: string[],
}

export function accountToLabel(a: Account) {
  return `${a.email} (${a.name})`;
}

function Accounts() {
  const { state: globalState, value: globalValue } = useContext(GlobalStateContext)
  const [value, setValue] = useState<AccountStateValue>({ accounts: [], selected: [], search: '', });
  const size = useContext(ResponsiveContext);

  const state = useMemo(() => {
    const newState = new Forest(accountConfig());
    if (globalState?.value.user) {
      newState.do.load();
    }
    return newState;
  }, [globalState]);


  const searchMe = useCallback((a: Account) => {
    if (!value.search) return true;
    const searchPhrase = value.search.trim().toLowerCase();
    if (!searchPhrase) return true;
    for (const key of Object.keys(a)) {
        // @ts-ignore
      const fieldValue: any = a[key];
        if (!fieldValue) continue;
        if (`${fieldValue}`.toLowerCase().includes(searchPhrase)) return true;
    }
    return false;
  }, [value.search]);

  const columns: ColumnConfig<any>[] = useMemo(() => ([
    {
      property: 'uid',
      header: 'User ID',
      primary: true,
      size: size === 'large' ? '250px' : '15vw',
      render: short('uid')
    },
    { property: 'email', header: 'Email', sortable: true },
    { property: 'name', header: 'Name', size: size === 'large' ? '400px' : '25vw', sortable: true },
    {
      property: 'manager', header: 'Manager', size: size === 'large' ? '400px' : '25vw', sortable: true,
      render(a: Account) {
        if (!a.manager) {
          return '';
        }
        const manager = value.accounts.find((mgr) => mgr.uid === a.manager);
        console.log('manager for', a, 'is', manager, 'from', value.accounts);
        if (manager) {
          return <Text truncate>{accountToLabel(manager)}</Text>;
        }
        return '';
      }
    },
    {
      property: 'account_owner', header: 'Owner', size: '200px', render(a: Account) {
        return a.account_owner ? <CheckboxSelected color="darkgreen"/> : <Checkbox color="lightgrey"/>
      }
    }
  ]), [value.accounts]);

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  if (!globalValue.user) {
    return <article>
      <Heading level={1}>Please Log In</Heading>
      <Paragraph>You must be logged in to view this page</Paragraph>
    </article>
  }

  return (
    <article>
      <PageHeader pad={{ top: '', bottom: 'medium' }} parent={<Link href="/"><Text color="anchor">Home</Text></Link>}
                  title="Accounts"
                  subtitle=""/>

      <Box direction="row">
      <Box width="1/4">
        <TextInput  icon={<Search />} name="search" value={value.search} onChange={state.do.updateSearch} />
      </Box>
      </Box>

      <DataTable fill="horizontal" data={value.accounts.filter(searchMe)} select={value.selected} onSelect={state.do.set_selected}
                 sort={{ property: 'timestamp', direction: 'desc' }}
                 columns={columns}/>

      <Box gap="large" direction="row" align="baseline">
        <AddAccount refresh={state.do.load}/>
        <Button onClick={state.do.deleteSelected} plain={false} disabled={!value?.selected?.length}>
        Delete Selected
      </Button>
      </Box>
    </article>
  )
}

export default Accounts;
