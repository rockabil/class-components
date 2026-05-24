import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/routes';
import { useTheme } from '../../hooks/use-theme';
import './module.css'

export const Header = () => {
    const { theme, toggleTheme } = useTheme()
    return (
        <header className="app-header">
            <h1>STAR TREK Heroes Search</h1>
            <nav>
                <Link to={ROUTES.HOME}>Home</Link>
                <Link to={ROUTES.ABOUT_US}>About Us</Link>
                <button onClick={toggleTheme} className="theme-toggle-button">{theme === 'light' ? 'dark' : 'light'} theme
                </button>
            </nav>            
        </header>        
    );
};

