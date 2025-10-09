import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, DollarSign, Zap, Brain, ChevronDown, ChevronUp, Filter, AlertCircle, CheckCircle, XCircle, Clock, Activity, Download, Save, RefreshCw } from 'lucide-react';

const ModelsDashboard = () => {
  const [models, setModels] = useState([]);
  const [detailedStats, setDetailedStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsProgress, setStatsProgress] = useState({ current: 0, total: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filterModality, setFilterModality] = useState('all');
  const [filterReasoning, setFilterReasoning] = useState('all');
  const [filterFree, setFilterFree] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  const STORAGE_KEY = 'openrouter_detailed_stats';
  const STORAGE_TIMESTAMP_KEY = 'openrouter_stats_timestamp';

  // Load cached stats from localStorage on mount
  useEffect(() => {
    const cachedStats = localStorage.getItem(STORAGE_KEY);
    const cachedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    
    if (cachedStats && cachedTimestamp) {
      try {
        setDetailedStats(JSON.parse(cachedStats));
        setLastUpdated(new Date(cachedTimestamp));
      } catch (err) {
        console.error('Error loading cached stats:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetch('https://openrouter.ai/api/v1/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching models:', err);
        setLoading(false);
      });
  }, []);

  const saveStatsToCache = (stats) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      const now = new Date();
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, now.toISOString());
      setLastUpdated(now);
    } catch (err) {
      console.error('Error saving stats to cache:', err);
    }
  };

  const fetchDetailedStats = async (model) => {
    try {
      const permaslug = encodeURIComponent(model.id);
      const response = await fetch(
        `https://openrouter.ai/api/frontend/stats/endpoint?permaslug=${permaslug}&variant=standard`
      );
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        return { modelId: model.id, stats: data.data[0] };
      }
      return { modelId: model.id, stats: null };
    } catch (err) {
      console.error(`Error fetching stats for ${model.id}:`, err);
      return { modelId: model.id, stats: null };
    }
  };

  const loadAllStats = async () => {
    setLoadingStats(true);
    const total = models.length;
    setStatsProgress({ current: 0, total });
    
    // Process in batches to avoid overwhelming the API
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < models.length; i += batchSize) {
      batches.push(models.slice(i, i + batchSize));
    }
    
    let allStats = { ...detailedStats };
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const results = await Promise.all(
        batch.map(model => fetchDetailedStats(model))
      );
      
      // Update accumulated stats
      results.forEach(({ modelId, stats }) => {
        if (stats) allStats[modelId] = stats;
      });
      
      // Update state with this batch's results
      setDetailedStats(allStats);
      
      setStatsProgress({ current: Math.min((i + 1) * batchSize, total), total });
      
      // Small delay between batches to be nice to the API
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    // Save to localStorage after all batches complete
    saveStatsToCache(allStats);
    
    setLoadingStats(false);
    setStatsProgress({ current: total, total });
  };

  const clearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? You will need to reload stats.')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
      setDetailedStats({});
      setLastUpdated(null);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Model Name',
      'Model ID',
      'Context Length',
      'Input Price',
      'Output Price',
      'P50 Latency (ms)',
      'P50 Throughput (tok/s)',
      'Max Prompt Tokens',
      'Max Completion Tokens',
      'Supports Reasoning',
      'Supports Tools',
      'Supports JSON',
      'Can Abort',
      'Moderation Required',
      'Is Free',
      'Input Modalities',
      'Provider',
      'Request Count'
    ];
    
    const rows = models.map(model => {
      const stats = detailedStats[model.id];
      return [
        `"${model.name}"`,
        model.id,
        model.context_length || '',
        model.pricing.prompt,
        model.pricing.completion,
        stats?.stats?.p50_latency || '',
        stats?.stats?.p50_throughput || '',
        stats?.max_prompt_tokens || model.top_provider?.context_length || '',
        stats?.max_completion_tokens || model.top_provider?.max_completion_tokens || '',
        hasReasoning(model) ? 'Yes' : 'No',
        model.supported_parameters?.includes('tools') ? 'Yes' : 'No',
        model.supported_parameters?.includes('structured_outputs') ? 'Yes' : 'No',
        stats?.can_abort ? 'Yes' : stats ? 'No' : '',
        stats?.moderation_required ? 'Yes' : stats ? 'No' : '',
        parseFloat(model.pricing.prompt) === 0 ? 'Yes' : 'No',
        `"${model.architecture.input_modalities?.join(', ') || ''}"`,
        stats?.provider_display_name || '',
        stats?.stats?.request_count || ''
      ];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openrouter-models-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (num === 0) return 'Free';
    if (num < 0.000001) return `$${(num * 1000000).toFixed(4)}/M`;
    if (num < 0.001) return `$${(num * 1000000).toFixed(2)}/M`;
    return `$${num.toFixed(6)}`;
  };

  const formatContext = (ctx) => {
    if (!ctx) return 'N/A';
    if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)}M`;
    if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}K`;
    return ctx.toString();
  };

  const formatLatency = (ms) => {
    if (!ms) return 'N/A';
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  const formatTimestamp = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const hasReasoning = (model) => {
    return model.supported_parameters?.includes('reasoning') || 
           model.supported_parameters?.includes('include_reasoning') ||
           model.description?.toLowerCase().includes('reasoning');
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = models.filter(m => {
      const matchesSearch = search === '' || 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesModality = filterModality === 'all' || 
        (filterModality === 'text' && m.architecture.modality.includes('text->text')) ||
        (filterModality === 'vision' && m.architecture.modality.includes('image'));
      
      const matchesReasoning = filterReasoning === 'all' ||
        (filterReasoning === 'yes' && hasReasoning(m)) ||
        (filterReasoning === 'no' && !hasReasoning(m));

      const isFree = parseFloat(m.pricing.prompt) === 0;
      const matchesFree = filterFree === 'all' ||
        (filterFree === 'yes' && isFree) ||
        (filterFree === 'no' && !isFree);

      return matchesSearch && matchesModality && matchesReasoning && matchesFree;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch(sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'context':
          aVal = a.context_length || 0;
          bVal = b.context_length || 0;
          break;
        case 'prompt':
          aVal = parseFloat(a.pricing.prompt);
          bVal = parseFloat(b.pricing.prompt);
          break;
        case 'completion':
          aVal = parseFloat(a.pricing.completion);
          bVal = parseFloat(b.pricing.completion);
          break;
        case 'latency':
          aVal = detailedStats[a.id]?.stats?.p50_latency || 999999;
          bVal = detailedStats[b.id]?.stats?.p50_latency || 999999;
          break;
        case 'throughput':
          aVal = detailedStats[a.id]?.stats?.p50_throughput || 0;
          bVal = detailedStats[b.id]?.stats?.p50_throughput || 0;
          break;
        case 'created':
          aVal = a.created || 0;
          bVal = b.created || 0;
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [models, search, sortBy, sortDir, filterModality, filterReasoning, filterFree, detailedStats]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  const toggleExpand = async (modelId) => {
    setExpandedRow(expandedRow === modelId ? null : modelId);
  };

  const statsLoadedCount = Object.keys(detailedStats).length;
  const statsLoadedPercent = models.length > 0 ? Math.round((statsLoadedCount / models.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OpenRouter Models Dashboard</h1>
          <p className="text-gray-600">{filteredAndSorted.length} of {models.length} models</p>
          <div className="flex items-center gap-4 mt-2">
            {statsLoadedCount > 0 && (
              <p className="text-sm text-gray-500">
                Performance stats loaded: {statsLoadedCount}/{models.length} ({statsLoadedPercent}%)
              </p>
            )}
            {lastUpdated && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Save className="w-3 h-3" />
                Last updated: {formatTimestamp(lastUpdated)}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search models..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterModality}
                onChange={(e) => setFilterModality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Modalities</option>
                <option value="text">Text Only</option>
                <option value="vision">Vision</option>
              </select>
            </div>

            <div>
              <select
                value={filterReasoning}
                onChange={(e) => setFilterReasoning(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Models</option>
                <option value="yes">With Reasoning</option>
                <option value="no">Without Reasoning</option>
              </select>
            </div>

            <div>
              <select
                value={filterFree}
                onChange={(e) => setFilterFree(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Pricing</option>
                <option value="yes">Free Only</option>
                <option value="no">Paid Only</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              {loadingStats && (
                <div className="text-sm text-gray-600">
                  Loading stats: {statsProgress.current} / {statsProgress.total}
                  <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(statsProgress.current / statsProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {statsLoadedCount > 0 && (
                <button
                  onClick={clearCache}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear Cache
                </button>
              )}
              <button
                onClick={exportToCSV}
                disabled={statsLoadedCount === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={loadAllStats}
                disabled={loadingStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingStats ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {statsLoadedCount > 0 ? 'Refresh' : 'Load'} All Stats
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Model <SortIcon field="name" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('context')}
                  >
                    Context <SortIcon field="context" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('prompt')}
                  >
                    Input <SortIcon field="prompt" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('completion')}
                  >
                    Output <SortIcon field="completion" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('latency')}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Latency <SortIcon field="latency" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('throughput')}
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    Speed <SortIcon field="throughput" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSorted.map((model) => {
                  const stats = detailedStats[model.id];
                  return (
                    <React.Fragment key={model.id}>
                      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(model.id)}>
                        <td className="px-4 py-3 text-center">
                          {expandedRow === model.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{model.name}</span>
                            <span className="text-xs text-gray-500">{model.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{formatContext(model.context_length)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{formatPrice(model.pricing.prompt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">{formatPrice(model.pricing.completion)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {stats?.stats?.p50_latency ? formatLatency(stats.stats.p50_latency) : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {stats?.stats?.p50_throughput ? `${stats.stats.p50_throughput.toFixed(1)} tok/s` : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {hasReasoning(model) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <Brain className="w-3 h-3 mr-1" />
                                Reasoning
                              </span>
                            )}
                            {model.supported_parameters?.includes('tools') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Tools
                              </span>
                            )}
                            {model.supported_parameters?.includes('structured_outputs') && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                JSON
                              </span>
                            )}
                            {parseFloat(model.pricing.prompt) === 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                Free
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedRow === model.id && (
                        <tr className="bg-gray-50">
                          <td colSpan="8" className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 mb-2">Model Details</h4>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Max Prompt:</span>
                                  <span className="font-medium">{formatContext(stats?.max_prompt_tokens || model.top_provider?.context_length)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Max Completion:</span>
                                  <span className="font-medium">{formatContext(stats?.max_completion_tokens || model.top_provider?.max_completion_tokens)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Can Abort:</span>
                                  <span className="font-medium">{stats?.can_abort ? '✓' : stats ? '✗' : 'N/A'}</span>
                                </div>
                                {stats?.stats && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Requests:</span>
                                    <span className="font-medium">{stats.stats.request_count}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 mb-2">Capabilities</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    {model.supported_parameters?.includes('response_format') ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-gray-300" />
                                    )}
                                    <span className="text-gray-700">Response Format</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {model.supported_parameters?.includes('tool_choice') ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-gray-300" />
                                    )}
                                    <span className="text-gray-700">Tool Choice</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {stats?.supports_multipart ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-gray-300" />
                                    )}
                                    <span className="text-gray-700">Multipart</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {stats?.moderation_required ? (
                                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    <span className="text-gray-700">Moderation {stats?.moderation_required ? 'Required' : 'Optional'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-900 mb-2">Modalities</h4>
                                <div className="flex flex-wrap gap-1">
                                  {model.architecture.input_modalities?.map((mod) => (
                                    <span key={mod} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                      {mod}
                                    </span>
                                  ))}
                                </div>
                                {model.description && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 line-clamp-3">{model.description}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💾 Data automatically saved to browser cache • Click "Refresh All Stats" to update • Export to CSV anytime</p>
        </div>
      </div>
    </div>
  );
};

export default ModelsDashboard;
