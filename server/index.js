import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MPESA_ENV = (process.env.MPESA_ENV || 'sandbox').toLowerCase();
const BASE_URL = MPESA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const SHORTCODE = process.env.MPESA_SHORTCODE || '';
const PASSKEY = process.env.MPESA_PASSKEY || '';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || '';

function timestamp() {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${HH}${mm}${ss}`;
}

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  const url = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const { data } = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
  return data.access_token;
}

function normalizeMsisdn(msisdn) {
  // Convert 07XXXXXXXX or 7XXXXXXXX to 2547XXXXXXXX
  let p = msisdn.replace(/\s|\+/g, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (p.startsWith('7')) p = '254' + p;
  return p;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: MPESA_ENV });
});

app.post('/api/mpesa/stk-push', async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body || {};
    if (!phoneNumber || !amount) {
      return res.status(400).json({ error: 'phoneNumber and amount are required' });
    }

    if (!CONSUMER_KEY || !CONSUMER_SECRET || !SHORTCODE || !PASSKEY || !CALLBACK_URL) {
      return res.status(500).json({ error: 'M-Pesa credentials not configured on server' });
    }

    const token = await getAccessToken();
    const ts = timestamp();
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${ts}`).toString('base64');

    const payload = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Number(amount),
      PartyA: normalizeMsisdn(phoneNumber),
      PartyB: SHORTCODE,
      PhoneNumber: normalizeMsisdn(phoneNumber),
      CallBackURL: CALLBACK_URL,
      AccountReference: 'SahasExpress',
      TransactionDesc: 'Order payment',
    };

    const url = `${BASE_URL}/mpesa/stkpush/v1/processrequest`;
    const { data } = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20000,
    });

    return res.json(data);
  } catch (err) {
    console.error('STK Push error:', err?.response?.data || err?.message || err);
    const status = err?.response?.status || 500;
    return res.status(status).json({ error: 'Failed to initiate STK push', details: err?.response?.data || err?.message || 'Unknown error' });
  }
});

// Receive Daraja STK callback
let lastCallback = null;
app.post('/api/mpesa/callback', (req, res) => {
  lastCallback = req.body;
  console.log('Received M-Pesa callback:', JSON.stringify(req.body));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

app.get('/api/mpesa/last-callback', (_req, res) => {
  res.json(lastCallback || { message: 'No callbacks received yet' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
