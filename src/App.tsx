import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Globe, 
  Printer, 
  Wallet, 
  Plane, 
  FileText, 
  Package,
  Send
} from 'lucide-react';

// --- НАСТРОЙКИ ---
const TELEGRAM_LINK = "https://t.me/ТВОЙ_НИК"; // <-- Впиши сюда свой ник
const TELEGRAM_LABEL = "@ТВОЙ_НИК";

// --- ТИПЫ ДАННЫХ ---
type Category = 'must' | 'optional';
type Language = 'ru' | 'en';

interface Task {
  id: string;
  textRu: string;
  textEn: string;
  cost: number;
  done: boolean;
  category: Category;
}

interface Phase {
  id: string;
  titleRu: string;
  titleEn: string;
  icon: React.ElementType;
  tasks: Task[];
}

// --- ПЕРЕВОДЫ ИНТЕРФЕЙСА ---
const UI = {
  ru: {
    title: "🇮🇹 Поездка в Италию",
    totalBudget: "Итоговый бюджет",
    print: "Сохранить в PDF",
    footer: "Создано с любовью для путешественников. Связь:",
    catMust: "Важно",
    catOpt: "Желательно",
    currency: "€"
  },
  en: {
    title: "🇮🇹 Italy Trip Roadmap",
    totalBudget: "Total Budget",
    print: "Save as PDF",
    footer: "Created with love for travelers. Contact:",
    catMust: "Must Have",
    catOpt: "Optional",
    currency: "€"
  }
};

// --- НАЧАЛЬНЫЕ ДАННЫЕ (Если LocalStorage пуст) ---
const INITIAL_DATA: Phase[] = [
  {
    id: 'docs',
    titleRu: 'Документы',
    titleEn: 'Documents',
    icon: FileText,
    tasks: [
      { id: '1', textRu: 'Загранпаспорт', textEn: 'International Passport', cost: 0, done: false, category: 'must' },
      { id: '2', textRu: 'Виза / Страховка', textEn: 'Visa / Insurance', cost: 50, done: false, category: 'must' },
    ]
  },
  {
    id: 'booking',
    titleRu: 'Бронь и Билеты',
    titleEn: 'Tickets & Booking',
    icon: Plane,
    tasks: [
      { id: '3', textRu: 'Купить авиабилеты', textEn: 'Buy flight tickets', cost: 200, done: false, category: 'must' },
      { id: '4', textRu: 'Забронировать отель', textEn: 'Book hotel', cost: 400, done: false, category: 'must' },
      { id: '5', textRu: 'Аренда авто', textEn: 'Rent a car', cost: 150, done: false, category: 'optional' },
    ]
  },
  {
    id: 'packing',
    titleRu: 'Сборы',
    titleEn: 'Packing',
    icon: Package,
    tasks: [
      { id: '6', textRu: 'Аптечка', textEn: 'First aid kit', cost: 20, done: false, category: 'must' },
      { id: '7', textRu: 'Переходник для розетки', textEn: 'Power adapter', cost: 10, done: false, category: 'optional' },
    ]
  }
];

export default function App() {
  // Состояние языка
  const [lang, setLang] = useState<Language>('ru');
  
  // Состояние данных (загружаем из памяти или берем начальные)
  const [phases, setPhases] = useState<Phase[]>(() => {
    const saved = localStorage.getItem('italyTripData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  // Сохраняем в память при каждом изменении
  useEffect(() => {
    localStorage.setItem('italyTripData', JSON.stringify(phases));
  }, [phases]);

  // --- ЛОГИКА ---

  const toggleTask = (phaseId: string, taskId: string) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map(task => 
          task.id === taskId ? { ...task, done: !task.done } : task
        )
      };
    }));
  };

  const updateCost = (phaseId: string, taskId: string, newCost: number) => {
    setPhases(prev => prev.map(phase => {
      if (phase.id !== phaseId) return phase;
      return {
        ...phase,
        tasks: phase.tasks.map(task => 
          task.id === taskId ? { ...task, cost: newCost } : task
        )
      };
    }));
  };

  const calculateTotal = () => {
    return phases.reduce((acc, phase) => {
      return acc + phase.tasks.reduce((sum, task) => sum + (task.cost || 0), 0);
    }, 0);
  };

  // Функция печати
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      
      {/* HEADER (Sticky) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang(l => l === 'ru' ? 'en' : 'ru')}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full text-sm font-medium transition"
            >
              <Globe size={16} />
              {lang === 'ru' ? 'RU' : 'EN'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{UI[lang].totalBudget}</span>
              <span className="font-bold text-lg text-emerald-600">
                {calculateTotal()} {UI[lang].currency}
              </span>
            </div>
            <button 
              onClick={handlePrint}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
              title={UI[lang].print}
            >
              <Printer size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{UI[lang].title}</h1>
        </div>

        {phases.map(phase => (
          <div key={phase.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 break-inside-avoid">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <phase.icon size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                {lang === 'ru' ? phase.titleRu : phase.titleEn}
              </h2>
            </div>

            <div className="space-y-3">
              {phase.tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${
                    task.done 
                      ? 'bg-slate-50 border-transparent opacity-60' 
                      : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <button 
                    onClick={() => toggleTask(phase.id, task.id)}
                    className={`flex-shrink-0 transition-colors ${task.done ? 'text-emerald-500' : 'text-slate-300 group-hover:text-blue-500'}`}
                  >
                    {task.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>

                  <div className="flex-grow min-w-0">
                    <p className={`font-medium truncate ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {lang === 'ru' ? task.textRu : task.textEn}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        task.category === 'must' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {task.category === 'must' ? UI[lang].catMust : UI[lang].catOpt}
                      </span>
                    </div>
                  </div>

                  {/* Поле цены */}
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 group-hover:border-slate-200">
                    <span className="text-slate-400 text-sm">{UI[lang].currency}</span>
                    <input 
                      type="number" 
                      value={task.cost} 
                      onChange={(e) => updateCost(phase.id, task.id, Number(e.target.value))}
                      className="w-16 bg-transparent text-right font-medium text-slate-700 outline-none text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 py-8 text-center text-slate-400 text-sm border-t border-slate-100 print:hidden">
        <p>{UI[lang].footer}</p>
        <a 
          href={TELEGRAM_LINK} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-blue-500 hover:text-blue-600 font-medium transition"
        >
          <Send size={14} />
          {TELEGRAM_LABEL}
        </a>
      </footer>
    </div>
  );
}