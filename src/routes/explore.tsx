import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/lib/resources.functions";
import { Navigation } from "@/components/landing/navigation";
import { ResourceCard, ResourceCardSkeleton } from "@/components/resources/resource-card";
import { useState, useMemo } from "react";
import { Search, Filter, Sparkles, Layers, Box, Code2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/explore")({
  head: () => ({
    title: "Explore Prompts & Components | Promptly",
    meta: [
      {
        name: "description",
        content: "Discover curated AI prompts, system architectures, and production-ready snippets on Promptly.",
      },
    ],
  }),
  component: ExplorePage,
});

const CATEGORIES = [
  "All",
  "Website Development",
  "Mobile Applications",
  "UI/UX",
  "AI/ML",
  "Data Science",
  "Automation",
  "Marketing",
  "Productivity",
];

const TYPES = ["All Types", "Prompt", "Snippet", "Component", "Architecture", "Project"];

function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All Types");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["explore-resources"],
    queryFn: () => getResources({ data: { sort: "popular", page: 1 } }),
  });

  const filteredResources = useMemo(() => {
    return resources.filter((item: any) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(item.tags) &&
          item.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCat =
        selectedCategory === "All" || item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesTyp =
        selectedType === "All Types" || item.type?.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesCat && matchesTyp;
    });
  }, [resources, searchQuery, selectedCategory, selectedType]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-32">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 pt-28 sm:pt-36 space-y-8">

        {/* Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts, architectures, React components, frameworks..."
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-black/10 bg-neutral-50/50 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-12 px-4 rounded-2xl border border-black/10 bg-neutral-50/50 text-xs font-bold uppercase tracking-wider text-neutral-700 focus:outline-none focus:border-black cursor-pointer"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-md shadow-black/10"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-400">
            <span>
              Showing <strong className="text-black">{filteredResources.length}</strong> items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => <ResourceCardSkeleton key={i} />)
            ) : filteredResources.length === 0 ? (
              <div className="col-span-full py-24 text-center space-y-4">
                <Box className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="text-lg font-bold uppercase tracking-tight">No resources found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try adjusting your search query or selecting a different category from above.
                </p>
              </div>
            ) : (
              filteredResources.map((res: any) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResourceCard resource={res} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
