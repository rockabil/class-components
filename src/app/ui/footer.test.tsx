import { describe, it, expect } from 'vitest';
import { render, screen } from '../../components/__tests__/test-utils';
import { Footer } from './footer';

describe('Footer', () => {
  it('should render footer with year', () => {
    render(<Footer />);
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('should render RSSchoolSVG and GitHub links', () => {
    render(<Footer />);
    expect(screen.getByText('RSSchoolSVG')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });
});