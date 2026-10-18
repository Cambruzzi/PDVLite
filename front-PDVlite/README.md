# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

O escopo principal deste projeto é desenvolver uma aplicação web full-stack no modelo SaaS (Software as a Service) focada na emissão e gestão corporativa de pedidos de vendas, adotando boas práticas de mercado e Arquitetura Limpa.

Stack Tecnológico

Back-end: Django REST Framework responsável por fornecer a API e processar todas as transações na base de dados.

Front-end: React construído com o motor Vite para alta performance, estilizado de forma modular com Tailwind CSS v4.

Design System: Interface orientada à produtividade, utilizando uma paleta baseada em roxo, verde e branco, com campos compactos e bordas levemente arredondadas.

Regras de Negócio e Funcionalidades

Modelagem Base: Relacionamento entre as entidades Cliente, Produto, Pedido e a tabela pivô ItemPedido.

Motor de Rentabilidade: Classificação em tempo real de cada item adicionado ao pedido: Ótima (preço vendido acima da tabela), Boa (desconto máximo de 10%) e Ruim (desconto superior a 10%).

Congelamento Histórico: O preço de tabela no momento exato da venda é gravado de forma imutável no banco de dados para evitar inconsistências caso o catálogo de produtos mude no futuro.

Validação de Múltiplos: Bloqueio inteligente (tanto na interface quanto no servidor) para garantir que itens sejam vendidos nas suas frações corretas (exemplo: caixas fechadas de 12 unidades).

Segurança e Engenharia de Qualidade

Isolamento Multi-Tenant: Cada vendedor acede, edita e visualiza exclusivamente a sua própria carteira de pedidos.

Autenticação Robusta: Implementação de JWT (JSON Web Tokens) através de Cookies HttpOnly para o Refresh Token e armazenamento seguro do Access Token na memória RAM com intercetadores do Axios.

Acesso Público: Tela de registo de utilizadores com criptografia de senhas para permitir o crescimento orgânico da plataforma.

Pirâmide de Testes: Sistema protegido em múltiplos níveis por testes unitários no Django (APITestCase), testes de lógica no React (Vitest) e simulações de utilizadores reais de ponta a ponta (Cypress).
