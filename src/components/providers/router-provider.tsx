import { BrowserRouter } from 'react-router-dom';
import { PropsWithChildren } from 'react';

export function RouterProvider({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}