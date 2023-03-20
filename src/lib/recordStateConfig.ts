import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import { RecordStateValues, UserObj } from '@/lib/types'
import axios from 'axios'
import { FormEvent } from 'react'

export default (globalState: Leaf | null) => ({

  $value: {
    lines: [],
    recording: false,
    progress: null,
    savePrompt: '',
    name: '',
  }, actions: {
    readyToRecord(leaf: Leaf) {
      const { lines, recording } = leaf.value as RecordStateValues;
      return !recording && !lines.length
    },
    readyToSave(leaf: Leaf) {
      const { lines, recording } = leaf.value as RecordStateValues;
      return !!(!recording && lines.length)
    },
    startRecording(leaf: Leaf) {
      leaf.do.set_recording(true);
    },
    onProgress(leaf: Leaf, memo: unknown) {
      leaf.do.set_progress(memo);
      setTimeout(() => {
        if (leaf.value.progress === memo) {
          leaf.do.set_progress(null);
        }
      }, 500);
    },
    stopRecording(leaf: Leaf) {
      leaf.do.set_recording(false);
    },
    closeSavePrompt(leaf: Leaf) {
      leaf.do.set_savePrompt(false);
    },
    addLine(leaf: Leaf, line: string) {
      if (!line) {
        return;
      }
      const { lines } = leaf.value;
      leaf.do.set_lines([...lines, line]);
    },

    transcriptSaved(leaf: Leaf) {
      globalState && globalState.do.addMessage({
        text: 'Your transcript has been saved',
        status: 'ok'
      });
    },

    saveError(leaf: Leaf, error: any) {
      if (!globalState) return;
      if (error instanceof Error) {
        globalState.do.addMessage({
          text: 'Error saving transcript: ' + error.message,
          timeout: 8000
        });
      } else {
        globalState.do.addMessage({
          text: 'Error saving transcript',
          timeout: 8000
        });
      }
    },

    updateName(leaf: Leaf, e: FormEvent<HTMLInputElement>) {
      const newName = (e.target as HTMLInputElement).value;
      leaf.do.set_name(newName);
    },

    reset(leaf: Leaf) {
      leaf.do.set_lines([]);
      leaf.do.set_savePrompt('');
      leaf.do.set_name('')
    },

    commit(leaf: Leaf, user: UserObj) {
      axios.post('/api/transcript/save', {
        userId: user.id,
        lines: leaf.value.lines,
        name: leaf.value.name
      }).then(leaf.do.transcriptSaved)
        .catch(leaf.do.saveError);
      leaf.do.reset();
    },

    saveTranscript(leaf: Leaf, user?: UserObj) {
      if (!user) {
        leaf.do.set_savePrompt('no user');
      } else if (!leaf.value.lines.length) {
        leaf.do.set_savePrompt('no lines');
      } else {
        leaf.do.set_savePrompt('save');
      }
    }
  }
})
