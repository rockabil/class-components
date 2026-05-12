import { describe, it, expect } from 'vitest';
import { render } from '../_tests_/test-utils';
import { Loader } from './index';

describe('Loader Component', () => {
    describe('Rendering Tests', () => {
        it('have to render loading component', () => {
        (<Loader />);

        const loaderElement = document.querySelector('.loader');
        expect(loaderElement).toBeInTheDocument();
        });

        it('should have overlay with correct classes', () => {
            render(<Loader />);

            const overlay = document.querySelector('.overlay');
            expect(overlay).toBeInTheDocument();
        });

        it('have to apply custom sizes', () => {
            render(<Loader size={100} />);
            
            const loaderContainer = document.querySelector('[style*="--loader-size"]');
            expect(loaderContainer).toBeInTheDocument();
        });
        
        it('have to apply custom speed', () => {
            render(<Loader speed={1.5} />);
            
            const loaderContainer = document.querySelector('[style*="--loader-speed"]');
            expect(loaderContainer).toBeInTheDocument();
        });

        it('have to epply custom thikness', () => {
            render(<Loader thickness={4} />);

            const loaderContainer = document.querySelector('[style*="--loader-thickness"]');
            expect(loaderContainer).toBeInTheDocument();
        });
        
        it('have to epply custom color', () => {
            render(<Loader color="#ff0000" />);

            const loaderContainer = document.querySelector('[style*="--loader-color"]');
            expect(loaderContainer).toBeInTheDocument();
        });
        
        it('have to use default values if the props are not passed', () => {
            render(<Loader />);
            
            const loaderContainer = document.querySelector('[style*="--loader-size: 80px"]');
            expect(loaderContainer).toBeInTheDocument();
        });
    });

    describe('Accessibility Tests', () => {
        it('should have overlay with accessability', () => {
            render(<Loader />);
            
            const overlay = document.querySelector('.overlay');
            expect(overlay).toBeInTheDocument();
        });
    });
});
