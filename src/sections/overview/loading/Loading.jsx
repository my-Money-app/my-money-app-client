
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingComponent() {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <CircularProgress />
    </div>
  );
}

