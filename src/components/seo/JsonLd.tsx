import React from "react";

interface JsonLdProps {
  data?: Record<string, any>;
  schema?: Record<string, any>;
}

export function JsonLd({ data, schema }: JsonLdProps) {
  const payload = data || schema || {};
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
