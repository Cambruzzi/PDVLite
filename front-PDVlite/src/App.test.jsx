import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Prevenção de Tela Branca (Smoke Test)', () => {
  
  it('Deve renderizar o App sem falhas críticas (crash)', async () => {
    // 1. O Vitest tenta montar a aplicação inteira na memória.
    // Se faltar um "import" em QUALQUER tela, este comando vai lançar um erro e o teste falha!
    render(<App />);

    // 2. Se chegou até aqui sem dar crash, garantimos que não há tela branca.
    // Vamos apenas verificar se a logo "PDVLite" apareceu no ecrã para confirmar.
    const logoElements = await screen.findAllByText(/PDV/i);
    expect(logoElements.length).toBeGreaterThan(0);
  });

});