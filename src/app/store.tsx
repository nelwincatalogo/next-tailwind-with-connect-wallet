import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';

export const globalState = hookstate(
  {
    wallet: {},
  },
  devtools({ key: 'globalState' })
);

export const useGlobalState = () => useHookstate(globalState);
