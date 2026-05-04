import { Component } from "react";

interface ErrorMessageProps {
    message: string;
}

export class ErrorMessage extends Component<ErrorMessageProps> {
    render() {
        const { message } = this.props;
        return (
            <div className="error-message" role="alert">
                <strong>Error:</strong> {message}
            </div>
        );
    }
}