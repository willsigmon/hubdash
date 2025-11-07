"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Save, Calendar, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export interface SearchFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  label: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilter[];
  createdAt: Date;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onClear: () => void;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select';
    options?: Array<{ value: string; label: string }>;
  }>;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, filters: SearchFilter[]) => void;
  className?: string;
}

/**
 * Advanced Search and Filtering Component
 * Provides comprehensive search capabilities with multiple filter types
 */
export default function AdvancedSearch({
  onSearch,
  onClear,
  fields,
  savedFilters = [],
  onSaveFilter,
  className = '',
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery, filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onSearch]);

  const addFilter = () => {
    const newFilter: SearchFilter = {
      id: `filter-${Date.now()}`,
      field: fields[0]?.key || '',
      operator: 'contains',
      value: '',
      label: fields[0]?.label || '',
    };
    setFilters([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<SearchFilter>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const applySavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    setShowSavedFilters(false);
  };

  const saveCurrentFilters = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName, filters);
      setSaveFilterName('');
      setShowSaveDialog(false);
    }
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilters([]);
    onClear();
  };

  const getFieldType = (fieldKey: string) => {
    return fields.find(f => f.key === fieldKey)?.type || 'text';
  };

  const getRelativeDateOptions = [
    { value: 'today', label: 'Today', getValue: () => new Date() },
    { value: 'yesterday', label: 'Yesterday', getValue: () => subDays(new Date(), 1) },
    { value: 'last7days', label: 'Last 7 days', getValue: () => subDays(new Date(), 7) },
    { value: 'last30days', label: 'Last 30 days', getValue: () => subDays(new Date(), 30) },
    { value: 'thisWeek', label: 'This week', getValue: () => startOfWeek(new Date()) },
    { value: 'lastWeek', label: 'Last week', getValue: () => startOfWeek(subDays(new Date(), 7)) },
    { value: 'thisMonth', label: 'This month', getValue: () => startOfMonth(new Date()) },
    { value: 'lastMonth', label: 'Last month', getValue: () => startOfMonth(subDays(new Date(), 30)) },
  ];

  const activeFiltersCount = filters.length + (searchQuery ? 1 : 0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hti-stone/60" />
          <input
            type="text"
            placeholder="Search across all fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-hti-teal/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-hti-teal focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-hti-stone/60 hover:text-hti-stone"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-hti-teal text-white text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {savedFilters.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSavedFilters(!showSavedFilters)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Saved Filters
          </Button>
        )}

        {filters.length > 0 && onSaveFilter && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Filter
          </Button>
        )}

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-hti-stone hover:text-hti-navy"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Saved Filters Dropdown */}
      <AnimatePresence>
        {showSavedFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-hti-teal/20 rounded-lg shadow-lg p-4"
          >
            <h4 className="font-medium text-hti-navy mb-3">Saved Filters</h4>
            <div className="space-y-2">
              {savedFilters.map((savedFilter) => (
                <button
                  key={savedFilter.id}
                  onClick={() => applySavedFilter(savedFilter)}
                  className="w-full text-left p-2 rounded hover:bg-hti-sand/50 transition-colors"
                >
                  <div className="font-medium text-hti-navy">{savedFilter.name}</div>
                  <div className="text-xs text-hti-stone">
                    {savedFilter.filters.length} filters • {format(savedFilter.createdAt, 'MMM d, yyyy')}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-hti-teal/20 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-hti-navy">Advanced Filters</h4>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addFilter}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Filter
                </Button>
              </div>

              <div className="space-y-3">
                {filters.map((filter) => (
                  <FilterRow
                    key={filter.id}
                    filter={filter}
                    fields={fields}
                    onUpdate={(updates) => updateFilter(filter.id, updates)}
                    onRemove={() => removeFilter(filter.id)}
                    getRelativeDateOptions={getRelativeDateOptions}
                    getFieldType={getFieldType}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Filter Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-hti-navy mb-4">Save Filter</h3>
              <input
                type="text"
                placeholder="Filter name..."
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                className="w-full px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal mb-4"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowSaveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveCurrentFilters}
                  disabled={!saveFilterName.trim()}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FilterRowProps {
  filter: SearchFilter;
  fields: AdvancedSearchProps['fields'];
  onUpdate: (updates: Partial<SearchFilter>) => void;
  onRemove: () => void;
  getRelativeDateOptions: any[];
  getFieldType: (fieldKey: string) => string;
}

function FilterRow({ filter, fields, onUpdate, onRemove, getRelativeDateOptions, getFieldType }: FilterRowProps) {
  const fieldType = getFieldType(filter.field);
  const fieldConfig = fields.find(f => f.key === filter.field);

  const operators: Record<string, Array<{ value: string; label: string }>> = {
    text: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'between', label: 'Between' },
    ],
    date: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'After' },
      { value: 'lessThan', label: 'Before' },
      { value: 'between', label: 'Between' },
    ],
    select: [
      { value: 'equals', label: 'Equals' },
      { value: 'in', label: 'In' },
    ],
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-hti-sand/30 rounded-lg">
      <select
        value={filter.field}
        onChange={(e) => {
          const newField = fields.find(f => f.key === e.target.value);
          onUpdate({
            field: e.target.value,
            label: newField?.label || '',
            value: '',
          });
        }}
        className="px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
      >
        {fields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </select>

      <select
        value={filter.operator}
        onChange={(e) => onUpdate({ operator: e.target.value as any })}
        className="px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
      >
        {operators[fieldType]?.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      <div className="flex-1">
        {fieldType === 'select' ? (
          fieldConfig?.options ? (
            <select
              value={filter.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              className="w-full px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
            >
              <option value="">Select...</option>
              {fieldConfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filter.value}
              onChange={(e) => onUpdate({ value: e.target.value })}
              placeholder="Enter value..."
              className="w-full px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
            />
          )
        ) : fieldType === 'date' ? (
          <div className="flex gap-2">
            <input
              type="date"
              value={filter.value?.start || ''}
              onChange={(e) => onUpdate({
                value: { ...filter.value, start: e.target.value }
              })}
              className="flex-1 px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
            />
            {filter.operator === 'between' && (
              <>
                <span className="text-hti-stone">to</span>
                <input
                  type="date"
                  value={filter.value?.end || ''}
                  onChange={(e) => onUpdate({
                    value: { ...filter.value, end: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
                />
              </>
            )}
          </div>
        ) : (
          <input
            type={fieldType === 'number' ? 'number' : 'text'}
            value={filter.value}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="Enter value..."
            className="w-full px-3 py-2 border border-hti-teal/30 rounded focus:outline-none focus:ring-2 focus:ring-hti-teal text-sm"
          />
        )}
      </div>

      <button
        onClick={onRemove}
        className="p-2 text-hti-stone hover:text-hti-red transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
