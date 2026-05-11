// src/components/test-error-button/test-error-button.tsx
import { Component } from 'react';
import './styles.css';

interface TestErrorButtonProps {
    onError?: () => void;
}

interface TestErrorButtonState {
    shouldThrow: boolean;
}

export class TestErrorButton extends Component<TestErrorButtonProps, TestErrorButtonState> {
    state: TestErrorButtonState = {
        shouldThrow: false,
    };

    handleTestError = (): void => {
        if (this.props.onError) {
            this.props.onError();
        }        
        
        this.setState({ shouldThrow: true });
    };

    render() {
        if (this.state.shouldThrow) {
            throw new Error('Test error from "Test Error" button');
        }

        return (
            <button 
                onClick={this.handleTestError}
                className="test-error-button"
                title="Click to simulate an error"
                type="button"
            >
                <span className="test-error-icon">!</span>
                Test Error
            </button>
        );
    }
}