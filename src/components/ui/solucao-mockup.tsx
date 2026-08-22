import Image from "next/image";
import mockupImg from "../../../public/images/solucao/mockup-solucao.webp";

export function SolucaoMockup() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#9eb88d]">
      <Image
        src={mockupImg}
        alt="Notebook mostrando a tela de gestão do cardápio da Ficha Técnica Pro, com custo, preço e lucro de cada produto"
        quality={95}
        sizes="(min-width: 1024px) 63vw, 100vw"
        priority
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
