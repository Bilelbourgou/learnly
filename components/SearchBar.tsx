"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const SearchBar = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep local state in sync with URL if it changes externally
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    handleSearch("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-accent-blue">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-11 pr-11 py-2.5 bg-white border border-border-subtle rounded-full text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
