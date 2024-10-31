import { useState, useEffect } from 'react';

const useUploadPermission = (apiUrl) => {
  const [isUploadAllowed, setIsUploadAllowed] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/api/database-write-enabled`)
      .then(response => response.json())
      .then(data => setIsUploadAllowed(data?.writeEnabled === true))
      .catch(error => console.error("Error fetching upload permission:", error));
  }, [apiUrl]);

  return isUploadAllowed;
};

export default useUploadPermission;
