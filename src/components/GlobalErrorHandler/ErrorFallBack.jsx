import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    resetErrorBoundary();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" color="error" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" gutterBottom>
        {error.message}
      </Typography>
      {/* <Button variant="contained" color="primary" onClick={handleRetry}>
        Go to Home
      </Button> */}
    </div>
  );
};

export default ErrorFallback;
