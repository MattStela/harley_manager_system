import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-row justify-center items-center h-[100px] border">
      <Image src="/harley-white.png" width={100} height={100} alt="ícone de harley branca" />
    </div>
  );
}
