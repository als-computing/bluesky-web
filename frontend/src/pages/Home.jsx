import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to /queueserver when the component loads
        setTimeout(()=> navigate('/beamlines/bl531'), 2000);
        //navigate('/queueserver');
    }, [navigate]);

    return (
        <section className='w-full h-40 flex items-center justify-center'>
            <p>Nothing to see here yet, redirecting</p>
        </section>
    )
}