'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const SearchContext = createContext<any>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const router = useRouter();
    const pathname = usePathname();

    const fetchProducts = async () => {
        const res = await fetch(`/api/products?page=${page}&limit=10&sort=${sort}&search=${search}`);
        const data = await res.json();
        console.log(data)
        setProducts(data.products);   
        setTotalPages(data.pages === 0 ? 1 : data.pages);  
    };

    useEffect(() => {
        fetchProducts()
    }, [search, sort, page])
    useEffect(() => {
        if (search && !(pathname === '/')) {
            router.push('/');
        }
    }, [search])
    return (
        <SearchContext.Provider value={{ search, setSearch, sort, setSort, page, setPage, products, totalPages }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearch = () => useContext(SearchContext);