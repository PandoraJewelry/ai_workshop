import type { ProductFilters } from '../../../types';

interface FilterSectionProps {
  filters: ProductFilters;
  resultCount: number;
  totalCount: number;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export function FilterSection({
  filters,
  resultCount,
  totalCount,
  onFilterChange,
  onClearFilters,
}: FilterSectionProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      category: value === 'all' ? null : value,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      priceMax: value === 'all' ? null : parseInt(value, 10),
    });
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      material: value === 'all' ? null : value,
    });
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="categoryFilter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Tea Type
              </label>
              <select
                id="categoryFilter"
                value={filters.category || 'all'}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Types</option>
                <option value="black">Black Tea</option>
                <option value="green">Green Tea</option>
                <option value="oolong">Oolong Tea</option>
                <option value="herbal">Herbal Tea</option>
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="priceFilter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Price Range
              </label>
              <select
                id="priceFilter"
                value={filters.priceMax || 'all'}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Prices</option>
                <option value="30">Under $30</option>
                <option value="50">Under $50</option>
                <option value="75">Under $75</option>
                <option value="100">Under $100</option>
              </select>
            </div>

            {/* Origin Filter */}
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="materialFilter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Origin
              </label>
              <select
                id="materialFilter"
                value={filters.material || 'all'}
                onChange={handleMaterialChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              >
                <option value="all">All Origins</option>
                <option value="China">China</option>
                <option value="Japan">Japan</option>
                <option value="India">India</option>
                <option value="Taiwan">Taiwan</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex flex-col justify-end w-full md:w-auto mt-2 md:mt-0">
            <span
              className="block text-sm font-semibold text-gray-700 mb-2 invisible hidden md:block"
              aria-hidden="true"
            >
              Actions
            </span>
            <button
              onClick={onClearFilters}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 text-sm text-gray-600 font-medium">
          Showing <span className="font-bold">{resultCount}</span> of{' '}
          <span className="font-bold">{totalCount}</span> products
        </div>
      </div>
    </section>
  );
}
