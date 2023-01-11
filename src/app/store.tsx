import { hookstate, useHookstate } from '@hookstate/core';
import { devtools } from '@hookstate/devtools';

const globalState = hookstate(
  {
    test: 0,
    web3: null,
  },
  devtools({ key: 'globalState' })
);

export const useGlobalState = () => useHookstate(globalState);
