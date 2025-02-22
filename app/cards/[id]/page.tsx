"use client";

import React, { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParams() {
      const { id } = await params;
      setId(id);
    }
    fetchParams();
  }, [params]);

  if (!id) return <div>Loading...</div>;

  return <div>My Post: {id}</div>;
};

export default Page;
