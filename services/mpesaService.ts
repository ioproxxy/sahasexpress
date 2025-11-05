// NOTE: THIS IS A FRONTEND IMPLEMENTATION FOR DEMONSTRATION.
// IN A REAL-WORLD APPLICATION, ALL M-PESA API CALLS AND CREDENTIALS
// MUST BE HANDLED ON A SECURE BACKEND SERVER TO PROTECT SENSITIVE DATA
// AND MANAGE CORS ISSUES.

// =====================================================================================
// DEVELOPER NOTE: The live API calls to M-Pesa have been replaced with a simulation.
// This is necessary because calling the M-Pesa API directly from a web browser
// is blocked by CORS (Cross-Origin Resource Sharing) security policies.
// A proper solution requires a backend server to securely handle these requests.
// This simulation will return a successful response after a short delay to mimic
// a real API call and allow the checkout flow to proceed for testing purposes.
// =====================================================================================


/**
 * SIMULATED: Generates a fake access token to mimic the real API call.
 */
const getAccessToken = async (): Promise<string> => {
  console.log("SIMULATION: Generating fake M-Pesa access token.");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('dummy-simulated-access-token');
    }, 500); // Simulate a brief network delay
  });
};

/**
 * SIMULATED: Initiates an M-Pesa STK Push request.
 * This function mimics the behavior of the real API call without making a network request.
 */
// FIX: Explicitly type the Promise to provide type safety for the response object in App.tsx.
export const initiateSTKPush = async (phoneNumber: string, amount: number): Promise<{
  ResponseCode: string;
  CheckoutRequestID: string;
  ResponseDescription: string;
  CustomerMessage: string;
  errorMessage?: string;
}> => {
  console.log(`SIMULATION: Initiating STK Push for ${phoneNumber} with amount ${amount}.`);
  
  // Await the simulated token generation to maintain the async flow.
  await getAccessToken();

  // Return a promise that resolves with a successful response after a delay.
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("SIMULATION: STK Push initiated successfully.");
      
      // This is a mock of a successful response from the Daraja API.
      const successResponse = {
        ResponseCode: "0",
        CheckoutRequestID: `sim_ws_CO_${Date.now()}`,
        ResponseDescription: "Success. Request accepted for processing",
        CustomerMessage: "Success. Request accepted for processing",
      };
      
      resolve(successResponse);
    }, 1500); // Simulate the API call taking 1.5 seconds
  });
};
