import { render, screen } from '@testing-library/react';
import { FalloMock } from './components/FalloMock';

test('explica cómo recuperarse si el servicio mock no inicia', () => {
  render(<FalloMock detalle="El worker no respondió." onReintentar={() => {}} />);
  expect(screen.getByRole('alert')).toHaveTextContent(/no logró iniciarse/i);
  expect(screen.getByRole('button', { name: /reintentar/i })).toBeEnabled();
});
