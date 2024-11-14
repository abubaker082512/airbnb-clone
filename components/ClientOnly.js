"use client";
import React, { useEffect, useState } from "react";

function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <div
      initial={{ opacity: 0 }}
      viewport={{ once: true }}
    >
      {children}
    </div>
  );
}

export default ClientOnly;
