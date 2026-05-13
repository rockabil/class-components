import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './error-boundary';

const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

const SafeComponent = () => <div>Safe Content</div>;

describe('ErrorBoundary', () => {
  const originalReload = window.location.reload;

  beforeEach(() => {
    window.location.reload = vi.fn();
    vi.clearAllMocks();
  });

  afterAll(() => {
    window.location.reload = originalReload;
  });

  describe('Error Catching Tests', () => {
    it('should display child components if there is no error', () => {
      render(
        <ErrorBoundary>
          <SafeComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('should catch errors in child components and show fallback UI', () => {

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <ErrorBoundary>
          <ThrowError message="Test error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Unfortunately something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText('Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('Shoud show a default message if error.message is missing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      const ThrowErrorWithoutMessage = () => {
        throw {};
      };

      render(
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Unknown error accured/i)).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Error Button Tests', () => {
    it('should reload the page when the button is clicked', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <ErrorBoundary>
          <ThrowError message="Test error" />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole('button', { name: /Reload Page/i });
      await user.click(reloadButton);

      expect(window.location.reload).toHaveBeenCalledTimes(1);

      consoleSpy.mockRestore();
    });
  });
});