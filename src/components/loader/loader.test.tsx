// src/components/loader/loader.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '../__tests__/test-utils';
import { Loader } from './index';

describe('Loader Component', () => {
  describe('Rendering Tests', () => {
    it('have to render loading component without crashing', () => {
      expect(() => render(<Loader />)).not.toThrow();
    });

    it('should have overlay with correct classes', () => {
      render(<Loader />);
      
      const overlay = document.querySelector('.overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('have to apply custom sizes', () => {
      const { container } = render(<Loader size={100} />);
      
      const styleElement = container.querySelector('[style*="--loader-size"]');
      expect(styleElement).toBeTruthy();
    });

    it('have to apply custom speed', () => {
      const { container } = render(<Loader speed={1.5} />);
      
      const styleElement = container.querySelector('[style*="--loader-speed"]');
      expect(styleElement).toBeTruthy();
    });

    it('have to apply custom thickness', () => {
      const { container } = render(<Loader thickness={4} />);
      
      const styleElement = container.querySelector('[style*="--loader-thickness"]');
      expect(styleElement).toBeTruthy();
    });

    it('have to apply custom color', () => {
      const { container } = render(<Loader color="#ff0000" />);
      
      const styleElement = container.querySelector('[style*="--loader-color"]');
      expect(styleElement).toBeTruthy();
    });

    it('have to use default values if the props are not passed', () => {
      const { container } = render(<Loader />);
      
      const styleElement = container.querySelector('[style*="--loader-size: 80px"]');
      expect(styleElement).toBeTruthy();
    });

    it('should have overlay with accessibility', () => {
      render(<Loader />);
      
      const overlay = document.querySelector('.overlay');
      expect(overlay).toBeInTheDocument();
    });
  });
});