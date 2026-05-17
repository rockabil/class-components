import { describe, it, expect } from 'vitest';
import { render } from '../components/__tests__/test-utils';
import { App } from './App';

describe('Root App', () => {
  it('should render without crashing', () => {
     expect(() => render(<App />)).not.toThrow();
  });
});