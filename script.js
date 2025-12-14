const { useState, useEffect, useMemo } = React;

// Simple SVG icon components (replacing lucide-react)
const Search = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChevronDown = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ChevronUp = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const Brain = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);
const CheckCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);
const AlertCircle = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const Clock = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const Zap = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const Download = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const Save = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const RefreshCw = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const Copy = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// Initial cross-reference mapping from Set 1 (aliases) to Set 2 (OpenRouter vendor/id)
// These seed values come from the table you provided. Users can override them in the Mapping tab.
const INITIAL_AA_MAPPING = [
  { alias: 'Apriel-v1.5-15B-Thinker', targetId: null, certainty: '-' },
  { alias: 'Aya Expanse 32B', targetId: null, certainty: '-' },
  { alias: 'Aya Expanse 8B', targetId: null, certainty: '-' },
  { alias: 'Claude 4.1 Opus', targetId: 'anthropic/claude-4.1-opus', certainty: 'High' },
  { alias: 'Claude 4.5 Haiku', targetId: 'anthropic/claude-haiku-4.5', certainty: 'High' },
  { alias: 'Claude 4.5 Sonnet', targetId: 'anthropic/claude-4.5-sonnet', certainty: 'High' },
  { alias: 'Codestral (Jan)', targetId: 'mistralai/codestral-2501', certainty: 'High' },
  { alias: 'Command A', targetId: 'cohere/command-a', certainty: 'High' },
  { alias: 'DeepHermes 3 - Llama-3.1 8B', targetId: 'nousresearch/deephermes-3-llama-3-8b-preview', certainty: 'High' },
  { alias: 'DeepHermes 3 - Mistral 24B', targetId: 'nousresearch/deephermes-3-mistral-24b-preview', certainty: 'High' },
  { alias: 'DeepSeek R1 0528', targetId: 'deepseek/deepseek-r1-0528', certainty: 'High' },
  { alias: 'DeepSeek R1 0528 Qwen3 8B', targetId: 'deepseek/deepseek-r1-0528-qwen3-8b', certainty: 'High' },
  { alias: 'DeepSeek R1 Distill Llama 70B', targetId: 'deepseek/deepseek-r1-distill-llama-70b', certainty: 'High' },
  { alias: 'DeepSeek V3.1 Terminus', targetId: 'deepseek/deepseek-v3.1-terminus', certainty: 'High' },
  { alias: 'DeepSeek V3.2 Exp', targetId: 'deepseek/deepseek-v3.2-exp', certainty: 'High' },
  { alias: 'Devstral Medium', targetId: 'mistralai/devstral-medium', certainty: 'High' },
  { alias: 'Devstral Small', targetId: 'mistralai/devstral-small', certainty: 'High' },
  { alias: 'ERNIE 4.5 300B A47B', targetId: 'baidu/ernie-4.5-300b-a47b', certainty: 'High' },
  { alias: 'EXAONE 4.0 32B', targetId: null, certainty: '-' },
  { alias: 'Exaone 4.0 1.2B', targetId: null, certainty: '-' },
  { alias: 'Gemma 3 12B', targetId: 'google/gemma-3-12b-it', certainty: 'High' },
  { alias: 'Gemma 3 1B', targetId: null, certainty: '-' },
  { alias: 'Gemma 3 270M', targetId: null, certainty: '-' },
  { alias: 'Gemma 3 27B', targetId: 'google/gemma-3-27b-it', certainty: 'High' },
  { alias: 'Gemma 3 4B', targetId: 'google/gemma-3-4b-it', certainty: 'High' },
  { alias: 'Gemma 3n E2B', targetId: 'google/gemma-3n-e2b-it:free', certainty: 'High' },
  { alias: 'Gemma 3n E4B', targetId: 'google/gemma-3n-e4b-it', certainty: 'High' },
  { alias: 'Gemini 2.5 Flash (Sep)', targetId: 'google/gemini-2.5-flash-preview-09-2025', certainty: 'High' },
  { alias: 'Gemini 2.5 Flash-Lite (Sep)', targetId: 'google/gemini-2.5-flash-lite-preview-09-2025', certainty: 'High' },
  { alias: 'Gemini 2.5 Pro', targetId: 'google/gemini-2.5-pro', certainty: 'High' },
  { alias: 'GLM-4.5-Air', targetId: 'z-ai/glm-4.5-air', certainty: 'High' },
  { alias: 'GLM-4.5V', targetId: 'z-ai/glm-4.5v', certainty: 'High' },
  { alias: 'GLM-4.6', targetId: 'z-ai/glm-4.6', certainty: 'High' },
  { alias: 'GPT-5 (ChatGPT)', targetId: 'openai/gpt-5-chat', certainty: 'High' },
  { alias: 'GPT-5 (high)', targetId: 'openai/gpt-5', certainty: 'High' },
  { alias: 'GPT-5 (low)', targetId: 'openai/gpt-5', certainty: 'High' },
  { alias: 'GPT-5 (medium)', targetId: 'openai/gpt-5', certainty: 'High' },
  { alias: 'GPT-5 (minimal)', targetId: 'openai/gpt-5', certainty: 'High' },
  { alias: 'GPT-5 Codex (high)', targetId: 'openai/gpt-5-codex', certainty: 'High' },
  { alias: 'GPT-5 mini (high)', targetId: 'openai/gpt-5-mini', certainty: 'High' },
  { alias: 'GPT-5 mini (medium)', targetId: 'openai/gpt-5-mini', certainty: 'High' },
  { alias: 'GPT-5 mini (minimal)', targetId: 'openai/gpt-5-mini', certainty: 'High' },
  { alias: 'GPT-5 nano (high)', targetId: 'openai/gpt-5-nano', certainty: 'High' },
  { alias: 'GPT-5 nano (medium)', targetId: 'openai/gpt-5-nano', certainty: 'High' },
  { alias: 'GPT-5 nano (minimal)', targetId: 'openai/gpt-5-nano', certainty: 'High' },
  { alias: 'Granite 4.0 H Small', targetId: null, certainty: '-' },
  { alias: 'Granite 4.0 Micro', targetId: 'ibm-granite/granite-4.0-h-micro', certainty: 'High' },
  { alias: 'Grok 3 mini Reasoning (high)', targetId: 'x-ai/grok-3-mini', certainty: 'High' },
  { alias: 'Grok 4', targetId: null, certainty: '-' },
  { alias: 'Grok 4 Fast', targetId: 'x-ai/grok-4-fast', certainty: 'High' },
  { alias: 'Grok Code Fast 1', targetId: 'x-ai/grok-code-fast-1', certainty: 'High' },
  { alias: 'Hermes 4 405B', targetId: 'nousresearch/hermes-4-405b', certainty: 'High' },
  { alias: 'Hermes 4 70B', targetId: 'nousresearch/hermes-4-70b', certainty: 'High' },
  { alias: 'Jamba 1.7 Large', targetId: 'ai21/jamba-large-1.7', certainty: 'High' },
  { alias: 'Jamba 1.7 Mini', targetId: 'ai21/jamba-mini-1.7', certainty: 'High' },
  { alias: 'Jamba Reasoning 3B', targetId: null, certainty: '-' },
  { alias: 'Kimi K2 0905', targetId: 'moonshotai/kimi-k2-0905', certainty: 'High' },
  { alias: 'LFM2 1.2B', targetId: null, certainty: '-' },
  { alias: 'LFM2 2.6B', targetId: 'liquid/lfm-2.2-6b', certainty: 'High' },
  { alias: 'LFM2 8B A1B', targetId: 'liquid/lfm2-8b-a1b', certainty: 'High' },
  { alias: 'Llama 3.1 405B', targetId: 'meta-llama/llama-3.1-405b', certainty: 'High' },
  { alias: 'Llama 3.1 Nemotron 70B', targetId: 'nvidia/llama-3.1-nemotron-70b-instruct', certainty: 'High' },
  { alias: 'Llama 3.1 Nemotron Nano 4B v1.1', targetId: null, certainty: '-' },
  { alias: 'Llama 3.2 11B (Vision)', targetId: 'meta-llama/llama-3.2-11b-vision-instruct', certainty: 'High' },
  { alias: 'Llama 3.2 90B (Vision)', targetId: 'meta-llama/llama-3.2-90b-vision-instruct', certainty: 'High' },
  { alias: 'Llama 3.3 70B', targetId: 'meta-llama/llama-3.3-70b-instruct', certainty: 'High' },
  { alias: 'Llama 3.3 Nemotron Super 49B', targetId: 'nvidia/llama-3.3-nemotron-super-49b-v1.5', certainty: 'High' },
  { alias: 'Llama 4 Maverick', targetId: 'meta-llama/llama-4-maverick', certainty: 'High' },
  { alias: 'Llama 4 Scout', targetId: 'meta-llama/llama-4-scout', certainty: 'High' },
  { alias: 'Llama Nemotron Super 49B v1.5', targetId: 'nvidia/llama-3.3-nemotron-super-49b-v1.5', certainty: 'High' },
  { alias: 'Llama Nemotron Ultra', targetId: 'nvidia/llama-3.1-nemotron-ultra-253b-v1', certainty: 'High' },
  { alias: 'Magistral Medium 1.2', targetId: 'mistralai/magistral-medium-1.2', certainty: 'High' },
  { alias: 'Magistral Small 1.2', targetId: 'mistralai/magistral-small-1.2', certainty: 'High' },
  { alias: 'MiniMax M1 40k', targetId: 'minimax/minimax-m1', certainty: 'High' },
  { alias: 'MiniMax M1 80k', targetId: 'minimax/minimax-m1', certainty: 'High' },
  { alias: 'MiniMax-M2', targetId: 'minimax/minimax-m2:free', certainty: 'High' },
  { alias: 'MiniMax-Text-01', targetId: 'minimax/minimax-01', certainty: 'High' },
  { alias: 'Ministral 3B', targetId: 'mistralai/ministral-3b', certainty: 'High' },
  { alias: 'Ministral 8B', targetId: 'mistralai/ministral-8b', certainty: 'High' },
  { alias: 'Mistral Medium 3.1', targetId: 'mistralai/mistral-medium-3.1', certainty: 'High' },
  { alias: 'Mistral Small 3.2', targetId: 'mistralai/mistral-small-3.2-24b-instruct', certainty: 'High' },
  { alias: 'Nova Lite', targetId: 'amazon/nova-lite-v1', certainty: 'High' },
  { alias: 'Nova Micro', targetId: 'amazon/nova-micro-v1', certainty: 'High' },
  { alias: 'Nova Premier', targetId: null, certainty: '-' },
  { alias: 'Nova Pro', targetId: 'amazon/nova-pro-v1', certainty: 'High' },
  { alias: 'NVIDIA Nemotron Nano 9B V2', targetId: 'nvidia/nemotron-nano-9b-v2', certainty: 'High' },
  { alias: 'Phi-4', targetId: 'microsoft/phi-4', certainty: 'High' },
  { alias: 'Phi-4 Mini', targetId: null, certainty: '-' },
  { alias: 'Phi-4 Multimodal', targetId: 'microsoft/phi-4-multimodal-instruct', certainty: 'High' },
  { alias: 'Qwen3 235B A22B 2507', targetId: 'qwen/qwen3-235b-a22b-2507', certainty: 'High' },
  { alias: 'Qwen3 235B 2507', targetId: 'qwen/qwen3-235b-a22b-2507', certainty: 'High' },
  { alias: 'Qwen3 30B A3B 2507', targetId: 'qwen/qwen3-30b-a3b-instruct-2507', certainty: 'High' },
  { alias: 'Qwen3 4B 2507', targetId: 'qwen/qwen3-4b:free', certainty: 'Medium' },
  { alias: 'Qwen3 Coder 30B A3B', targetId: 'qwen/qwen3-coder-30b-a3b-instruct', certainty: 'High' },
  { alias: 'Qwen3 Coder 480B', targetId: 'qwen/qwen3-coder', certainty: 'High' },
  { alias: 'Qwen3 Max', targetId: 'qwen/qwen3-max', certainty: 'High' },
  { alias: 'Qwen3 Next 80B A3B', targetId: 'qwen/qwen3-next-80b-a3b-instruct', certainty: 'High' },
  { alias: 'Qwen3 Omni 30B A3B', targetId: null, certainty: '-' },
  { alias: 'Qwen3 VL 30B A3B', targetId: 'qwen/qwen3-vl-30b-a3b-instruct', certainty: 'High' },
  { alias: 'Qwen3 VL 4B', targetId: null, certainty: '-' },
  { alias: 'Qwen3 VL 8B', targetId: 'qwen/qwen3-vl-8b-instruct', certainty: 'High' },
  { alias: 'R1 1776', targetId: null, certainty: '-' },
  { alias: 'Reka Flash 3', targetId: null, certainty: '-' },
  { alias: 'Seed-OSS-36B-Instruct', targetId: null, certainty: '-' },
  { alias: 'Solar Pro 2', targetId: null, certainty: '-' },
  { alias: 'gpt-oss-120B (high)', targetId: 'openai/gpt-oss-120b', certainty: 'High' },
  { alias: 'gpt-oss-20B (high)', targetId: 'openai/gpt-oss-20b', certainty: 'High' },
  { alias: 'o3', targetId: 'openai/o3', certainty: 'High' },
];


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
  const [filterFeatures, setFilterFeatures] = useState({
    tools: false,
    json: false,
    response_format: false,
    tool_choice: false
  });
  const [minContext, setMinContext] = useState(0);
  const [maxPromptPrice, setMaxPromptPrice] = useState(5); // per 1M tokens - default to common range
  const [maxCompletionPrice, setMaxCompletionPrice] = useState(10); // per 1M tokens - default to common range
  const [showFullPriceRange, setShowFullPriceRange] = useState(false); // toggle for full range vs common range
  const [expandedRow, setExpandedRow] = useState(null);
  const [hasAttemptedAutoLoad, setHasAttemptedAutoLoad] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [plotXAxis, setPlotXAxis] = useState('latency');
  const [plotYAxis, setPlotYAxis] = useState('throughput');
  // Artificial Analysis leaderboard
  const [aaIndexMap, setAaIndexMap] = useState({});
  const [aaLoading, setAaLoading] = useState(false);
  const [aaError, setAaError] = useState(null);
  // AA cross-reference mapping view
  const MAPPING_STORAGE_KEY = 'aa_model_mapping_v1';
  const [aaMapping, setAaMapping] = useState([]);

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

  // Initialize AA mapping from localStorage + seed
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(MAPPING_STORAGE_KEY) || '{}');
      const merged = INITIAL_AA_MAPPING.map(item => ({
        ...item,
        targetId: Object.prototype.hasOwnProperty.call(saved, item.alias) ? saved[item.alias] : item.targetId
      }));
      setAaMapping(merged);
    } catch (e) {
      setAaMapping(INITIAL_AA_MAPPING);
    }
  }, []);

  // Persist AA mapping on change
  useEffect(() => {
    if (!aaMapping || aaMapping.length === 0) return;
    const obj = {};
    aaMapping.forEach(it => { if (it.targetId) obj[it.alias] = it.targetId; });
    try { localStorage.setItem(MAPPING_STORAGE_KEY, JSON.stringify(obj)); } catch (e) {}
  }, [aaMapping]);

  // Fetch Artificial Analysis leaderboard (only via local proxy server)
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) return;
    if (models.length === 0) return;
    if (Object.keys(aaIndexMap).length > 0 || aaLoading) return;
    setAaLoading(true);
    fetch('/api/aa/leaderboard', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data?.aa_index_map) {
          setAaIndexMap(data.aa_index_map);
          if (!window._aaLogged) {
            console.log('AA leaderboard loaded entries:', Object.keys(data.aa_index_map).length);
            window._aaLogged = true;
          }
        } else if (data?.error) {
          setAaError(data.error);
        }
      })
      .catch(err => setAaError(err.message))
      .finally(() => setAaLoading(false));
  }, [models, aaIndexMap, aaLoading]);

  useEffect(() => {
    // Use proxy server if running on localhost, otherwise direct API
    const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? '/api/models'
      : 'https://openrouter.ai/api/v1/models';

    // Always fetch fresh data (no caching)
    fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(data => {
        setModels(data.data || []);
        setLoading(false);
        console.log(`✓ Loaded ${data.data?.length || 0} models from API`);
        // Debug: log first model to see structure
        if (data.data && data.data.length > 0 && !window._modelsLogged) {
          console.log('Sample model data structure:', JSON.stringify(data.data[0], null, 2));
          window._modelsLogged = true;
        }
      })
      .catch(err => {
        console.error('Error fetching models:', err);
        setLoading(false);
      });
  }, []);

  // Auto-load stats if we have models but no cached stats (only once)
  // Only when running via proxy server (localhost)
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost && models.length > 0 && Object.keys(detailedStats).length === 0 && !loadingStats && !hasAttemptedAutoLoad) {
      setHasAttemptedAutoLoad(true);
      const timer = setTimeout(() => {
        loadAllStats();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [models, detailedStats, loadingStats, hasAttemptedAutoLoad]);

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

  // Helper function to calculate average of last N data points from comparison API
  const calculateComparisonAverage = (comparisonData, modelId, numPoints = 3) => {
    if (!comparisonData || !comparisonData.data || comparisonData.data.length === 0) {
      return null;
    }

    // Extract values for this model from all time points
    const values = [];
    for (const dataPoint of comparisonData.data) {
      if (dataPoint.y && dataPoint.y[modelId] !== undefined) {
        values.push(dataPoint.y[modelId]);
      }
    }

    if (values.length === 0) {
      return null;
    }

    // Get last N values
    const lastNValues = values.slice(-numPoints);

    // Calculate average
    const sum = lastNValues.reduce((acc, val) => acc + val, 0);
    return sum / lastNValues.length;
  };

  const fetchDetailedStats = async (model) => {
    try {
      // Use canonical_slug if available, otherwise fall back to id
      const slug = model.canonical_slug || model.id;
      const permaslug = encodeURIComponent(slug);

      // Use proxy server if running on localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      // URLs for live latency and throughput comparison data
      const latencyUrl = isLocalhost
        ? `/api/stats/latency-e2e-comparison?permaslug=${permaslug}`
        : `https://openrouter.ai/api/frontend/stats/latency-e2e-comparison?permaslug=${permaslug}`;
      const throughputUrl = isLocalhost
        ? `/api/stats/throughput-comparison?permaslug=${permaslug}`
        : `https://openrouter.ai/api/frontend/stats/throughput-comparison?permaslug=${permaslug}`;

      let liveLatency = null;
      let liveThroughput = null;

      // Try multiple variants in order: standard, free, extended
      const variants = ['standard', 'free', 'extended'];

      for (const variant of variants) {
        const url = isLocalhost
          ? `/api/stats?permaslug=${permaslug}&variant=${variant}`
          : `https://openrouter.ai/api/frontend/stats/endpoint?permaslug=${permaslug}&variant=${variant}`;

        const response = await fetch(url);
        const data = await response.json();

        // Fetch comparison data (only on first variant attempt to avoid redundant calls)
        if (variant === 'standard' && liveLatency === null && liveThroughput === null) {
          try {
            const [latencyResponse, throughputResponse] = await Promise.all([
              fetch(latencyUrl),
              fetch(throughputUrl)
            ]);

            const latencyData = await latencyResponse.json();
            const throughputData = await throughputResponse.json();

            // Calculate averages of last 3 data points
            liveLatency = calculateComparisonAverage(latencyData, model.id, 3);
            liveThroughput = calculateComparisonAverage(throughputData, model.id, 3);

            // Debug: log comparison data
            if (!window._comparisonLogged) {
              console.log('Live comparison data:', {
                modelId: model.id,
                liveLatency,
                liveThroughput
              });
              window._comparisonLogged = true;
            }
          } catch (err) {
            console.warn(`Failed to fetch comparison data for ${model.id}:`, err.message);
          }
        }

        // Debug: log first result to see structure
        if (data.data && data.data.length > 0 && !window._statsLogged) {
          console.log('Sample stats data structure:', JSON.stringify(data.data[0], null, 2));
          window._statsLogged = true;
        }

        // If we got valid data, return it with live comparison data
        if (data.data && data.data.length > 0) {
          return {
            modelId: model.id,
            stats: {
              ...data.data[0],
              live_latency: liveLatency,
              live_throughput: liveThroughput
            },
            variant
          };
        }
      }

      // If all variants failed, return null
      return { modelId: model.id, stats: null, error: 'No stats found in any variant' };
    } catch (err) {
      return { modelId: model.id, stats: null, error: err.message };
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
    const modelsWithoutStats = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const results = await Promise.all(
        batch.map(model => fetchDetailedStats(model))
      );

      // Update accumulated stats
      results.forEach(({ modelId, stats, error }) => {
        if (stats) {
          allStats[modelId] = stats;
        } else {
          // Track models that had no stats
          const model = models.find(m => m.id === modelId);
          if (model) {
            modelsWithoutStats.push({
              id: model.id,
              name: model.name,
              error: error
            });
          }
        }
      });

      // Update state with this batch's results
      setDetailedStats(allStats);

      setStatsProgress({ current: Math.min((i + 1) * batchSize, total), total });

      // Small delay between batches to be nice to the API
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Log models without stats for debugging
    if (modelsWithoutStats.length > 0) {
      console.log(`\n📊 Models without stats (${modelsWithoutStats.length}):`);
      console.table(modelsWithoutStats);
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

  // AA mapping helpers
  const normalizeNameForAA = (str) => {
    if (!str) return '';
    let s = str.replace(/\(.*\)/g, '');
    s = s.toLowerCase().replace(/\u00a0/g, ' ');
    s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s;
  };

  const getAaIndexForModel = (model) => {
    if (!aaIndexMap || Object.keys(aaIndexMap).length === 0) return null;
    const nameCand = normalizeNameForAA(model.name);
    const idFull = normalizeNameForAA(model.id);
    const idLast = normalizeNameForAA(model.id.split('/').pop());
    const candidates = [nameCand, idLast, idFull].filter(Boolean);
    for (const c of candidates) {
      if (aaIndexMap[c] !== undefined) return aaIndexMap[c];
    }
    for (const key in aaIndexMap) {
      if (!key) continue;
      if (candidates.some(c => c && (key.includes(c) || c.includes(key)))) {
        return aaIndexMap[key];
      }
    }
    return null;
  };

  const exportToCSV = () => {
    const headers = [
      'Model Name',
      'Model ID',
      'Context Length',
      'Input Price',
      'Output Price',
      'AA Index',
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
      const aaIndex = getAaIndexForModel(model);
      return [
        `"${model.name}"`, // Enclose model name in quotes for CSV safety
        model.id,
        model.context_length || '',
        model.pricing.prompt,
        model.pricing.completion,
        aaIndex ?? '',
        stats?.stats?.p50_latency || stats?.p50_latency || '',
        stats?.stats?.p50_throughput || stats?.p50_throughput || '',
        stats?.max_prompt_tokens || model.top_provider?.context_length || '',
        stats?.max_completion_tokens || model.top_provider?.max_completion_tokens || '',
        hasReasoning(model) ? 'Yes' : 'No',
        model.supported_parameters?.includes('tools') ? 'Yes' : 'No',
        model.supported_parameters?.includes('structured_outputs') ? 'Yes' : 'No',
        stats?.can_abort ? 'Yes' : stats ? 'No' : '',
        stats?.moderation_required ? 'Yes' : stats ? 'No' : '',
        parseFloat(model.pricing.prompt) === 0 ? 'Yes' : 'No',
        `"${model.architecture.input_modalities?.join(', ') || ''}"`, // Enclose modalities in quotes
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

  // Calculate available ranges
  // Context: based on filtered models (excluding context/price to avoid circular dependency)
  // Prices: based on ALL models (so you can always set max to see all price ranges)
  const availableRanges = useMemo(() => {
    if (models.length === 0) {
      return {
        maxContext: 2000000,
        maxPromptPrice: 10000, // per 1M tokens
        maxCompletionPrice: 10000 // per 1M tokens
      };
    }

    // For context, use pre-filtered models (excluding context/price filters)
    const preFiltered = models.filter(m => {
      const matchesSearch = search === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase());

      const matchesModality = filterModality === 'all' ||
        (filterModality === 'text' && m.architecture.modality.includes('text->text')) ||
        (filterModality === 'vision' && m.architecture.modality.includes('image'));

      const matchesReasoning = filterReasoning === 'all' ||
        (filterReasoning === 'yes' && hasReasoning(m)) ||
        (filterReasoning === 'no' && !hasReasoning(m));

      const promptPrice = parseFloat(m.pricing.prompt);
      const completionPrice = parseFloat(m.pricing.completion);
      const isFree = promptPrice === 0 && completionPrice === 0;
      const matchesFree = filterFree === 'all' ||
        (filterFree === 'yes' && isFree) ||
        (filterFree === 'no' && !isFree);

      const hasAnyFeatureFilter = Object.values(filterFeatures).some(v => v);
      const matchesFeatures = !hasAnyFeatureFilter || (
        (!filterFeatures.tools || m.supported_parameters?.includes('tools')) &&
        (!filterFeatures.json || m.supported_parameters?.includes('structured_outputs')) &&
        (!filterFeatures.response_format || m.supported_parameters?.includes('response_format')) &&
        (!filterFeatures.tool_choice || m.supported_parameters?.includes('tool_choice'))
      );

      return matchesSearch && matchesModality && matchesReasoning && matchesFree && matchesFeatures;
    });

    const contexts = preFiltered.map(m => m.context_length || 0).filter(c => c > 0);

    // For prices, use ALL models to allow full range selection
    // Convert to per 1M tokens (multiply by 1,000,000)
    const allPromptPrices = models.map(m => parseFloat(m.pricing.prompt) * 1000000);
    const allCompletionPrices = models.map(m => parseFloat(m.pricing.completion) * 1000000);

    const fullMaxPromptPrice = Math.max(...allPromptPrices, 0.001);
    const fullMaxCompletionPrice = Math.max(...allCompletionPrices, 0.001);

    // Common range: focus on the majority of models (95th percentile)
    const sortedPrompt = [...allPromptPrices].sort((a, b) => a - b);
    const sortedCompletion = [...allCompletionPrices].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedPrompt.length * 0.95);
    const commonMaxPromptPrice = sortedPrompt[p95Index] || 5;
    const commonMaxCompletionPrice = sortedCompletion[p95Index] || 10;

    return {
      maxContext: contexts.length > 0 ? Math.max(...contexts) : 2000000,
      maxPromptPrice: showFullPriceRange ? fullMaxPromptPrice : commonMaxPromptPrice,
      maxCompletionPrice: showFullPriceRange ? fullMaxCompletionPrice : commonMaxCompletionPrice,
      fullMaxPromptPrice,
      fullMaxCompletionPrice,
      commonMaxPromptPrice,
      commonMaxCompletionPrice
    };
  }, [models, search, filterModality, filterReasoning, filterFree, filterFeatures, showFullPriceRange]);

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

      // Free/Paid filter
      const promptPrice = parseFloat(m.pricing.prompt);
      const completionPrice = parseFloat(m.pricing.completion);
      const isFree = promptPrice === 0 && completionPrice === 0;
      const matchesFree = filterFree === 'all' ||
        (filterFree === 'yes' && isFree) ||
        (filterFree === 'no' && !isFree);

      // Feature filters: ALL checked features must be present (AND logic)
      const hasAnyFeatureFilter = Object.values(filterFeatures).some(v => v);
      const matchesFeatures = !hasAnyFeatureFilter || (
        (!filterFeatures.tools || m.supported_parameters?.includes('tools')) &&
        (!filterFeatures.json || m.supported_parameters?.includes('structured_outputs')) &&
        (!filterFeatures.response_format || m.supported_parameters?.includes('response_format')) &&
        (!filterFeatures.tool_choice || m.supported_parameters?.includes('tool_choice'))
      );

      // Context length filter: must be >= minimum
      const contextLength = m.context_length || 0;
      const matchesContext = contextLength >= minContext;

      // Price filters: BOTH prices must be within limits (unless it's free and free filter is active)
      // Convert to per 1M tokens for comparison
      const promptPricePer1M = promptPrice * 1000000;
      const completionPricePer1M = completionPrice * 1000000;
      const matchesPrice = (filterFree === 'yes' && isFree) ||
        (promptPricePer1M <= maxPromptPrice && completionPricePer1M <= maxCompletionPrice);

      return matchesSearch && matchesModality && matchesReasoning && matchesFree && matchesFeatures && matchesContext && matchesPrice;
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
        case 'aa_index':
          aVal = getAaIndexForModel(a) ?? -1;
          bVal = getAaIndexForModel(b) ?? -1;
          break;
        case 'latency':
          aVal = detailedStats[a.id]?.stats?.live_latency || detailedStats[a.id]?.live_latency ||
                 detailedStats[a.id]?.stats?.p50_latency || detailedStats[a.id]?.p50_latency || 999999;
          bVal = detailedStats[b.id]?.stats?.live_latency || detailedStats[b.id]?.live_latency ||
                 detailedStats[b.id]?.stats?.p50_latency || detailedStats[b.id]?.p50_latency || 999999;
          break;
        case 'throughput':
          aVal = detailedStats[a.id]?.stats?.live_throughput || detailedStats[a.id]?.live_throughput ||
                 detailedStats[a.id]?.stats?.p50_throughput || detailedStats[a.id]?.p50_throughput || 0;
          bVal = detailedStats[b.id]?.stats?.live_throughput || detailedStats[b.id]?.live_throughput ||
                 detailedStats[b.id]?.stats?.p50_throughput || detailedStats[b.id]?.p50_throughput || 0;
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
  }, [models, search, sortBy, sortDir, filterModality, filterReasoning, filterFree, filterFeatures, minContext, maxPromptPrice, maxCompletionPrice, detailedStats]);

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

  const copyModelId = (modelId, event) => {
    event.stopPropagation(); // Prevent row expansion when clicking copy
    navigator.clipboard.writeText(modelId).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', modelId);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
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

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${ 
                activeTab === 'table'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${ 
                activeTab === 'chart'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setActiveTab('mapping')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${ 
                activeTab === 'mapping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              AA Mapping
            </button>
          </div>

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

        {window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <strong>Note:</strong> Performance stats (latency/throughput) require running the Python proxy server.
                See README for instructions: <code className="bg-yellow-100 px-1 rounded">python3 server.py</code>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Feature checkboxes */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Features
              </label>
              <p className="text-xs text-gray-500 mb-2">Models must have ALL checked features (AND logic)</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterFeatures.tools}
                    onChange={(e) => setFilterFeatures({...filterFeatures, tools: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tools</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterFeatures.json}
                    onChange={(e) => setFilterFeatures({...filterFeatures, json: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">JSON/Structured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterFeatures.response_format}
                    onChange={(e) => setFilterFeatures({...filterFeatures, response_format: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Response Format</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filterFeatures.tool_choice}
                    onChange={(e) => setFilterFeatures({...filterFeatures, tool_choice: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tool Choice</span>
                </label>
              </div>
            </div>

            {/* Min Context Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Context: {minContext >= 1000000 ? `${(minContext/1000000).toFixed(1)}M` : minContext >= 1000 ? `${(minContext/1000).toFixed(0)}K` : minContext}
              </label>
              <input
                type="range"
                min="0"
                max={availableRanges.maxContext}
                step="10000"
                value={Math.min(minContext, availableRanges.maxContext)}
                onChange={(e) => setMinContext(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{availableRanges.maxContext >= 1000000 ? `${(availableRanges.maxContext/1000000).toFixed(1)}M` : `${(availableRanges.maxContext/1000).toFixed(0)}K`}</span>
              </div>
            </div>

            {/* Max Input Price Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Input Price: ${maxPromptPrice.toFixed(2)}/1M tokens
              </label>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFullPriceRange}
                    onChange={(e) => setShowFullPriceRange(e.target.checked)}
                    className="w-3 h-3 text-blue-600 rounded mr-1"
                  />
                  Show full range (${availableRanges.fullMaxPromptPrice?.toFixed(0)})
                </label>
              </div>
              <input
                type="range"
                min="0"
                max={availableRanges.maxPromptPrice}
                step={Math.max(0.01, availableRanges.maxPromptPrice / 1000)}
                value={Math.min(maxPromptPrice, availableRanges.maxPromptPrice)}
                onChange={(e) => setMaxPromptPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>${availableRanges.maxPromptPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2"></div>
            <div></div>
            {/* Max Output Price Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Output Price: ${maxCompletionPrice.toFixed(2)}/1M tokens
              </label>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFullPriceRange}
                    onChange={(e) => setShowFullPriceRange(e.target.checked)}
                    className="w-3 h-3 text-blue-600 rounded mr-1"
                  />
                  Show full range (${availableRanges.fullMaxCompletionPrice?.toFixed(0)})
                </label>
              </div>
              <input
                type="range"
                min="0"
                max={availableRanges.maxCompletionPrice}
                step={Math.max(0.01, availableRanges.maxCompletionPrice / 1000)}
                value={Math.min(maxCompletionPrice, availableRanges.maxCompletionPrice)}
                onChange={(e) => setMaxCompletionPrice(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>${availableRanges.maxCompletionPrice.toFixed(2)}</span>
              </div>
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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

        {activeTab === 'table' && (
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
                    onClick={() => handleSort('aa_index')}
                  >
                    AA Index <SortIcon field="aa_index" />
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
                  const aaIndex = getAaIndexForModel(model);
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
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col flex-1">
                              <span className="text-sm font-medium text-gray-900">{model.name}</span>
                              <span className="text-xs text-gray-500">{model.id}</span>
                            </div>
                            <button
                              onClick={(e) => copyModelId(model.id, e)}
                              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                              title="Copy model ID"
                            >
                              <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                            </button>
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
                          <span className="text-sm text-gray-900">{aaIndex !== null && aaIndex !== undefined ? `${aaIndex}` : '-'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {stats?.stats?.live_latency ? formatLatency(stats.stats.live_latency) : 
                             stats?.live_latency ? formatLatency(stats.live_latency) :
                             stats?.stats?.p50_latency ? formatLatency(stats.stats.p50_latency) :
                             stats?.p50_latency ? formatLatency(stats.p50_latency) : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {stats?.stats?.live_throughput ? `${stats.stats.live_throughput.toFixed(1)} tok/s` : 
                             stats?.live_throughput ? `${stats.live_throughput.toFixed(1)} tok/s` :
                             stats?.stats?.p50_throughput ? `${stats.stats.p50_throughput.toFixed(1)} tok/s` :
                             stats?.p50_throughput ? `${stats.p50_throughput.toFixed(1)} tok/s` : '-'}
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
                          <td colSpan="9" className="px-4 py-4">
                            <div className="space-y-4">
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
                                      <span className="font-medium">{stats.stats.request_count?.toLocaleString()}</span>
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
                                </div>
                              </div>

                              {model.description && (
                                <div className="pt-3 border-t border-gray-200">
                                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Description</h4>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{model.description}</p>
                                </div>
                              )}
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
        )}

        {activeTab === 'chart' && (
          <ScatterPlot
            models={filteredAndSorted}
            detailedStats={detailedStats}
            xAxis={plotXAxis}
            yAxis={plotYAxis}
            onXAxisChange={setPlotXAxis}
            onYAxisChange={setPlotYAxis}
            formatPrice={formatPrice}
          />
        )}

        {activeTab === 'mapping' && (
          <MappingView
            models={models}
            mapping={aaMapping}
            setMapping={setAaMapping}
          />
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💾 Data automatically saved to browser cache • Click "Refresh All Stats" to update • Export to CSV anytime</p>
        </div>
      </div>
    </div>
  );
};

const ScatterPlot = ({ models, detailedStats, xAxis, yAxis, onXAxisChange, onYAxisChange, formatPrice }) => {
  const [hoveredModel, setHoveredModel] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getAxisValue = (model, axis) => {
    const stats = detailedStats[model.id];
    switch(axis) {
      case 'latency':
        return stats?.stats?.live_latency || stats?.live_latency ||
               stats?.stats?.p50_latency || stats?.p50_latency || null;
      case 'throughput':
        return stats?.stats?.live_throughput || stats?.live_throughput ||
               stats?.stats?.p50_throughput || stats?.p50_throughput || null;
      case 'prompt_price':
        return parseFloat(model.pricing.prompt);
      case 'completion_price':
        return parseFloat(model.pricing.completion);
      case 'context_length':
        return model.context_length || null;
      case 'request_count':
        return stats?.stats?.request_count || null;
      default:
        return null;
    }
  };

  const getAxisLabel = (axis) => {
    switch(axis) {
      case 'latency': return 'Latency (ms)';
      case 'throughput': return 'Throughput (tok/s)';
      case 'prompt_price': return 'Input Price ($)';
      case 'completion_price': return 'Output Price ($)';
      case 'context_length': return 'Context Length';
      case 'request_count': return 'Request Count';
      default: return axis;
    }
  };

  // Filter models that have both x and y values
  const plotData = models
    .map(model => ({
      model,
      x: getAxisValue(model, xAxis),
      y: getAxisValue(model, yAxis)
    }))
    .filter(d => d.x !== null && d.y !== null && !isNaN(d.x) && !isNaN(d.y));

  if (plotData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No data available for the selected axes. Try loading stats first or selecting different metrics.</p>
      </div>
    );
  }

  const xValues = plotData.map(d => d.x);
  const yValues = plotData.map(d => d.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const padding = 80;
  const baseWidth = 1400;
  const baseHeight = 900;
  const width = baseWidth * zoomLevel;
  const height = baseHeight * zoomLevel;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const scaleX = (val) => padding + ((val - xMin) / (xMax - xMin)) * plotWidth;
  const scaleY = (val) => height - padding - ((val - yMin) / (yMax - yMin)) * plotHeight;

  const formatValue = (val, axis) => {
    if (axis.includes('price')) return `$${val.toFixed(6)}`;
    if (axis === 'latency') return `${val.toFixed(0)}ms`;
    if (axis === 'throughput') return `${val.toFixed(1)} tok/s`;
    if (axis === 'context_length') return val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : `${(val/1000).toFixed(0)}K`;
    if (axis === 'request_count') return val.toLocaleString();
    return val.toFixed(2);
  };

  const axisOptions = [
    { value: 'latency', label: 'Latency' },
    { value: 'throughput', label: 'Throughput' },
    { value: 'prompt_price', label: 'Input Price' },
    { value: 'completion_price', label: 'Output Price' },
    { value: 'context_length', label: 'Context Length' },
    { value: 'request_count', label: 'Request Count' }
  ];

  // Helper to get short model name (extract model name, not provider)
  const getShortName = (name) => {
    // Remove version suffix (e.g., ":20240229")
    const withoutVersion = name.split(':')[0];
    // Split by '/' and take last part (model name)
    const parts = withoutVersion.split('/');
    const modelName = parts[parts.length - 1];
    // Limit to first 4 parts if hyphenated
    const shortened = modelName.split('-').slice(0, 4).join('-');
    return shortened.length > 25 ? shortened.substring(0, 22) + '...' : shortened;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
          <select
            value={xAxis}
            onChange={(e) => onXAxisChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {axisOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
          <select
            value={yAxis}
            onChange={(e) => onYAxisChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {axisOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show Labels</span>
          </label>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              className="px-2 py-1 bg-white rounded hover:bg-gray-200 text-gray-700 font-bold"
              title="Zoom Out"
            >
              −
            </button>
            <span className="text-sm text-gray-700 min-w-[3rem] text-center">{(zoomLevel * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
              className="px-2 py-1 bg-white rounded hover:bg-gray-200 text-gray-700 font-bold"
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="relative" style={{ width: '100%', overflowX: 'auto' }}>
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Grid lines */}
          <g>
            {[0, 0.25, 0.5, 0.75, 1].map(t => {
              const x = padding + t * plotWidth;
              const y = height - padding - t * plotHeight;
              return (
                <g key={t}>
                  <line x1={x} y1={height - padding} x2={x} y2={padding} stroke="#e5e7eb" strokeWidth="1" />
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                </g>
              );
            })}
          </g>

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="2" />

          {/* Axis labels */}
          <text x={width / 2} y={height - 10} textAnchor="middle" className="text-sm fill-gray-700">{getAxisLabel(xAxis)}</text>
          <text x={20} y={height / 2} textAnchor="middle" transform={`rotate(-90, 20, ${height/2})`} className="text-sm fill-gray-700">{getAxisLabel(yAxis)}</text>

          {/* Tick labels */}
          {[0, 0.5, 1].map(t => {
            const xVal = xMin + t * (xMax - xMin);
            const yVal = yMin + t * (yMax - yMin);
            const x = padding + t * plotWidth;
            const y = height - padding - t * plotHeight;
            return (
              <g key={t}>
                <text x={x} y={height - padding + 20} textAnchor="middle" className="text-xs fill-gray-600">{formatValue(xVal, xAxis)}</text>
                <text x={padding - 10} y={y} textAnchor="end" className="text-xs fill-gray-600">{formatValue(yVal, yAxis)}</text>
              </g>
            );
          })}

          {/* Data points */}
          {plotData.map(({ model, x, y }) => {
            const cx = scaleX(x);
            const cy = scaleY(y);
            return (
              <g key={model.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill="#3b82f6"
                  stroke="#1e40af"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-700 transition-colors"
                  onMouseEnter={(e) => {
                    setHoveredModel(model);
                    // Store SVG coordinates instead of screen coordinates
                    setTooltipPos({ x: cx, y: cy });
                  }}
                  onMouseLeave={() => setHoveredModel(null)}
                />
                {showLabels && (
                  <text
                    x={cx + 10}
                    y={cy + 4}
                    className="text-xs fill-gray-700 pointer-events-none"
                    style={{ fontSize: '11px' }}
                  >
                    {getShortName(model.name)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Enhanced Tooltip - positioned relative to SVG */}
        {hoveredModel && (
          <div
            className="absolute bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm z-50 max-w-sm pointer-events-auto"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: 'translate(-50%, calc(-100% - 15px))'
            }}
          >
            <div className="font-bold mb-2 text-base flex items-center justify-between gap-2">
              <span>{hoveredModel.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(hoveredModel.id);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                title="Copy model ID"
              >
                <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
              </button>
            </div>
            <div className="text-xs space-y-1.5">
              <div className="grid grid-cols-2 gap-x-3">
                <span className="text-gray-400">ID:</span>
                <span className="text-gray-200 font-mono text-xs">{hoveredModel.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3">
                <span className="text-gray-400">{getAxisLabel(xAxis)}:</span>
                <span className="text-white font-semibold">{formatValue(getAxisValue(hoveredModel, xAxis), xAxis)}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3">
                <span className="text-gray-400">{getAxisLabel(yAxis)}:</span>
                <span className="text-white font-semibold">{formatValue(getAxisValue(hoveredModel, yAxis), yAxis)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-gray-700 space-y-1">
                <div className="grid grid-cols-2 gap-x-3">
                  <span className="text-gray-400">Input Price:</span>
                  <span className="text-green-400">{formatPrice(hoveredModel.pricing.prompt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3">
                  <span className="text-gray-400">Output Price:</span>
                  <span className="text-green-400">{formatPrice(hoveredModel.pricing.completion)}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3">
                  <span className="text-gray-400">Context:</span>
                  <span className="text-blue-400">{hoveredModel.context_length >= 1000000 ? `${(hoveredModel.context_length/1000000).toFixed(1)}M` : `${(hoveredModel.context_length/1000).toFixed(0)}K`}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {plotData.length} models with data for both axes
      </div>
    </div>
  );
};

const MappingView = ({ models, mapping, setMapping }) => {
  const [search, setSearch] = useState('');

  const modelOptions = useMemo(() => {
    const opts = models.map(m => ({ id: m.id, label: `${m.name} — ${m.id}` }));
    return opts.sort((a, b) => a.label.localeCompare(b.label));
  }, [models]);

  const filteredMapping = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mapping;
    return mapping.filter(item => {
      const alias = item.alias.toLowerCase();
      const target = item.targetId ? item.targetId.toLowerCase() : '';
      return alias.includes(q) || target.includes(q);
    });
  }, [mapping, search]);

  const handleChange = (alias, newId) => {
    setMapping(prev => prev.map(it => it.alias === alias ? { ...it, targetId: newId || null } : it));
  };

  const mappedCount = mapping.filter(it => !!it.targetId).length;

  const resetDefaults = () => setMapping(INITIAL_AA_MAPPING.map(x => ({ ...x })));
  const clearAll = () => setMapping(mapping.map(x => ({ ...x, targetId: null })));
  const exportJson = () => {
    const obj = {};
    mapping.forEach(it => { if (it.targetId) obj[it.alias] = it.targetId; });
    const text = JSON.stringify(obj, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `aa-mapping-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search aliases or IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{mappedCount} mapped</span>
          <button onClick={resetDefaults} className="px-3 py-2 border rounded hover:bg-gray-50">Reset to defaults</button>
          <button onClick={clearAll} className="px-3 py-2 border rounded hover:bg-gray-50">Clear all</button>
          <button onClick={exportJson} className="px-3 py-2 border rounded hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        This maps Set 1 aliases to OpenRouter models (Set 2). Changes auto-save to your browser.
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Set 1 Alias</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mapped Set 2 (OpenRouter ID)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certainty</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredMapping.map(item => (
              <tr key={item.alias}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{item.alias}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.targetId || ''}
                    onChange={(e) => handleChange(item.alias, e.target.value)}
                    className="w-full max-w-xl px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Not mapped / Unknown</option>
                    {modelOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ 
                    item.certainty === 'High' ? 'bg-green-100 text-green-800' :
                    item.certainty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.certainty || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ModelsDashboard />);
