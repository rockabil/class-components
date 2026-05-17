import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/routes';

export const NotFoundPage = () => {
  return (
    <div>
      <h2>404 - Страница не найдена</h2>
      <Link to={ROUTES.HOME}>Вернуться на главную</Link>      
    </div>
  );
};