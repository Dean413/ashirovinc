"use client";

import { useEffect, useState } from "react";

export default function TestUsers() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/super-admin")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1>Test Users API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
