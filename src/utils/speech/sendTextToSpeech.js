export async function sendTextToSpeech(text) {
  try {
    const response = await fetch('http://rnblb-181-36-66-5.a.free.pinggy.link/speak', {
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