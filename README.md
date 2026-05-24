# 🎓 Carteirinha Digital - Cursinho Comunitário Sambaqui Itanhaém

![Status](https://img.shields.io/badge/status-produtivo-green)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue)

Sistema full-stack para o **Cursinho Comunitário Sambaqui Itanhaém**, permitindo que alunos consultem, gerem e baixem sua identificação estudantil digital de forma segura e rápida.

## 🔗 Links do Projeto

- **Produção:** [https://sambaqui-carteirinha.onrender.com](https://sambaqui-carteirinha.onrender.com)
- **Verificação de Carteirinha:** [https://sambaqui-carteirinha.onrender.com/validar/444444](https://sambaqui-carteirinha.onrender.com/validar/444444)

## 📸 Telas do Sistema

### Tela de Login (Início)
![Tela de Login](./images/inicio.png)

*Aluno informa CPF e Data de Nascimento para acessar sua carteirinha.*

### Carteirinha Digital
![Carteirinha Sambaqui](./images/carteirinha_sambaqui.png)

*Carteirinha gerada com foto, dados do aluno, código de registro e QR Code para verificação.*

### Verificação de Autenticidade
![Verificação](./images/verificacao.png)

*Página pública para validar a autenticidade da carteirinha através do código de registro.*

## 📝 Resumo do Projeto

App full-stack (Node.js/PostgreSQL) para emissão de carteirinhas digitais do **Cursinho Comunitário Sambaqui Itanhaém**.

Possui:
- ✅ Login seguro via **CPF** e **Data de Nascimento**
- ✅ Proteção contra ataques brute-force (Rate Limit)
- ✅ Geração de imagem PNG com timestamp para download
- ✅ QR Code integrado para validação em tempo real
- ✅ Segurança avançada com Helmet, CORS e proteção contra SQL Injection

## 🚀 Funcionalidades Principais

- **Autenticação Dupla:** Acesso via CPF + Data de Nascimento (formato DD/MM/AAAA)
- **Geração de Carteirinha:** Interface visual que converte dados em cartão digital estilizado
- **Download em PNG:** Exportação da carteirinha com carimbo timestamp para evitar fraudes
- **Validação por QR Code:** Sistema integrado onde o QR Code aponta para página de verificação `/validar/:id`
- **Verificação Pública:** Qualquer pessoa pode escanear o QR Code e validar a autenticidade da carteirinha
- **Segurança:** 
  - Proteção contra SQL Injection (query parametrizada)
  - Headers de segurança (Helmet)
  - Rate limiting (máximo 10 tentativas por IP em 15 minutos)
  - CORS configurado

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional (hospedado no Supabase)
- **pg** - Driver PostgreSQL para Node.js

### Segurança
- **Helmet** - Headers de segurança HTTP
- **Express-Rate-Limit** - Limitação de requisições
- **CORS** - Compartilhamento de recursos entre origens

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização responsiva
- **JavaScript (Vanilla)** - Lógica do cliente
- **html2canvas** - Geração de imagem da carteirinha
- **QR Server API** - Geração de QR Codes dinâmicos

---
*Uso exclusivo para o Cursinho Comunitário Sambaqui Itanhaém. - Itanhaém, SP (2026).
