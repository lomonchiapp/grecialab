import html2canvas from 'html2canvas';
import { useGlobalState } from '../../global/useGlobalState';

export const handlePrint = async (ticketRef) => {
  const serverIP = useGlobalState.getState().serverIP;
  if (ticketRef.current) {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL('image/jpeg').split(',')[1]; // Get base64 string without the prefix

    // Create the payload
    const payload = {
      imagePath: `data:image/jpeg;base64,${imgData}`, // Send the base64 string directly
      imageWidth: 500,
      imageHeight: 800,
    };

    // Send the image to the print server
    try {
      const response = await fetch(`http://${serverIP}:3000/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Image sent to print server successfully');
      } else {
        console.error('Failed to send image to print server');
      }
    } catch (error) {
      console.error('Error sending image to print server:', error);
    }
  }
};