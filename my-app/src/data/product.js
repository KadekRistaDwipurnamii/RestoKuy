import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => setProducts(res.data.data || res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat produk...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded">
          <img src={product.img} alt={product.name} className="w-full h-32 object-cover rounded" />
          <h3 className="font-bold mt-2">{product.name}</h3>
          <p className="text-sm">{product.description}</p>
          <p className="mt-1 font-semibold">
            Rp{parseInt(product.price).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
