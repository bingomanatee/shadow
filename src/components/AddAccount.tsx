import { Button } from 'grommet'
import Image from 'next/image'
import IconPair from '@/components/IconPair'
import React, { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'
import { GlobalStateContext } from '@/components/GlobalState'
import { Forest } from '@wonderlandlabs/forest'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import axios from 'axios'
import { AddAccountForm } from '@/components/pages/accounts/AddAccountForm'
import { Account, NewAccount } from '@/lib/types'
import { ShowBulk } from '@/components/pages/accounts/ShowBulk'


export type AccountsStateValue = {
  accounts: Account [],
  name: string,
  email: string,
  manager: string,
  account_owner: boolean,
  showAddAccount: boolean,
  bulkNames: string,
  bulkAccounts: NewAccount[],
  showBulkPrompt: boolean
}

const emailRE = /[^\s]+@[^\s]+\.[\w]{2,}/

function getUserDetails(str: string) {
  let [email] = str.match(emailRE) || [];
  if (!email) {
    return null;
  }
  let name = str.replace(email, '').trim();
  if (/:/.test(name)) {
    const [realName, notes] = name.split(":");
    return { email, name: realName, notes };
  }
  return { email, name };
}

function accountsState(refresh: () => void) {
  const value: AccountsStateValue = {
    bulkNames: '',
    showAddAccount: false,
    name: '',
    email: '',
    manager: '',
    account_owner: false,
    accounts: [],
    showBulkPrompt: false,
    bulkAccounts: [],
  };

  return {
    $value: value,
    actions: {
      open(leaf: Leaf) {
        leaf.do.set_showAddAccount(true);
      },
      close(leaf: Leaf) {
        leaf.do.set_showAddAccount(false);
      },
      updateName(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
        leaf.do.set_name(e.target?.value);
      },
      updateEmail(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
        leaf.do.set_email(e.target?.value);
      },
      updateAccountOwner(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
        leaf.do.set_account_owner(e.target?.checked);
      },
      updateManager(leaf: Leaf, e: ChangeEvent<HTMLInputElement> & { value: { value: unknown } }) {
        leaf.do.set_manager(e.value?.value);
      },
      updateBulkNames(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
        leaf.do.set_bulkNames(e.target?.value);
      },
      reset(leaf: Leaf) {
        leaf.do.set_email('');
        leaf.do.set_manager('');
        leaf.do.set_account_owner(false);
        leaf.do.set_name('');
      },
      async commit(leaf: Leaf) {
        const newAccount = { ...leaf.value };
        delete newAccount.accounts;
        await axios.post('/api/accounts/add', newAccount);
        leaf.do.poll();
        refresh();
        leaf.do.close();
        leaf.do.reset();
      },
      async finalCommitMany(leaf: Leaf) {
        let bulkAccounts = leaf.value.bulkAccounts;
        if (leaf.value.manager) {
          bulkAccounts = bulkAccounts.map((a: NewAccount) => {return {...a, manager: leaf.value.manager}});
        }
        await axios.post('/api/accounts/add', { bulk: bulkAccounts });
        leaf.do.poll();
        refresh();
        leaf.do.close();
        leaf.do.reset();
      },
      async commitMany(leaf: Leaf) {
        const bulkNames = leaf.value.bulkNames;
        const bulkAccounts: NewAccount[] = bulkNames.split(/\n/).map(getUserDetails)
          .filter((a: unknown) => !!a);
        leaf.do.close();
        leaf.do.set_bulkAccounts(bulkAccounts);
        leaf.do.showBulkPrompt();
      },
      showBulkPrompt(leaf: Leaf) {
        leaf.do.set_manager('');
        leaf.do.set_showBulkPrompt(true);
      },
      hideBulkPrompt(leaf: Leaf) {
        leaf.do.set_showBulkPrompt(false);
      },
      async poll(leaf: Leaf) {
        const response = await axios.get('/api/accounts/list');
        const { accounts } = response.data;
        leaf.do.set_accounts(accounts);
      }
    }
  }
}

export default function AddAccount({ refresh }: { refresh: () => void }) {
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

  const { state: globalState, value: globalValue } = useContext(GlobalStateContext)

  const state = useMemo(() => {
    const newState = new Forest(accountsState(refresh));
    newState.do.poll();
    return newState;
  }, [globalState]);

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  return <>
    <Button plain={false} primary margin={{ vertical: 'large' }} onClick={state.do.open}>
      <IconPair color="white" icon={<Image src="/img/icons/accounts.svg" width={20} height={20}
                                           alt="transcript-icon"/>}>
        Add Account
      </IconPair>
    </Button>
    {
      value.showAddAccount && <AddAccountForm state={state}   />
    }    {
    value.showBulkPrompt && <ShowBulk bulkAccounts={value.bulkAccounts}
                                      accounts={value.accounts}
                                      manager={ value.manager}
                                      setManager={state.do.updateManager}
                                      handleClose={state.do.hideBulkPrompt}
                                       commitMany={state.do.finalCommitMany}/>
  }
  </>

}
