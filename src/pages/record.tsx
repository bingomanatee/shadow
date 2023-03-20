import { Box, Button, Heading, PageHeader, Paragraph, ResponsiveContext, Text } from 'grommet'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Forest } from '@wonderlandlabs/forest'
import { Microphone } from 'grommet-icons'
import Image from 'next/image'
import IconPair from '@/components/IconPair'
import { GlobalStateContext } from '@/components/GlobalState'
import { UserPrompt } from '@/components/pages/record/UserPrompt'
import { RecordStateValues } from '@/lib/types'
import recordStateConfig from '@/lib/recordStateConfig'
import useSpeechRecognition from '@/lib/useSpeechRecognition'

export default function Record({}) {
  const [value, setValue] = useState<RecordStateValues>({
    name: '',
    savePrompt: '',
    lines: [],
    recording: false,
    progress: null
  });
  const size = useContext(ResponsiveContext);
  const { state: globalState, value: globalValue } = useContext(GlobalStateContext)

  const state = useMemo(() => new Forest(recordStateConfig(globalState)), [globalState]);

  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  const saveLines = useCallback(() => {
    state.do.saveTranscript(globalValue.user);
  }, [globalValue.user])

  const recorder = useSpeechRecognition({
      shouldRecord: value.recording,
      onProgress: state.do.onProgress,
      onMessage: state.do.addLine
    }
  )

  const commit = useCallback(() => {
    state.do.commit(globalValue.user);
  }, [globalValue.user])

  return (
    <article>
      <PageHeader pad={{ top: '', bottom: 'medium' }} parent={<Link href="/"><Text color="anchor">Home</Text></Link>}
                  title="Record A Conversation"
                  subtitle=""/>
      <Box align="start" gap="medium" direction={size === 'large' ? 'row' : 'column'}>

        <Box direction="column">
          {state.do.readyToRecord() && <Button onClick={state.do.startRecording} primary plain={false}>
            <IconPair color="text-reverse"
                      icon={<Image alt="record-icon" src="/img/icons/record.svg" width={24} height={24}/>}>
              Record
            </IconPair>
          </Button>}
          {state.value.recording && <Button primary plain={false} onClick={state.do.stopRecording}>
            <IconPair color="text-reverse"
                      icon={<Image alt="finish" src="/img/icons/stop.svg" width={24} height={24}/>}>
              Finish
            </IconPair>
          </Button>}
          {state.do.readyToSave() && <Button primary plain={false} onClick={saveLines}>
            <IconPair color="text-reverse"
                      icon={<Image alt="save-transcript" src="/img/icons/save.svg" width={24} height={24}/>}>
              Save
            </IconPair>
          </Button>}
        </Box>
        <section>
          <Box align="center" direction="row" gap="large">
            <Heading level={2}>Transcript</Heading>
            {value.progress ? <Microphone size="small" color="gray"/> : null}
          </Box>

          {value.lines.map((line, i) => (
            <Paragraph key={i} margin={{ bottom: 'medium', top: 'medium' }}>{line}</Paragraph>))}
        </section>
      </Box>
      <UserPrompt prompt={value.savePrompt}
                  name={value.name}
                  setName={state.do.updateName}
                  commit={commit}
                  handleClose={state.do.closeSavePrompt}
      ></UserPrompt>
    </article>
  )
}
