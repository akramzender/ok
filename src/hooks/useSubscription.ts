import { useState } from "react";
import axios from "axios";

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handles subscription process by making an API call
   * and redirecting the user to the payment session.
   */
  const onSubscribe = async () => {
    setIsProcessing(true); // Start processing
    try {
      // Call the payment API
      const response = await axios.get("/api/payment");

      // Check if the response is successful
      if (response.data.status === 200) {
        // Redirect to the payment session URL
        window.location.href = `${response.data.session_url}`;
        return;
      }

      // Handle unexpected status
      console.error("Unexpected response:", response.data);
    } catch (error) {
      // Log the error and provide feedback
      console.error("Subscription error:", error);
      alert("An error occurred while processing your subscription. Please try again.");
    } finally {
      setIsProcessing(false); // Stop processing
    }
  };

  // Return the subscription handler and state
  return { onSubscribe, isProcessing };
};