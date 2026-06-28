'use client';
import { useState } from 'react';
import './styles.css';

interface TestErrorButtonProps {
    onError?: () => void;
}
export const TestErrorButton = ({onError}: TestErrorButtonProps) => {
    const [shouldThrow, setShouldThrow] = useState(false);
    
    const handleTestError = () => {
        if (onError) {
            onError();
        }        
        
        setShouldThrow(true);
    };

    if (shouldThrow) {
            throw new Error('Test error from "Test Error" button');
        }

        return (
            <button 
                onClick={handleTestError}
                className="test-error-button"
                title="Click to simulate an error"
                type="button"
            >
                <span className="test-error-icon">!</span>
                Test Error
            </button>
        );
}