import { type ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { 
  render as rtlRender, 
  type RenderOptions,
  screen,
  waitFor,
  within,
  act,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary/error-boundary';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, { ...options });

const renderWithErrorBoundary = (ui: ReactElement) => {
  return rtlRender(<ErrorBoundary>{ui}</ErrorBoundary>);
};

export { 
  customRender as render, 
  renderWithErrorBoundary,
  screen,
  waitFor,
  within,
  act,
  fireEvent,
  cleanup,
  userEvent,
};

export type { RenderOptions };