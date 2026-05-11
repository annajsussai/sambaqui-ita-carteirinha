# Carteirinha Digital - Sambaqui Itanhaém

Sistema full-stack para o **Cursinho Comunitário Sambaqui Itanhaém**, permitindo que alunos consultem, gerem e descarreguem a sua identificação estudantil digital.

## 📝 Resumo do Projeto
App full-stack (Node.js/Postgres) para emissão de carteirinhas digitais. Possui login seguro via RG e Data de Nascimento, proteção contra ataques brute-force (Rate Limit) e geração de imagem PNG com timestamp e QR Code para uso dos alunos. Ideal para deploy no Railway com foco em segurança e praticidade mobile.

## 🚀 Funcionalidades Principais
- **Autenticação Dupla:** Acesso via RG + Data de Nascimento.
- **Geração de Carteirinha:** Interface visual que converte dados em cartão digital.
- **Download em PNG:** Exportação da carteirinha com carimbo timestamp para evitar capturas antigas.
- **Validação por QR Code:** Sistema integrado onde o QR Code aponta para uma página de verificação em tempo real (`/validar/:id`).
- **Segurança:** Proteção contra SQL Injection, Headers de segurança (Helmet) e limite de tentativas de acesso.

## 🛠️ Tecnologias Utilizadas
- **Backend:** Node.js, Express.
- **Base de Dados:** PostgreSQL.
- **Segurança:** Helmet, Express-Rate-Limit, CORS.
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), [html2canvas](https://html2canvas.hertzen.com/).

---
*Uso exclusivo para o Cursinho Comunitário Sambaqui Itanhaém. - Itanhaém, SP (2026).*
