
import React, { useState, useCallback } from 'react';
import { TicketPreview } from './components/TicketPreview';
import { TicketForm } from './components/TicketForm';
import { TicketData, DEFAULT_TICKET } from './types';
import { analyzePoster } from './services/geminiService';
import { Ticket, Download, Sparkles, Loader2, Share2, X } from 'lucide-react';

// Add type definition for global html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

const App: React.FC = () => {
  const [ticketData, setTicketData] = useState<TicketData>(DEFAULT_TICKET);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Helper to convert file to base64 for API
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleMagicFill = useCallback(async (file: File) => {
    // Only attempt analysis if API Key is present
    if (!process.env.API_KEY) {
        console.warn("No API Key found for Magic Fill");
        return;
    }

    setIsAnalyzing(true);
    try {
      const base64 = await fileToBase64(file);
      const extractedData = await analyzePoster(base64, file.type);
      
      setTicketData(prev => ({
        ...prev,
        title: extractedData.title || prev.title,
        cinemaName: extractedData.cinemaName || prev.cinemaName,
        address: extractedData.address || prev.address,
        date: extractedData.date || prev.date,
        time: extractedData.time || prev.time,
        hall: extractedData.hall || prev.hall,
        hallType: extractedData.hallType || prev.hallType,
        language: extractedData.language || prev.language,
        seat: extractedData.seat || prev.seat,
        price: extractedData.price || prev.price,
        themeColor: extractedData.themeColor || prev.themeColor
      }));
    } catch (error) {
      console.error("Failed to magic fill:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleGenerateImage = async () => {
    if (!window.html2canvas) {
        console.error("html2canvas not loaded");
        return;
    }

    setIsGenerating(true);
    try {
        // We select the inner ID which has the full 375x667 resolution
        const element = document.getElementById('ticket-card');
        if (element) {
            const canvas = await window.html2canvas(element, {
                scale: 3, // Increased scale for sharpness
                backgroundColor: null,
                useCORS: true,
                logging: false,
                allowTaint: true, 
            });
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            setGeneratedImage(dataUrl);
        }
    } catch (error) {
        console.error("Failed to generate image:", error);
        alert("生成图片失败，请重试");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-600 p-2 rounded-lg">
                <Ticket className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">CineStub AI</h1>
                <p className="text-xs text-gray-400">智能电影票根生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="hidden md:flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-200 disabled:bg-gray-500 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
             >
                {isGenerating ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Download size={16} />
                )}
                <span>生成图片 (保存分享)</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 pb-32 lg:pb-8">
        
        {/* Left Column: Form */}
        <div className="w-full lg:w-1/3 order-2 lg:order-1 print:hidden h-auto lg:h-[calc(100vh-140px)] lg:sticky lg:top-28">
          <TicketForm 
            data={ticketData} 
            onChange={setTicketData} 
            onMagicFill={handleMagicFill}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="w-full lg:w-2/3 order-1 lg:order-2 flex items-start justify-center min-h-[500px] lg:min-h-0">
          <div className="sticky top-28 print:static">
             {/* Scaled down to 0.85 to save screen real estate */}
             <TicketPreview data={ticketData} scale={0.85} />
          </div>
        </div>
      </main>
      
      {/* Mobile Action Bar (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/90 backdrop-blur md:hidden z-30 border-t border-gray-800 flex justify-center">
         <button 
            onClick={handleGenerateImage}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-rose-600 text-white w-full py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
          >
            {isGenerating ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Share2 size={20} />
            )}
            <span>生成图片分享</span>
          </button>
      </div>

      {/* Image Result Modal */}
      {generatedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative max-w-md w-full bg-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-400" />
                        票根已生成
                    </h3>
                    <button 
                        onClick={() => setGeneratedImage(null)}
                        className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-gray-900">
                    <img 
                        src={generatedImage} 
                        alt="Generated Ticket" 
                        className="w-full h-auto rounded-lg shadow-2xl ring-1 ring-white/10"
                    />
                    <p className="mt-6 text-sm text-gray-400 text-center animate-pulse">
                        长按图片保存到手机<br/>
                        或发送给微信好友
                    </p>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 text-center">
                    <button 
                        onClick={() => setGeneratedImage(null)}
                        className="text-gray-400 text-sm hover:text-white"
                    >
                        关闭窗口
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;
