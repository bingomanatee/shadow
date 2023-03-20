import { Box, Button, Card, CardBody, CardHeader, Heading, Layer, Text, TextInput } from 'grommet'
import ModalFrame from '@/components/ModalFrame'
import FormItem from '@/components/FormItem'
import Image from 'next/image'

export function UserPrompt({
                             prompt,
                             handleClose,
                             name,
                             setName,
                             commit
                           }: {
  prompt: string | undefined,
  name?: string
  setName: () => void,
  commit: () => void,
  handleClose: () => void,
}) {
  if (!prompt) {
    return null;
  }
  let message = "";
  let heading = 'Cannot Save Data';
  switch (prompt) {
    case 'no user':
      message = 'You must be logged in to save your data';
      break;

    case 'no lines':
      message = 'There is no data to save';
      break;

    case 'save':
      message = 'save lines of content as transcript';
      heading = 'Save Transcript'
  }

  return (<Layer modal background="transparent"
                 onClickOutside={handleClose}>
    <ModalFrame plain>
      <Card background="light-1"
            border={{ size: '1px' }}>
        <CardHeader pad={'small'}>
          <Box fill="horizontal" justify="between">
            <Heading level={3} fill
                     margin="0">
              {heading}
            </Heading>
          </Box>
          <Button plain onClick={close}
                  icon={<Image alt="close-icon"
                               src="/img/icons/close.svg"
                               width="20"
                               height="20"/>}
                  hoverIndicator/>
        </CardHeader>
        <CardBody pad="small">
          <Text>{message}</Text>
          {(prompt === 'save') ? (
            <>
              <FormItem label="Transcript Name">
                <TextInput name="name" value={name} onChange={setName}/>
              </FormItem>
              <Text size="small" color="form-doc">
                You don&amp;t have to name your transcript file -
                you can submit and the file ID will be used instead of a name
              </Text>
              <FormItem label={<>&nbsp;</>}>
                <Button plain={false} onClick={commit} primary>Save</Button>
              </FormItem>
            </>
          ) : ''}
       </CardBody>
      </Card>
    </ModalFrame>
  </Layer>)
}
