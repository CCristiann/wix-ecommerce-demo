import FiltersLayout from "./_components/FiltersLayout";
import { api } from "~/trpc/server";

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({
    children,
}: LayoutProps) {
    const collections = await api.collections.getCollections()

    return (
        <FiltersLayout collections={collections}>
            {children}
        </FiltersLayout>
    )
}