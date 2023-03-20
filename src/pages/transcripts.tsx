import { useContext, useEffect, useMemo, useState } from 'react'
import { GlobalStateContext } from '@/components/GlobalState'
import axios from 'axios'
import { ColumnConfig, DataTable, PageHeader, ResponsiveContext, Text } from 'grommet'
import Link from 'next/link'
import dayjs, { Dayjs } from 'dayjs'
import { Forest } from '@wonderlandlabs/forest'
import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import { short } from '@/lib/utils'

function transcriptConfig() {
  return ({
    $value: {
      transcripts: []
    },
    actions: {
      async load(leaf: Leaf, userId: string) {
        const response = await axios.post('/api/transcript/list', { userId });
        let data = response.data;
        if (Array.isArray(data)) {
          data = data.map((item: Transcript) => {
            const day = dayjs(item.time);
            let timestamp = 0
            if (day.isValid()) {
              timestamp = day.unix();
              item.date = day;
            }
            item.timestamp = timestamp;
            return item;
          });

          leaf.do.set_transcripts(data);
        }
      }
    }
  });
}

type Transcript = {
  id: string,
  time: string,
  name?: string,
  date?: Dayjs,
  timestamp?: number
}

type TranscriptStateValue = {
  transcripts: Transcript[]
}

function Transcripts() {
  const { state: globalState, value: globalValue } = useContext(GlobalStateContext)
  const [value, setValue] = useState<TranscriptStateValue>({ transcripts: [] });
  const size = useContext(ResponsiveContext);

  const state = useMemo(() => new Forest(transcriptConfig()), []);


  const columns: ColumnConfig<any>[] = useMemo(() => ([
    { property: 'id', header: 'File ID', primary: true, size: size === 'large' ? '250px' : '15vw', render: short('id') },
    { property: 'userId', header: 'User ID', size: size === 'large' ? '250px': '15vw', render: short('userId') },
    { property: 'name', header: 'Name', size: size === 'large' ? '400px' : '25vw', render: short('name') },
    {
      property: 'time', header: 'Saved at', render: ({ time, date }: {time: string, date: Dayjs}) => {
        if (!date) return time;
        return date.format( size === 'small' ? 'MM DD YY' : 'MMM D YY ~ hh:mm A')
      }
    },
    { property: 'lines', header: 'Lines', size: '150px'},
  ]), [size]);


  useEffect(() => {
    const sub = state.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [state]);

  useEffect(() => {
    if (globalValue?.user?.id) {
      state.do.load(globalValue.user.id);
    }
  }, [globalValue.user]);

  return (
    <article>
      <PageHeader pad={{ top: '', bottom: 'medium' }} parent={<Link href="/"><Text color="anchor">Home</Text></Link>}
                  title="Transcripts"
                  subtitle=""/>

      <DataTable fill="horizontal" data={value.transcripts}
                 sort={{property: 'timestamp', direction: 'desc'}}
                 columns={columns}/>
    </article>
  )
}

export default Transcripts;
