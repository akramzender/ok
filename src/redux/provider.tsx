"use client"
import { Provider } from 'react-redux';
import { store } from './store'; // Make sure to adjust the import path

// A custom Redux provider that passes the store to the Provider component
export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxProvider