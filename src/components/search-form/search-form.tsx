import { Component, type FormEvent, type ChangeEvent } from "react"; 
import './module.css';

interface SearchFormProps {
    onSearch: (query: string) => void;
    loading: boolean;
    initialQuery?: string;
}

interface SearchFormState {
    query: string;
}

export class SearchForm extends Component<SearchFormProps, SearchFormState> {
    constructor(props: SearchFormProps) {
        super(props);
        this.state = {
            query: props.initialQuery || '',
        };
    }

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ query: e.target.value });
    };

    handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { query } = this.state;
        if (query.trim()) {
            this.props.onSearch(query);
        }
    };

    handleClear = () => {
        this.setState({ query: '' });
        this.props.onSearch('');
    };

    render() {
        const { query } = this.state;
        const { loading } = this.props;

        return (
            <form className="search-form" onSubmit={this.handleSubmit}>
                <input type="text" value={query} onChange={this.handleInputChange} placeholder="Enter request..." disabled={loading} className="search-input" />
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Search...' : 'Find'}
                </button>
                <button type="button" onClick={this.handleClear} className="clear-button">
                    Clear
                </button>
            </form>
        );
    }

}
