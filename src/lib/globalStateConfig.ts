import { Leaf } from '@wonderlandlabs/forest/lib/Leaf'
import { Message, UserObj } from '@/lib/types'
import { v4 } from 'uuid'

export default () => {
  const userString = typeof window !== 'undefined' ? window?.sessionStorage.getItem('user') : '';
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (err) {
      console.error('cannot parse user string', userString);
    }
  }
  return (
    {
      $value: { user, width: 0, height: 0, messages: [], closing: [] },
      actions: {
        addMessage(leaf: Leaf, message: string | Message) {
          let text = message;
          let timeout: number | undefined | false = 3000;
          let status = 'error';
          let header = '';
          if (typeof message === 'object') {
            text = message.text;
            status = message.status || 'error';
            if ('timeout' in message) {
              timeout = message.timeout === false ? 0 : message.timeout;
            }
            if ('header' in message && message.header) {
              header = message.header;
            }
          }
          if (text) {
            const newMessage = {
              id: v4(),
              text,
              status,
              header
            }
            leaf.do.set_messages([...leaf.value.messages, newMessage]);

            if (timeout) {
              setTimeout(() => {
                  leaf.do.closeMessage(newMessage.id);
              }, timeout);
            }
          }
        },

        closeMessage(leaf: Leaf, messageId: string) {
          leaf.do.set_closing([...leaf.value.closing, messageId]);
        },
        removeMessage(leaf: Leaf, messageId: string) {
          leaf.do.set_messages(leaf.value.messages.filter((m: Message) => m.id !== messageId));
        },
        logout(leaf: Leaf) {
          leaf.do.set_user(null);
          window?.sessionStorage.removeItem('user');
          leaf.do.addMessage({ header: 'User Login',
            text: 'Logged Out', status: 'ok'});
        },
        login(leaf: Leaf, user?: UserObj) {
          if (user) {
            leaf.do.set_user(user);
            try {
              window?.sessionStorage.setItem('user', JSON.stringify(user));
            } catch (err) {
              console.error('cannot serialzie user:', user, err)
            }
          }
        }
      }
    })
}
