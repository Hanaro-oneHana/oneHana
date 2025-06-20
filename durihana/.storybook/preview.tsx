import type { Preview } from '@storybook/nextjs';
import '../app/globals.css';
import  AuthSessionProvider from '../components/auth/session-provider';

const preview: Preview = {
  decorators: [
    (Story) => (<AuthSessionProvider><Story /></AuthSessionProvider>)
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
