
import React, { useRef } from 'react';
import { TicketData, TEMPLATES } from '../types';
import { Upload, Sparkles, X, Check } from 'lucide-react';

interface TicketFormProps {
  data: TicketData;
  onChange: (data: TicketData) => void;
  onMagicFill: (file: File) => void;
  isAnalyzing: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({ 
  data, 
  onChange, 
  onMagicFill,
  isAnalyzing 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleTemplateChange = (id: string) => {
    onChange({ ...data, templateId: id });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...data, posterUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
      
      // Trigger Magic Fill suggestion
      onMagicFill(file);
    }
  };

  const clearPoster = () => {
      onChange({ ...data, posterUrl: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 h-full overflow-y-auto font-sans custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            票根信息
          </h2>
          {isAnalyzing && (
              <span className="text-xs font-mono text-yellow-400 animate-pulse flex items-center gap-1">
                  <Sparkles size={12}/> AI 识别中...
              </span>
          )}
      </div>

      <div className="space-y-6">
        {/* Template Selection */}
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                选择模板 (Template)
            </label>
            <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => handleTemplateChange(t.id)}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-[3/4] group ${
                            data.templateId === t.id 
                            ? 'border-rose-500 ring-2 ring-rose-500/30' 
                            : 'border-transparent hover:border-gray-500'
                        }`}
                        title={t.name}
                    >
                        {/* Thumbnail Image */}
                        <img 
                            src={t.imageUrl} 
                            alt={t.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        
                        {/* Selected Indicator */}
                        {data.templateId === t.id && (
                            <div className="absolute inset-0 bg-rose-500/20 z-10 flex items-center justify-center">
                                <div className="bg-rose-500 rounded-full p-1 shadow-lg">
                                    <Check size={16} className="text-white" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* File Upload */}
        <div className="relative group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                电影海报 (上传自动识别)
            </label>
            <div 
                className={`relative border-2 border-dashed rounded-lg p-4 transition-colors text-center cursor-pointer 
                ${data.posterUrl ? 'border-green-500/50 bg-green-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'}`}
                onClick={() => !data.posterUrl && fileInputRef.current?.click()}
            >
                {data.posterUrl ? (
                    <div className="relative">
                        <img src={data.posterUrl} alt="Preview" className="h-32 mx-auto rounded shadow-md object-contain" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); clearPoster(); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="py-6">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-400">点击上传海报图片</span>
                        <p className="text-xs text-gray-500 mt-1">AI 自动提取电影信息</p>
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">电影名称 (Movie Title)</label>
                <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                    placeholder="例如：我不是药神"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">影院名称 (Cinema)</label>
                <input
                    type="text"
                    name="cinemaName"
                    value={data.cinemaName}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="例如：万达影城"
                />
            </div>

            {/* Grid for Date/Time/Seat */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">日期 (Date)</label>
                    <input
                        type="date"
                        name="date"
                        value={data.date}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">时间 (Time)</label>
                    <input
                        type="time"
                        name="time"
                        value={data.time}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">影厅 (Hall)</label>
                    <input
                        type="text"
                        name="hall"
                        value={data.hall}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="1号厅"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">座位 (Seat)</label>
                    <input
                        type="text"
                        name="seat"
                        value={data.seat}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="4排04座"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">语言 (Language)</label>
                    <input
                        type="text"
                        name="language"
                        value={data.language}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="国语"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2">版本 (Type)</label>
                    <input
                        type="text"
                        name="hallType"
                        value={data.hallType}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="2D"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-400 mb-2">专属人 (Owner)</label>
                    <input
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                        placeholder="例如：醉の晓"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};