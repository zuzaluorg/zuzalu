// hooks/getUserOnID.js
import { useState, useEffect } from "react";

// eslint-disable-next-line import/prefer-default-export
export const getUserOnID = () => {
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    (async () => {
      const id = window.localStorage.getItem("id");
      if (id) {
        try {
          const response = await fetch(`/api/user_by_id?id=${id}`);

          if (response.ok) {
            const userData = await response.json();
            setUserObj(userData);
          } else {
            throw new Error("Unable to get user by ID");
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, []);

  return userObj;
};
