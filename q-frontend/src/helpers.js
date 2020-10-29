/* eslint-disable no-undef */
export const eventListenerHook = (listener) => {
  window.removeEventListener('focus', listener);
  window.addEventListener('focus', listener, false);
  return () => {
    window.removeEventListener('focus', listener);
  };
};

export const deleteme = 1;