<div align="center">
  <img src="./images/logo.svg" width="80" height="80" alt="Logo Sambaqui">
  <h1>Carteirinha Digital - Cursinho Comunitário Sambaqui Itanhaém</h1>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/status-produtivo-green" alt="Status">
  <img src="https://img.shields.io/badge/Node.js-22.x-green" alt="Node.js">
  <img src="https://img.shields.io/badge/PostgreSQL-16.x-blue" alt="PostgreSQL">
</div>

Sistema full-stack para o **Cursinho Comunitário Sambaqui Itanhaém**, permitindo que alunos consultem, gerem e baixem sua identificação estudantil digital de forma segura e rápida.

---

## Links do Projeto

- **Produção:** [https://sambaqui-ita-carteirinha.onrender.com](https://sambaqui-ita-carteirinha.onrender.com)
- **Verificação de Carteirinha:** [https://sambaqui-ita-carteirinha.onrender.com/validar/444444](https://sambaqui-ita-carteirinha.onrender.com/validar/444444)

> ⚠️ **Aviso:** A aplicação está no plano gratuito do Render. No primeiro acesso do dia, pode levar 30 a 50 segundos para carregar. Aguarde uns instantes e a página carregará normalmente.

---

## Telas do Sistema

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>Tela de Login (Início)</strong><br>
        <img src="./images/inicio.png" width="300" alt="Tela de Login"><br>
        <em>Aluno informa CPF e Data de Nascimento</em>
      </td>
      <td align="center">
        <strong>Carteirinha Digital</strong><br>
        <img src="./images/carteirinha_sambaqui.png" width="300" alt="Carteirinha Sambaqui"><br>
        <em>Carteirinha com foto, dados e QR Code</em>
      </td>
      <td align="center">
        <strong>Verificação de Autenticidade</strong><br>
        <img src="./images/verificacao.png" width="300" alt="Verificação"><br>
        <em>Página pública para validar a carteirinha</em>
      </td>
    </tr>
  </table>
</div>

---

## 📃 Resumo do Projeto

App full-stack (Node.js/PostgreSQL) para emissão de carteirinhas digitais do Cursinho Comunitário Sambaqui Itanhaém.

**Funcionalidades:**

- Login seguro via CPF e Data de Nascimento
- Proteção contra ataques brute-force (Rate Limit)
- Geração de imagem PNG com timestamp para download
- QR Code integrado para validação em tempo real
- Segurança avançada com Helmet, CORS e proteção contra SQL Injection

---

## 🐱‍💻 Funcionalidades Principais

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

---

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

*Uso exclusivo para o Cursinho Comunitário Sambaqui Itanhaém. - Itanhaém, SP (2026).*
