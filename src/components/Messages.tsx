import { GlobalStateContext } from '@/components/GlobalState'
import { useContext, useMemo } from 'react'
import { Message } from '@/lib/types'
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Layer, ResponsiveContext, Text } from 'grommet'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components';
import { Animate } from "react-simple-animate";


function MessageButton({ msg, close, remove, closing }: {
  msg: Message,
  closing: boolean,
  remove: () => void,
  close: () => void,
}) {
  const color = `status-${msg.status || 'info'}-light`;
  const colorDark = `status-${msg.status || 'info'}`;

  console.log('color:', color);
  return (
    <Animate
      play={closing} // Toggle when animation should start
      start={{ opacity: 1 }}
      end={{ opacity: 0 }}
      duration={0.5}
      onComplete={remove}
    >
      <Card margin="large" width="medium" background={color}
            border={{ size: '1px', color: colorDark }}>
        {
          <CardHeader pad={'small'}>
            <Box fill="horizontal" justify="between">
              <Heading level={3} fill
                       margin="0">
                {msg.header || ''}
              </Heading>
            </Box>
            <Button plain onClick={close}
                    icon={<Image alt="close-icon"
                                 src="/img/icons/close.svg"
                                 width="20"
                                 height="20"/>}
                    hoverIndicator/>
          </CardHeader>
        }
        <CardBody pad="small"><Text style={{ whiteSpace: 'nowrap' }} size="large">{msg.text}</Text></CardBody>
        {msg.footer && <CardFooter pad={{ horizontal: "small" }}>
          {msg.footer}
        </CardFooter>}
      </Card>
    </Animate>
  )
}

export default function Messages() {
  const { value, state } = useContext(GlobalStateContext);
  const size = useContext(ResponsiveContext)
  const messages = useMemo(() => {
    return value.messages;
  }, [value.messages]);

  if (!value.messages.length) {
    return null;
  }
  return (
    <Layer position="bottom-right" modal={false}  background="transparent" >
      {messages.map((msg: Message, index) => <MessageButton msg={msg}
                                                            remove={() => state?.do.removeMessage(msg.id)}
                                                            closing={!!(msg.id && value.closing.includes(msg.id))}
                                                            close={() => state?.do.closeMessage(msg.id)}
                                                            key={msg.id}/>)}
    </Layer>
  )
}
