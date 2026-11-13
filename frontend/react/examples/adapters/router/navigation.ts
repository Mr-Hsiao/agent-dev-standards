import { useNavigate } from 'react-router-dom';

export function useAppNavigate() {
  const navigate = useNavigate();

  return {
    go: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}
