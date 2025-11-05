// NOTE: THIS IS A FRONTEND IMPLEMENTATION FOR DEMONSTRATION.
// IN A REAL-WORLD APPLICATION, ALL M-PESA API CALLS AND CREDENTIALS
// MUST BE HANDLED ON A SECURE BACKEND SERVER TO PROTECT SENSITIVE DATA
// AND MANAGE CORS ISSUES.

// =====================================================================================
// Backend Integration: Calls the Express backend that proxies M-Pesa Daraja.
// =====================================================================================


// Initiates an M-Pesa STK Push via backend.
export const initiateSTKPush = async (
  phoneNumber: string,
  amount: number
): Promise<{
  ResponseCode: string;
  CheckoutRequestID: string;
  ResponseDescription: string;
  CustomerMessage: string;
  errorMessage?: string;
}> => {
  const res = await fetch('/api/mpesa/stk-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, amount })
  });

  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.details || err?.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data;
};

async function safeJson(r: Response) {
  try { return await r.json(); } catch { return null; }
}
