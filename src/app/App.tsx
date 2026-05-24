import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/error-boundary/error-boundary'
import { AppLayout } from './app-layout';
import { HomePage, AboutUsPage, NotFoundPage } from '../pages';
import { ThemeProvider } from '../context/theme-context';
import { ROUTES } from '../shared/routes';

export const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
         <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ABOUT_US} element={<AboutUsPage />} />
              <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>     
    </ErrorBoundary>
  );
};

