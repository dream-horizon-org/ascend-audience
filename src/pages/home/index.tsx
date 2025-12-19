import { useNavigate } from 'react-router';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Audience Listing Pagee</h1>
      <button onClick={() => navigate('/create-audience')}>
        Create Audience
      </button>
      <button onClick={() => navigate('/components')} style={{ marginLeft: '10px' }}>
        View Components
      </button>
    </div>
  );
}


