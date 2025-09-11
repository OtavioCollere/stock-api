# Stock API

Estrutura sugerida para o README

Visão geral: explicar stack (NestJS, DDD, Clean Architecture, PostgreSQL, etc).

Casos de uso de destaque:

🔹 Controle de estoque (increase/decrease quantity com domain events)

🔹 Registro de usuário com validação externa de CPF

🔹 Autenticação JWT RS256

🔹 Registro de pedidos integrando com estoque

Testes:

e2e sem mock (batendo no banco real)

unitários com repositórios em memória

Arquitetura: domain events, gateways, repositórios.

-------------------------------------------------------- x ---------------------------------------------

Este é um projeto em desenvolvimento que visa criar uma API para Controle de estoque utilizando **NestJS**, **JWT**, **Google e integração com o Governo**, seguindo práticas modernas de **Arquitetura Limpa**, **DDD** e **Microserviços**.

## Funcionalidades Implementadas

- **Autenticação e Registro de Usuário com JWT RS256**  
  Implementação de autenticação utilizando chave privada e pública (RS256) para autenticar e registrar usuários.
  
- **Registro de Usuário com Criptografia de Senha**  
  Senhas dos usuários são criptografadas utilizando **bcrypt**, e o registro é validado utilizando **RBAC (Role-Based Access Control)**.
  
- **Registro de Produto**  
  Endpoint para registrar produtos com a validação de autenticação usando **AuthGuard** para garantir que apenas usuários autenticados possam realizar esta ação.

- **Validação de CPF via API de Integração**  
  Ao registrar um usuário, a validação do CPF é realizada por meio de uma integração com uma API externa para garantir que o CPF informado seja válido.

- **Testes Unitários e E2E**  
  Utilização de **Vitest** para escrever testes unitários e de integração (E2E) para garantir a qualidade e o correto funcionamento da aplicação.

## Objetivo Final do Projeto

O projeto visa a construção de uma aplicação de controle de estoque com as seguintes funcionalidades, ainda em desenvolvimento:

- **Autenticação e Registro de Usuários**
- **Cadastro de Produtos**
- **Gestão de Baixas e Adições de Estoque**
- **Entidade para Baixas e Adições**
- **Regras de Negócio na Camada Mais Pura Utilizando DDD**
- **Abstrações e Implementações Limpa com Arquitetura Limpa**

## Tecnologias Utilizadas

- **NestJS** - Framework para construção de APIs
- **JWT (RS256)** - Autenticação utilizando JSON Web Tokens com chave pública e privada
- **Google e API de Integração com o Governo** - Para validação de dados, como CPF
- **Bcrypt** - Criptografia de senhas
- **Vitest** - Testes unitários e E2E
- **Grafana** - Logs e práticas de observabilidade
- **Microserviços** - Notificações e outros serviços em microserviços
- **Arquitetura Limpa** - Seguindo as melhores práticas de desenvolvimento
- **DDD (Domain-Driven Design)** - Para organização e gestão de entidades e regras de negócio

## Arquitetura

A aplicação seguirá o padrão de **Clean Architecture**, separando a lógica de negócio, infraestrutura, e frameworks da seguinte forma:

- **Camada de Domínio**: Entidades e regras de negócio implementadas de forma isolada.
- **Camada de Aplicação**: Serviços, use-cases e orquestração da aplicação.
- **Camada de Infraestrutura**: Comunicação com APIs externas, bancos de dados, serviços de autenticação e outros.

## Microserviços

A aplicação estará dividida em microserviços, permitindo maior escalabilidade, flexibilidade e resiliência. O primeiro microserviço implementado será o de **Notificações**, que será responsável por enviar alertas e notificações aos usuários da plataforma.


