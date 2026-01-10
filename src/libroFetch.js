import { useState, useEffect } from "react";

export function libroFetch(url) {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((books) => setBooks(books))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { books, loading, error };
}
