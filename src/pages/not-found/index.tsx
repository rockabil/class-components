import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/routes';
import './module.css'

export const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content" role="alert">
        <div className='not-found-icon'>404</div>
        <h2>Page Not Found</h2>
         <p>The page you are looking for does not exist or has been moved.</p>
        <Link to={ROUTES.HOME}>← Back to Home</Link>  
      </div>          
    </div>
  );
};