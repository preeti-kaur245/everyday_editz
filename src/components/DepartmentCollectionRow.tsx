import React from 'react';
import { useStore } from '../context/StoreContext';
import { Department } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface DepartmentCollectionRowProps {
  departmentId: Department;
  title?: string;
  subtitle?: string;
  badge?: string;
  limit?: number;
}

export const DepartmentCollectionRow: React.FC<DepartmentCollectionRowProps> = ({
  departmentId,
  title,
  subtitle,
  badge,
  limit = 4,
}) => {
  const { departments, products, navigateToDepartment } = useStore();

  const dept = departments.find((d) => d.id === departmentId);
  if (!dept) return null;

  // Filter products belonging to this department
  const deptProducts = products
    .filter((p) => p.departments?.includes(departmentId))
    .slice(0, limit);

  if (deptProducts.length === 0) return null;

  const sectionTitle = title || `${dept.name}’s Featured Collection`;
  const sectionSubtitle = subtitle || dept.tagline;

  return (
    <section className="py-12 sm:py-16 bg-[#F7F5F0] border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-black/8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#536B57] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#536B57]" />
              <span>{badge || `${dept.name} Curations`}</span>
              <span className="text-black/30">/</span>
              <span>Batch #04</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-sm text-[#242424]/70 mt-1 max-w-xl">
              {sectionSubtitle}
            </p>
          </div>

          {/* Direct link to department landing page */}
          <button
            onClick={() => navigateToDepartment(departmentId)}
            className="text-xs font-semibold text-[#242424] hover:text-[#536B57] flex items-center space-x-1 cursor-pointer font-mono shrink-0 hover:underline underline-offset-4"
          >
            <span>Explore All {dept.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deptProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
