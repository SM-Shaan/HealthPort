const Debug = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>HealthPort Debug Info</h1>

      <h2>Environment Variables:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL || 'NOT SET (using default)'}
      </pre>

      <h2>Effective API URL:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {apiUrl}
      </pre>

      <h2>Mode:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {import.meta.env.MODE}
      </pre>

      <h2>All Environment Variables:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px' }}>
        {JSON.stringify(import.meta.env, null, 2)}
      </pre>

      <h2>Test API Connection:</h2>
      <button
        onClick={async () => {
          try {
            const response = await fetch(`${apiUrl}/health`);
            const data = await response.json();
            alert(`Success! ${JSON.stringify(data)}`);
          } catch (error: any) {
            alert(`Error: ${error.message}`);
          }
        }}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Test Health Endpoint
      </button>
    </div>
  );
};

export default Debug;
