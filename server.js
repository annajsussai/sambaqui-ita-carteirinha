require('dotenv').config();

const express   = require('express');
const { Pool }  = require('pg');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const app = express();
app.set('trust proxy', 1); 
app.use(express.json());

// ---------- HEADERS DE SEGURANÇA ----------------------------------------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:    ["'self'"],
      scriptSrc:     ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://html2canvas.hertzen.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc:      ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:       ["'self'", "https://fonts.gstatic.com"],
      imgSrc:        ["'self'", "data:", "https:", "http:", "blob:", "https://drive.google.com", "https://lh3.googleusercontent.com"],
      connectSrc:    ["'self'"],
    },
  },
  referrerPolicy: { policy: 'same-origin' },
  hsts:           { maxAge: 31536000, includeSubDomains: true },
  frameguard:     { action: 'deny' },
  noSniff:        true,
  xssFilter:      true,
}));

// ---------- CORS CORRIGIDO ------------------------------------------------
app.use(cors({
  origin: '*',  // Permite todas as origens
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---------- RATE LIMITING --------------------------------------------------
// Global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos.' },
}));

// Maximo 10 tentativas por IP a cada 15 minutos 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de acesso. Tente novamente em 15 minutos.' },
  skipSuccessfulRequests: false,
});

// ---------- POSTGRESQL --------------------------------------------------
if (!process.env.DATABASE_URL) {
  console.error('[ERRO] DATABASE_URL não configurada.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max:                     10,
  idleTimeoutMillis:       30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => console.error('[DB]', err.message));

// ---------- VALIDAÇÃO --------------------------------------------------

function isValidCpf(cpf) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(String(cpf || '').trim());
}

function isValidDate(date) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(String(date || '').trim())) return false;
  const [d, m, y] = date.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function toIsoDate(ddmmyyyy) {
  const [d, m, y] = ddmmyyyy.split('/');
  return `${y}-${m}-${d}`;
}

// ---------- AUTENTICAR ALUNO --------------------------------------------------
app.post('/api/carteirinha', authLimiter, async (req, res) => {
  const cpf        = String(req.body?.cpf       || '').trim();
  const nascimento = String(req.body?.nascimento || '').trim();

  if (!isValidCpf(cpf) || !isValidDate(nascimento)) {
    return res.status(400).json({ error: 'Dados inválidos. Verifique o CPF e a data de nascimento.' });
  }

  try {
    const result = await pool.query(
      `SELECT id, nome_completo, cpf,
              TO_CHAR(data_nascimento, 'DD/MM/YYYY') AS data_nascimento,
              foto_url
       FROM alunos
       WHERE cpf = $1
         AND data_nascimento = $2::date
       LIMIT 1`,
      [cpf, toIsoDate(nascimento)]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Dados não encontrados. Verifique seu CPF e data de nascimento.' });
    }

    const aluno = result.rows[0];
    const codigo = `2026-SAMB-${String(aluno.id).padStart(4, '0')}`;

    return res.json({
      aluno: {
        id: aluno.id,
        nome_completo: aluno.nome_completo,
        cpf: aluno.cpf,
        data_nascimento: aluno.data_nascimento,
        foto_url: aluno.foto_url,
        codigo: codigo,
        validade: 'Dezembro/2026',
        emitido_por: 'Cursinho Comunitário Sambaqui Itanhaém'
      }
    });

  } catch (err) {
    console.error('[API] Erro ao autenticar:', err.message);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
});

// busca imagem externamente no servidor (sem CORS) 
app.get('/api/proxy-foto', async (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith('https://')) {
    return res.status(400).json({ error: 'URL inválida.' });
  }

  const permitidos = ['drive.google.com', 'lh3.googleusercontent.com', 'googleusercontent.com'];
  let hostname;
  try { hostname = new URL(url).hostname; } catch { return res.status(400).end(); }
  if (!permitidos.some(d => hostname.endsWith(d))) {
    return res.status(403).json({ error: 'Domínio não permitido.' });
  }
  try {
    const fetch = (await import('node-fetch')).default;
    const resp  = await fetch(url, { redirect: 'follow' });
    if (!resp.ok) return res.status(502).end();
    const ct = resp.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', ct);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    resp.body.pipe(res);
  } catch (err) {
    console.error('[proxy-foto]', err.message);
    res.status(502).end();
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- GET /api/validar/:id --------------------------------------------------
const validarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos.' },
});

app.get('/api/validar/:id', validarLimiter, async (req, res) => {
  const idStr = String(req.params.id || '').trim();
  if (!/^\d+$/.test(idStr)) {
    return res.status(400).json({ error: 'Código inválido.' });
  }
  const id = idStr; 
  try {
    const result = await pool.query(
      `SELECT id, nome_completo, cpf,
              TO_CHAR(data_nascimento, 'YYYY') AS ano_nascimento
       FROM alunos
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ valido: false });
    }
    const aluno = result.rows[0];
    const codigo = `2026-SAMB-${String(aluno.id).padStart(4, '0')}`;
    return res.json({
      valido: true,
      nome:   aluno.nome_completo,
      codigo,
      ano:    aluno.ano_nascimento,
      emitido_por: 'Cursinho Comunitário Sambaqui Itanhaém',
      validade: 'Dezembro/2026',
    });
  } catch (err) {
    console.error('[validar]', err.message);
    return res.status(500).json({ error: 'Erro interno.' });
  }
});

// ---------- FRONT --------------------------------------------------

app.get('/validar/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'validar.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- ERRO GLOBAL --------------------------------------------------
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ---------- START --------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
