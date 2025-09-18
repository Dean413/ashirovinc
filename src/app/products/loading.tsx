// app/products/loading.tsx
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <Image
        src="/ashirov-logo.jpg"
        alt="Loading Logo"
        width={80}
        height={80}
        className="animate-spin-slow"
      />
    </div>
  );
}
