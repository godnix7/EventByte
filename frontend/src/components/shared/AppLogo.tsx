import { appConfig } from '@/config/app.config';
import { Zap } from 'lucide-react';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export const AppLogo = ({ size = 'md', showText = true }: AppLogoProps) => {
    const sizes = { 
        sm: 'h-6 w-6', 
        md: 'h-9 w-9', 
        lg: 'h-16 w-16' 
    };
    
    const textSizes = { 
        sm: 'text-xs tracking-widest', 
        md: 'text-xl tracking-tight', 
        lg: 'text-4xl tracking-tighter' 
    };

    return (
        <div className="flex items-center gap-3 group/logo cursor-pointer select-none">
            <div className="relative flex items-center justify-center">
                {appConfig.logoUrl ? (
                    <div className={`${sizes[size]} rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1.5 transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:border-primary/50`}>
                        <img
                            src={appConfig.logoUrl}
                            alt={`${appConfig.name} logo`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div
                        className={`${sizes[size]} rounded-xl flex items-center justify-center bg-white text-black font-black transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3 shadow-xl`}
                    >
                        <Zap size={size === 'sm' ? 12 : size === 'md' ? 18 : 32} fill="currentColor" />
                    </div>
                )}
            </div>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className={`font-black uppercase ${textSizes[size]} text-white group-hover/logo:text-primary transition-colors duration-300`}>
                        {appConfig.name}
                    </span>
                    {size === 'lg' && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mt-1">
                            Event OS
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
