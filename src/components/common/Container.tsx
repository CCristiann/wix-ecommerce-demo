export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[84rem] w-full">
      {children}
    </div>
  );
}