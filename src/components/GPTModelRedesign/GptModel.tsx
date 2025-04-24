import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, HelpCircle, Info, ArrowRight } from "lucide-react";

// Define model ID type to avoid string index errors
type ModelId =
  | "gpt4o"
  | "gpt45"
  | "o3"
  | "o4mini"
  | "o4minihigh"
  | "gpt4otasks";

// Define model interface
interface Model {
  name: string;
  badge: string;
  badgeColor: string;
  features: string[];
  speed: number; // 1-10 scale
  reasoning: number; // 1-10 scale
  creativity: number; // 1-10 scale
  technical: number; // 1-10 scale
  cost: number; // 1-10 scale
  description: string;
}

// Define task card interface
interface TaskCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  model: ModelId;
}

// Define tab interface
interface Tab {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

// Define a tooltip component
const Tooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="cursor-help"
      >
        {children}
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-64 p-3 text-sm bg-gray-700 text-gray-100 rounded-lg shadow-lg"
            style={{
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {content}
            <div
              className="absolute w-3 h-3 bg-gray-700 rotate-45"
              style={{ bottom: "-6px", left: "calc(50% - 6px)" }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Define a metric bar component
const MetricBar = ({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) => {
  const barWidth = `${value * 10}%`;

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-gray-300">{label}</span>
        <span className="text-xs font-medium text-gray-300">{value}/10</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: barWidth }}
        ></div>
      </div>
    </div>
  );
};

// Search functionality component
const ModelSearch = ({
  models,
  onSelect,
}: {
  models: Record<ModelId, Model>;
  onSelect: (id: ModelId) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ModelId[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      const filteredResults = Object.keys(models).filter((key) => {
        const model = models[key as ModelId];
        return (
          model.name.toLowerCase().includes(query.toLowerCase()) ||
          model.features.some((feature) =>
            feature.toLowerCase().includes(query.toLowerCase())
          )
        );
      }) as ModelId[];
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, models]);

  return (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#8e8ea0]" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-[#343541] rounded-lg bg-[#1e1e1e] text-[#ececf1] focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
          placeholder="Search models or capabilities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 bg-[#1e1e1e] rounded-lg border border-[#343541] shadow-md overflow-hidden"
          >
            {results.map((modelId) => (
              <div
                key={modelId}
                className="p-3 hover:bg-[#343541] cursor-pointer border-b border-[#343541] last:border-b-0"
                onClick={() => {
                  onSelect(modelId);
                  setQuery("");
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#ececf1]">
                      {models[modelId].name}
                    </p>
                    <p className="text-sm text-[#8e8ea0]">
                      {models[modelId].features[0]}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${models[modelId].badgeColor}`}
                  >
                    {models[modelId].badge}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// User persona selector
const PersonaSelector = ({
  onSelect,
}: {
  onSelect: (modelId: ModelId) => void;
}) => {
  const personas = [
    {
      name: "Student",
      description: "Working on assignments and research",
      modelId: "gpt4o" as ModelId,
      icon: "🎓",
    },
    {
      name: "Developer",
      description: "Coding assistance and technical help",
      modelId: "o4minihigh" as ModelId,
      icon: "💻",
    },
    {
      name: "Writer",
      description: "Creative content and editing",
      modelId: "gpt45" as ModelId,
      icon: "✍️",
    },
    {
      name: "Researcher",
      description: "Complex analysis and problem-solving",
      modelId: "o3" as ModelId,
      icon: "🔬",
    },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-md font-bold text-[#ececf1] mb-3">I am a...</h3>
      <div className="grid grid-cols-2 gap-3">
        {personas.map((persona) => (
          <motion.div
            key={persona.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#1e1e1e] p-4 rounded-xl border border-[#343541] shadow-sm cursor-pointer hover:border-[#10a37f] hover:shadow transition-all"
            onClick={() => onSelect(persona.modelId)}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{persona.icon}</div>
              <div>
                <h4 className="font-medium text-[#ececf1]">{persona.name}</h4>
                <p className="text-sm text-[#8e8ea0]">{persona.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function ChatGPTModelSelector() {
  const [activeTab, setActiveTab] = useState<string>("task");
  const [selectedModel, setSelectedModel] = useState<ModelId>("gpt4o");
  const [selectedModelsForComparison, setSelectedModelsForComparison] =
    useState<ModelId[]>(["gpt4o", "gpt45"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const tabs: Tab[] = [
    { id: "task", name: "By Task" },
    { id: "performance", name: "By Performance" },
    { id: "advanced", name: "Advanced Options" },
    { id: "compare", name: "Compare All" },
  ];

  // Updated model record with ChatGPT brand colors
  const models: Record<ModelId, Model> = {
    gpt4o: {
      name: "GPT-4o",
      badge: "STANDARD",
      badgeColor: "bg-emerald-100 text-emerald-700",
      features: [
        "General questions and conversations",
        "School homework and basic research",
        "Simple coding help",
        "Summarizing content",
      ],
      description:
        "Our standard model that balances capability and speed for everyday questions and tasks.",
      speed: 8,
      reasoning: 7,
      creativity: 7,
      technical: 6,
      cost: 3,
    },
    gpt45: {
      name: "GPT-4.5",
      badge: "RESEARCH PREVIEW",
      badgeColor: "bg-teal-100 text-teal-700",
      features: [
        "Creative writing and storytelling",
        "Brainstorming ideas",
        "Content drafting and editing",
        "Exploring complex concepts",
      ],
      description:
        "Our latest research model with advanced creative capabilities, ideal for writing and idea generation.",
      speed: 6,
      reasoning: 8,
      creativity: 9,
      technical: 7,
      cost: 6,
    },
    o3: {
      name: "o3",
      badge: "REASONING",
      badgeColor: "bg-emerald-100 text-emerald-700",
      features: [
        "Complex problem solving",
        "Deep analytical thinking",
        "Advanced scientific questions",
        "Multi-step reasoning tasks",
      ],
      description:
        "Optimized for complex reasoning and problem-solving with enhanced analytical capabilities.",
      speed: 5,
      reasoning: 10,
      creativity: 6,
      technical: 8,
      cost: 7,
    },
    o4mini: {
      name: "o4-mini",
      badge: "FAST",
      badgeColor: "bg-emerald-100 text-emerald-700",
      features: [
        "Quick complex calculations",
        "Faster reasoning for time-sensitive tasks",
        "Efficient analytical processing",
        "Rapid problem-solving",
      ],
      description:
        "A fast model that provides quick responses for time-sensitive analytical tasks.",
      speed: 10,
      reasoning: 6,
      creativity: 5,
      technical: 5,
      cost: 4,
    },
    o4minihigh: {
      name: "o4-mini-high",
      badge: "TECHNICAL",
      badgeColor: "bg-teal-100 text-teal-700",
      features: [
        "Advanced coding assistance",
        "Visual understanding tasks",
        "Technical documentation",
        "Code debugging and optimization",
      ],
      description:
        "Specialized for technical tasks, coding, and visual understanding with enhanced capabilities.",
      speed: 7,
      reasoning: 8,
      creativity: 6,
      technical: 10,
      cost: 6,
    },
    gpt4otasks: {
      name: "GPT-4o with scheduled tasks",
      badge: "BETA",
      badgeColor: "bg-indigo-100 text-indigo-700",
      features: [
        "Setting reminders for follow-ups",
        "Scheduling research tasks",
        "Recurring question answering",
        "Time-based assistance",
      ],
      description:
        "Our standard GPT-4o model with added ability to schedule tasks and reminders for later follow-up.",
      speed: 8,
      reasoning: 7,
      creativity: 7,
      technical: 6,
      cost: 5,
    },
  };

  // Updated task cards with ChatGPT brand colors
  const taskCards: TaskCard[] = [
    {
      id: "general",
      title: "General Chatting",
      description: "Day-to-day questions",
      icon: "💬",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      model: "gpt4o",
    },
    {
      id: "writing",
      title: "Writing & Ideas",
      description: "Content creation",
      icon: "✏️",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-700",
      model: "gpt45",
    },
    {
      id: "coding",
      title: "Coding & Visuals",
      description: "Technical tasks",
      icon: "💻",
      iconBg: "bg-teal-50",
      iconColor: "text-teal-700",
      model: "o4minihigh",
    },
    {
      id: "reasoning",
      title: "Deep Reasoning",
      description: "Complex problems",
      icon: "🔍",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      model: "o3",
    },
    {
      id: "fast",
      title: "Fast Reasoning",
      description: "Quick complex tasks",
      icon: "⚡",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
      model: "o4mini",
    },
    {
      id: "scheduled",
      title: "Scheduled Tasks",
      description: "Follow-ups later",
      icon: "🔔",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-700",
      model: "gpt4otasks",
    },
  ];

  const handleSelect = (modelId: ModelId): void => {
    setSelectedModel(modelId);
  };

  const toggleModelForComparison = (modelId: ModelId): void => {
    setSelectedModelsForComparison((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else {
        if (prev.length < 3) {
          return [...prev, modelId];
        }
        return prev;
      }
    });
  };

  const PerformanceTab = () => {
    const [sortBy, setSortBy] =
      useState<
        keyof Pick<
          Model,
          "speed" | "reasoning" | "creativity" | "technical" | "cost"
        >
      >("reasoning");

    const sortedModelIds = Object.keys(models).sort((a, b) => {
      return models[b as ModelId][sortBy] - models[a as ModelId][sortBy];
    }) as ModelId[];

    return (
      <div className="">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#ececf1] mb-3">
            Sort models by:
          </h2>
          <div className="flex flex-wrap gap-2">
            {["speed", "reasoning", "creativity", "technical", "cost"].map(
              (metric) => (
                <button
                  key={metric}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === metric
                      ? "bg-[#10a37f] text-white"
                      : "bg-[#2a2a2a] text-[#8e8ea0] hover:bg-[#343541] hover:text-[#ececf1]"
                  }`}
                  onClick={() => setSortBy(metric as any)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          {sortedModelIds.map((modelId) => (
            <motion.div
              key={modelId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedModel === modelId
                  ? "border-[#10a37f] bg-[#1e1e1e] shadow-md"
                  : "border-[#343541] bg-[#1e1e1e] hover:border-[#565869]"
              }`}
              onClick={() => handleSelect(modelId)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/3">
                  <h3 className="text-lg font-bold text-[#ececf1]">
                    {models[modelId].name}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${models[modelId].badgeColor}`}
                  >
                    {models[modelId].badge}
                  </span>
                  <p className="text-sm text-[#8e8ea0] mt-2">
                    {models[modelId].description}
                  </p>
                </div>

                <div className="md:w-2/3">
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        Speed
                      </span>
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        {models[modelId].speed}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].speed * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        Reasoning
                      </span>
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        {models[modelId].reasoning}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].reasoning * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        Creativity
                      </span>
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        {models[modelId].creativity}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].creativity * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        Technical Capability
                      </span>
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        {models[modelId].technical}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].technical * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        Cost
                      </span>
                      <span className="text-xs font-medium text-[#8e8ea0]">
                        {models[modelId].cost}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].cost * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#10a37f] hover:bg-[#0e8a6c] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModel(modelId);
                    setIsModalOpen(true);
                  }}
                >
                  Select this model <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const CompareTab = () => {
    return (
      <div className="">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#ececf1] mb-2">
            Compare Models
          </h2>
          <p className="text-[#8e8ea0] text-sm">
            Select up to 3 models to compare side-by-side
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(models).map((modelId) => (
            <button
              key={modelId}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedModelsForComparison.includes(modelId as ModelId)
                  ? "bg-[#10a37f] text-white"
                  : "bg-[#2a2a2a] text-[#8e8ea0] hover:bg-[#343541] hover:text-[#ececf1]"
              }`}
              onClick={() => toggleModelForComparison(modelId as ModelId)}
            >
              {models[modelId as ModelId].name}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b-2 border-[#343541] text-[#ececf1]">
                  Feature
                </th>
                {selectedModelsForComparison.map((modelId) => (
                  <th
                    key={modelId}
                    className="text-left p-3 border-b-2 border-[#343541] text-[#ececf1]"
                  >
                    <div>
                      <span className="font-bold">{models[modelId].name}</span>
                      <span
                        className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs ${models[modelId].badgeColor}`}
                      >
                        {models[modelId].badge}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Description
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-desc`}
                    className="p-3 border-b border-[#343541] text-sm text-[#8e8ea0]"
                  >
                    {models[modelId].description}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Speed
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-speed`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].speed * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#8e8ea0] mt-1">
                      {models[modelId].speed}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Reasoning
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-reasoning`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].reasoning * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#8e8ea0] mt-1">
                      {models[modelId].reasoning}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Creativity
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-creativity`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].creativity * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#8e8ea0] mt-1">
                      {models[modelId].creativity}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Technical
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-technical`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].technical * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#8e8ea0] mt-1">
                      {models[modelId].technical}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Cost
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-cost`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#10a37f]"
                        style={{ width: `${models[modelId].cost * 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#8e8ea0] mt-1">
                      {models[modelId].cost}/10
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 border-b border-[#343541] font-medium text-[#ececf1]">
                  Best for
                </td>
                {selectedModelsForComparison.map((modelId) => (
                  <td
                    key={`${modelId}-features`}
                    className="p-3 border-b border-[#343541]"
                  >
                    <ul className="list-disc list-inside space-y-1">
                      {models[modelId].features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-[#8e8ea0]">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3"></td>
                {selectedModelsForComparison.map((modelId) => (
                  <td key={`${modelId}-select`} className="p-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#10a37f] hover:bg-[#0e8a6c] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => {
                        setSelectedModel(modelId);
                        setIsModalOpen(true);
                      }}
                    >
                      Select
                    </motion.button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const AdvancedTab = () => {
    return (
      <div className="">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#ececf1] mb-2">
            Advanced Model Selection
          </h2>
          <p className="text-[#8e8ea0] text-sm">
            Search by specific features or explore models with detailed
            information
          </p>
        </div>

        <ModelSearch models={models} onSelect={handleSelect} />

        <div className="bg-[#1e1e1e] p-4 rounded-lg border border-[#343541] mb-6">
          <h3 className="font-bold text-[#ececf1] mb-2 flex items-center">
            What makes each model special
            <Tooltip content="Understanding these differences helps you pick the right model for your specific needs.">
              <HelpCircle className="h-4 w-4 ml-1 text-[#8e8ea0]" />
            </Tooltip>
          </h3>
          <p className="text-sm text-[#8e8ea0] mb-3">
            Each model has different strengths:
          </p>
          <ul className="space-y-2 text-sm text-[#8e8ea0]">
            <li className="flex items-start">
              <span className="bg-[#0e1e2f] text-[#56c3c5] h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                S
              </span>
              <span>
                <strong className="text-[#ececf1]">Standard models</strong> like
                GPT-4o are balanced for everyday tasks
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-[#17181e] text-[#10a37f] h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                R
              </span>
              <span>
                <strong className="text-[#ececf1]">Reasoning models</strong>{" "}
                like o3 excel at complex problem-solving and analysis
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-[#0e1e2f] text-[#56c3c5] h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                T
              </span>
              <span>
                <strong className="text-[#ececf1]">Technical models</strong>{" "}
                like o4-mini-high are optimized for coding and technical tasks
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-[#17181e] text-[#10a37f] h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                F
              </span>
              <span>
                <strong className="text-[#ececf1]">Fast models</strong> like
                o4-mini prioritize speed for quick responses
              </span>
            </li>
          </ul>
        </div>

        <PersonaSelector onSelect={handleSelect} />

        {selectedModel && (
          <div className="mt-6 p-5 bg-[#1e1e1e] rounded-xl border border-[#343541]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-[#ececf1]">
                  Your selected model:
                </h3>
                <p className="text-[#10a37f] font-medium">
                  {models[selectedModel].name}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#10a37f] hover:bg-[#0e8a6c] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Use this model
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Success Modal
  const SuccessModal = () => (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#1e1e1e] rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="bg-green-900 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#ececf1] mb-2">
                Model Selected Successfully!
              </h3>
              <p className="text-[#ececf1] mb-4">
                You've selected{" "}
                <span className="font-medium">
                  {models[selectedModel].name}
                </span>
                . Your conversations will now use this model.
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#10a37f] hover:bg-[#0e8a6c] text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#0f0f0f] rounded-2xl p-6 mx-auto font-sans shadow-2xl border border-gray-800">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1e1e1e] rounded-xl p-5 text-[#ececf1] mb-6"
        >
          <h1 className="text-2xl font-bold">Choose your ChatGPT model</h1>
          <p className="text-[#8e8ea0] text-sm">
            Select the model that best fits your current needs
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#1e1e1e] rounded-lg flex mb-6 gap-4 overflow-x-auto"
          role="tablist"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              className={`flex-1 py-3 px-4 text-center rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? " text-[#ececf1] font-medium bg-[#2a2a2a]"
                  : "text-[#8e8ea0] hover:text-[#ececf1] hover:bg-[#2a2a2a]"
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{
                backgroundColor: activeTab === tab.id ? undefined : "#2a2a2a",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "task" && (
              <div id="task-panel" role="tabpanel" aria-labelledby="task-tab">
                <h2 className="text-lg font-bold text-[#ececf1] mb-4 flex items-center">
                  What do you want to do today?
                  <Tooltip content="Select the task that best matches what you're trying to accomplish. Each task is matched with the most appropriate model.">
                    <div className="ml-2 text-[#8e8ea0] cursor-help">
                      <HelpCircle size={16} />
                    </div>
                  </Tooltip>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {taskCards.map((card) => (
                    <div
                      key={card.id}
                      className={`bg-[#1e1e1e] rounded-xl p-4 border-2 transition-all cursor-pointer ${
                        selectedModel === card.model
                          ? "border-[#10a37f] shadow-md"
                          : "border-[#343541] hover:border-[#565869]"
                      }`}
                      onClick={() => handleSelect(card.model)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelect(card.model);
                        }
                      }}
                      tabIndex={0}
                      role="radio"
                      aria-checked={selectedModel === card.model}
                    >
                      <div className="flex items-start">
                        <div
                          className={`${card.iconBg} h-12 w-12 rounded-full flex items-center justify-center ${card.iconColor} text-2xl mr-3`}
                        >
                          {card.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#ececf1]">
                            {card.title}
                          </h3>
                          <p className="text-sm text-[#8e8ea0]">
                            {card.description}
                          </p>
                          <p
                            className={`text-sm font-medium mt-1 ${card.iconColor}`}
                          >
                            {models[card.model].name}
                          </p>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border-2 border-[#565869] flex items-center justify-center ${
                            selectedModel === card.model ? "bg-[#1e1e1e]" : ""
                          }`}
                        >
                          {selectedModel === card.model && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-3 w-3 rounded-full bg-[#10a37f]"
                            ></motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Model Information */}
                {selectedModel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1e1e1e] rounded-xl p-6 border-2 border-[#343541]"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#ececf1] flex items-center">
                          {models[selectedModel].name}
                          <Tooltip content={models[selectedModel].description}>
                            <Info className="h-4 w-4 ml-2 text-[#8e8ea0]" />
                          </Tooltip>
                        </h2>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${models[selectedModel].badgeColor}`}
                        >
                          {models[selectedModel].badge}
                        </span>

                        <div className="mt-4">
                          <h3 className="font-bold text-[#ececf1] mb-2">
                            Good for:
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                            {models[selectedModel].features.map(
                              (feature, index) => (
                                <motion.p
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  key={`feature-${index}`}
                                  className="text-sm text-[#8e8ea0] flex items-center"
                                >
                                  <span className="h-2 w-2 bg-[#10a37f] rounded-full mr-2"></span>
                                  {feature}
                                </motion.p>
                              )
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-[#8e8ea0]">
                                Speed
                              </span>
                              <span className="text-xs font-medium text-[#8e8ea0]">
                                {models[selectedModel].speed}/10
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${models[selectedModel].speed * 10}%`,
                                }}
                                className="h-full rounded-full bg-[#10a37f]"
                              ></motion.div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-[#8e8ea0]">
                                Technical
                              </span>
                              <span className="text-xs font-medium text-[#8e8ea0]">
                                {models[selectedModel].technical}/10
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#343541] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${
                                    models[selectedModel].technical * 10
                                  }%`,
                                }}
                                className="h-full rounded-full bg-[#10a37f]"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="bg-[#10a37f] hover:bg-[#0e8a6c] text-white font-medium py-3 px-6 rounded-lg h-12 self-start md:self-end mt-4 md:mt-0 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Apply Selection
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "performance" && (
              <div
                id="performance-panel"
                role="tabpanel"
                aria-labelledby="performance-tab"
              >
                <PerformanceTab />
              </div>
            )}
            {activeTab === "advanced" && (
              <div
                id="advanced-panel"
                role="tabpanel"
                aria-labelledby="advanced-tab"
              >
                <AdvancedTab />
              </div>
            )}
            {activeTab === "compare" && (
              <div
                id="compare-panel"
                role="tabpanel"
                aria-labelledby="compare-tab"
              >
                <CompareTab />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <SuccessModal />
      </div>
    </div>
  );
}