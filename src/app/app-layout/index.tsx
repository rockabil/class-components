import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../ui';

export const AppLayout = () => {
    return (
        <>
        <Header />
        <main className='app-main'>
            <Outlet />
        </main>
        <Footer />
        </>
    )
}