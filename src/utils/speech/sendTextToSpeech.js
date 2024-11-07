import { useGlobalState } from "../../hooks/global/useGlobalState";

export async function sendTextToSpeech(text) {
  const serverIP = useGlobalState.getState().serverIP;
  try {
    const response = await fetch(`http://${serverIP}:3000/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }), // Ensure the text is sent in the correct format
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      console.log('JSON Response:', result);
    } else {
      const textResult = await response.text();
      console.log('Text Response:', textResult);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}