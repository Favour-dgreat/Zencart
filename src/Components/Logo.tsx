
import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative min-h-[70px] w-30 object-cover">
      <Image
        src="/ZenCart.png"
        alt="Zen Cart Logo"
        fill
        className="object-cover"
      />
    </div>
  );
}
