import { useEffect, useState } from 'react';

export function List({ items }: { items: Array<string> }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(items.length);
  }, []);
  return (
    <div onClick={() => setN(n + 1)}>
      <img src="x.png" />
      {items.map((i) => (
        <span>{i}</span>
      ))}
    </div>
  );
}
