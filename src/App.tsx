import { ErrorBoundary } from './components/error-boundary/error-boundary'
import { Footer, Main, Header } from './ui'

export const App = () => {
  return(
    <ErrorBoundary>
      <div> 
        <Header />
        <Main />
        <Footer />
      </div>
    </ErrorBoundary>    
  );
};

