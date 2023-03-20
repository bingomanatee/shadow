import { getSupabase } from '@/lib/getSupabase'
import {
  Box, Button,
  Card,
  CardBody,
  CardHeader, CheckBoxGroup,
  Heading,
  NameValueList,
  NameValuePair,
  ResponsiveContext,
  Text, TextArea, TextInput
} from 'grommet'
import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import FormItem from '@/components/FormItem'
import CheckButton from '@/components/CheckButton'
import { Forest } from '@wonderlandlabs/forest'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import axios from 'axios'
import { GlobalStateContext } from '@/components/GlobalState'
import { Account } from '@/lib/types'

export async function getServerSideProps({ query }: { query: Record<string, string> }) {
  const { uid } = query;
  const supabase = getSupabase();

  const { data } = await supabase.from('accounts')
    .select()
    .eq('uid', uid);

  const account = Array.isArray(data) ? data[0] : null;
  return { props: { account } }
}

type AccountConfigValue = {
  uid: string,
  url: string,
  context: string,
  basis: string[],
  qa: string[],
}

export default function AccountEdit({ account } : {account: Account}) {
  const { state: globalState } = useContext(GlobalStateContext);
  const size = useContext(ResponsiveContext);

  const [qaItems, setQaItems] = useState({
    ['appropriate-greeting']: false,
    ['verified-caller']: false,
    ['additional-help']: false
  });

  const [value, setValue] = useState<AccountConfigValue>({
    uid: '',
    url: '',
    context: '',
    basis: [],
    qa: [],
  });

  const state = useMemo(() => {
    const value: AccountConfigValue = {
      uid: account.uid || '',
      basis: [], context: '', qa: [], url: ''
    };
    const newState = new Forest({
      $value: value,
      actions: {
        updateUrl(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
          leaf.do.set_url(e.target.value);
        },
        updateContext(leaf: Leaf, e: ChangeEvent<HTMLInputElement>) {
          leaf.do.set_context(e.target.value);
        },
        updateBasis(leaf: Leaf, e: Record<string, unknown>) {
          console.log('basis is ', e.value);
          leaf.do.set_basis(e.value);
        },
        updateQa(leaf: Leaf, name: string, value: boolean) {
          let newQa: string[] = [];
          if (value) {
            newQa = [...leaf.value.qa, name];
          } else {
            newQa = [...leaf.value.qa.filter((n: string) => n !== name)];
          }
          console.log('new QA is ', newQa);
          leaf.do.set_qa(newQa);
        },
       async poll(leaf: Leaf) {
          const { data: {config} } = await axios.get('/api/accounts/config/' + leaf.value.uid);
          console.log('existing config is ', config);
          if (config) {
            leaf.do.set_url(config.url);
            leaf.do.set_qa(config.qa);
            leaf.do.set_context(config.context);
            leaf.do.set_basis(config.basis);
          }
        },
        commit(leaf: Leaf) {
          axios.post('/api/accounts/config', leaf.value);
          globalState?.do.addMessage({ headline: 'Account', text: 'Updated Account Configuration', 'status': 'ok' });
        }
      }
    });

    newState.do.poll();

    return newState;
  }, [account.uid, globalState]);

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  const { context, url, qa, basis } = value;
  return (
    <section>
      <Heading level={1}>Account Owner</Heading>
      <Box direction={size === 'small' ? 'column' : 'row'} align="start" gap="medium" fill="horizontal">

        <Box flex fill={size === 'small' ? 'horizontal' : false}>
          <Heading level={2}>Options</Heading>
          <Card width="100%" fill="horizontal" elevation="medium">
            <CardBody pad="medium">
              <Box direction={size === 'large' ? 'row' : 'column'} gap="medium" fill="horizontal">
                <Box fill={size !== 'large'} width={size === 'large' ? '50%' : '100%'}>
                  <Heading level={3}>Context</Heading>
                  <FormItem label="Website URL" vertical={true}>
                    <TextInput name="url" value={url} onChange={state.do.updateUrl}/>
                  </FormItem>

                  <FormItem label="Context" vertical={true}>
                    <TextArea rows={4} name="context" value={context} onChange={state.do.updateContext}>

                    </TextArea>
                  </FormItem>

                  <FormItem label="Basis" vertical={true}>
                    <CheckBoxGroup
                      onChange={state.do.updateBasis} value={basis}
                      options={[
                        {
                          label: 'Offer support based on Context',
                          value: 'support-context'
                        }, {
                          label: 'Offer upsell based on Context',
                          value: 'upsell-context'
                        },
                      ]}/>
                  </FormItem>
                </Box>
                <Box fill={size !== 'large'} width={size === 'large' ? '50%' : '100%'}>
                  <Heading level={3}>Quality Assurance</Heading>
                  <CheckButton value={qa.includes('appropriate-greeting')} onChange={(e) => {
                    state.do.updateQa('appropriate-greeting', e.target.value)
                  }}>Agent used appropriate greeting</CheckButton>
                  <CheckButton value={qa.includes('verified-caller')} onChange={(e) => {
                    state.do.updateQa('verified-caller', e.target.value)
                  }}>Agent verified caller before entering account</CheckButton>
                  <CheckButton value={qa.includes('additional-help')} onChange={(e) => {
                    state.do.updateQa('additional-help', e.target.value)
                  }}>Agent asked if any additional help was needed</CheckButton>

                  <CheckButton add onChange={() => {
                    // no action
                  }
                  }>Add Option</CheckButton>
                </Box>
              </Box>
              <Box direction="row-reverse" fill="horizontal"><Button
                onClick={state.do.commit}
                primary plain={false}>Set Configuration</Button></Box>
            </CardBody>
          </Card>
        </Box>
        <Box width={size === 'small' ? '100%' : { max: '400px' }}>
          <Heading level={2}>Personal Record</Heading>
          <NameValueList pairProps={{ direction: 'column' }}>
            <NameValuePair name="UID">
              <Text>{account.uid}</Text>
            </NameValuePair>
            <NameValuePair name="eMail">
              <Text>{account.email}</Text>
            </NameValuePair>
            <NameValuePair name="Name">
              <Text>{account.name || '(unknown)'}</Text>
            </NameValuePair>
            <NameValuePair name="employees">
              TODO
            </NameValuePair>
          </NameValueList>
        </Box>
      </Box>
    </section>
  )
}
