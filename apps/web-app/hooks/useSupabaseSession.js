import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line import/prefer-default-export
export const useSession = () => {
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          const session = await response.json();
          console.log(session);
          setSessionToken(session);
          console.log(sessionToken);
        } else {
          throw new Error("Unable to get session");
        }
      } catch (error) {
        console.error(error);
      }

      // Handle auth state change events
      // TODO: Move this logic to the backend if possible
      const authListener = () => {
        // Custom logic to handle authentication events
        // For example, you can use WebSockets to listen for auth state changes on the server
      };

      return () => {
        // Cleanup the auth listener
        // For example, close the WebSocket connection
      };
    })();
  }, [sessionToken]);

  return sessionToken;
};
