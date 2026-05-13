import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { TestErrorButton } from './index';
import React from 'react';

describe('TestErrorButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    it('have to render the button with correct text', () => {
      render(<TestErrorButton />);

      expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('should have correct title attribute', () => {
      render(<TestErrorButton />);

      const button = screen.getByTitle('Click to simulate an error');
      expect(button).toBeInTheDocument();
    });

    it('shoulde have the icon with the symbol "!"', () => {
      render(<TestErrorButton />);

      const icon = document.querySelector('.test-error-icon');
      expect(icon).toHaveTextContent('!');
    });
  });

  describe('Error Throwing Tests', () => {
   
    it('should trigger error boundary when clicked', async () => {
      const user = userEvent.setup();

      class TestErrorBoundary extends React.Component<{ children: React.ReactNode; onError: (error: Error) => void }> {
        componentDidCatch(error: Error) {
          this.props.onError(error);
        }

        render() {
          return this.props.children;
        }
      }

      const onErrorSpy = vi.fn();

      render(
        <TestErrorBoundary onError={onErrorSpy}>
          <TestErrorButton />
        </TestErrorBoundary>
      );

      const button = screen.getByText('Test Error');
      await user.click(button);

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error from "Test Error" button'
        })
      );
    });
  });
});