import Container from "../common/Container";
import { Skeleton } from "../ui/shadcn/skeleton";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-sceen h-full w-full">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-[65vh] gap-2 py-2">
          <div className="relative w-full h-full">
            <div className="absolute bottom-5 left-5 z-10 flex flex-col self-end gap-y-3">
              <h1 className="text-4xl font-light text-white">Rolex watches</h1>
            </div>
            <div className="absolute w-full h-full top-0 left-0 z-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image src={"/assets/watches.webp"} fill alt="hero" />
              </div>
            </div>
          </div>

          <div className="relative w-full h-full">
          <div className="absolute bottom-5 left-5 z-10 flex flex-col self-end gap-y-3">
              <h1 className="text-4xl font-light text-white">Best accessories</h1>
            </div>
            <div className="absolute w-full h-full top-0 left-0 z-0">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image src={"/assets/rings.jpg"} fill alt="hero" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

const items = [
  {
    title: "Clothes",
    header: <Skeleton />,
    src: "/assets/clothes.jpg",
  },
  {
    title: "Watches",
    header: <Skeleton />,
    src: "/assets/watches.webp",
  },
  {
    title: "Shoes",
    header: <Skeleton />,
    src: "/assets/sneakers.jpeg",
  },
  {
    title: "Accessories",
    header: <Skeleton />,
    src: "/assets/accessories.jpg",
  },
];
