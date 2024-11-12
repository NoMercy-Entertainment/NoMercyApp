import { KeepAwake } from '@capacitor-community/keep-awake';

export const keepAwake = async () => {
  await KeepAwake.keepAwake();
};

export const allowSleep = async () => {
  await KeepAwake.allowSleep();
};

export const isSupported = async () => {
  const result = await KeepAwake.isSupported();
  return result.isSupported;
};

export const isKeptAwake = async () => {
  const result = await KeepAwake.isKeptAwake();
  return result.isKeptAwake;
};
