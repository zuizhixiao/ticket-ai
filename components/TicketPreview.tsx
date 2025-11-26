
import React, { useRef } from 'react';
import { TicketData, TEMPLATES } from '../types';
import { Film, Wheat } from 'lucide-react';

interface TicketPreviewProps {
  data: TicketData;
  scale?: number;
}

export const TicketPreview: React.FC<TicketPreviewProps> = ({ data, scale = 1 }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  
  // Get template definition (for background image only)
  // Use data.templateId directly to access the static TEMPLATES array
  const templateDef = TEMPLATES.find(t => t.id === data.templateId) || TEMPLATES[0];

  // Original dimensions of the card
  const originalWidth = 375;
  const originalHeight = 667;

  // Use the imageUrl from the template definition
  const containerStyle = {
    backgroundImage: `url('${templateDef.imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div 
      className="relative"
      style={{ 
        width: originalWidth * scale, 
        height: originalHeight * scale,
      }}
    >
      <div 
        style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left',
            width: originalWidth,
            height: originalHeight,
        }}
      >
        {/* Ticket Container - Vertical Card */}
        {/* Added id="ticket-card" for html2canvas capture */}
        <div 
            ref={ticketRef}
            id="ticket-card"
            className="relative flex flex-col w-[375px] h-[667px] rounded-3xl shadow-2xl overflow-hidden selection:bg-none font-sans"
            style={containerStyle}
        >
            {/* Top Section: Poster */}
            {/* Padding container for the poster */}
            <div className="p-5 pb-0 h-[62%] w-full flex-shrink-0 relative z-10">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative bg-gray-900">
                    {data.posterUrl ? (
                        <img 
                            src={data.posterUrl} 
                            alt="Poster" 
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous" 
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <Film size={48} />
                            <span className="text-sm mt-2">无海报</span>
                        </div>
                    )}
                    {/* Subtle shine on poster */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 pointer-events-none"></div>
                </div>
            </div>

            {/* Divider Line (Dotted) */}
            <div className="px-6 py-4 flex items-center justify-center opacity-80 relative z-10">
                <div className="w-full border-t-2 border-dashed border-white/30"></div>
            </div>

            {/* Bottom Section: Info */}
            <div className="flex-1 px-8 pb-8 flex flex-col relative z-10">
                
                {/* Title - Changed tracking-tight to tracking-normal to fix image generation spacing issues */}
                <h1 className="text-3xl font-bold mb-5 tracking-normal line-clamp-2 leading-tight drop-shadow-sm text-white">
                    {data.title || "电影名称"}
                </h1>

                {/* Metadata Block */}
                <div className="space-y-2.5 text-sm md:text-base font-medium tracking-wide text-blue-50">
                    {/* Line 1: Language Type | Cinema */}
                    <div className="flex items-center gap-2">
                        <span>{data.language || "国语"}</span>
                        <span>{data.hallType || "2D"}</span>
                        <span className="opacity-40">|</span>
                        <span className="truncate max-w-[160px]">{data.cinemaName || "影城名称"}</span>
                    </div>

                    {/* Line 2: Hall Seat */}
                    <div className="flex items-center gap-3 text-lg">
                        <span>{data.hall}</span>
                        <span className="font-bold">{data.seat}</span>
                    </div>

                    {/* Line 3: Date Time */}
                    <div className="flex items-center gap-2 text-blue-100/80 opacity-90">
                        <span>{data.date?.replace(/-/g, '/')}</span>
                        <span className="font-bold">{data.time}</span>
                    </div>
                </div>

                {/* Footer / Signature */}
                <div className="mt-auto pt-6 flex items-center justify-center gap-3 opacity-60">
                    <Wheat size={24} className="text-white/60 rotate-[-30deg]" />
                    <span className="text-sm font-medium tracking-widest text-blue-200/80">
                        @{data.username || "用户名"} 专属
                    </span>
                    <Wheat size={24} className="text-white/60 rotate-[30deg] transform scale-x-[-1]" />
                </div>
            </div>

            {/* Decorative Watermark Stamp */}
            <div className="absolute bottom-24 right-4 opacity-50 pointer-events-none mix-blend-overlay">
                <div className="w-28 h-28 rounded-full border-4 border-white/30 flex items-center justify-center transform -rotate-12">
                    <div className="w-24 h-24 rounded-full border-2 border-white/30 flex flex-col items-center justify-center p-2 text-center text-white/80">
                        <span className="text-[8px] uppercase tracking-[0.2em] opacity-80 curve-text">Souvenir Ticket</span>
                        <span className="text-xl font-black my-1">CINE<br/>VIP</span>
                        <span className="text-[8px] uppercase tracking-widest opacity-80">COLLECTION</span>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};
