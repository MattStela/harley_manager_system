import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex flex-row justify-center items-center h-[100px]">
      <Image
        src="/harley-white.png"
        width={75}
        height={75}
        alt="ícone de harley branca"
      />
    </div>
  );
}
