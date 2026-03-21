import { appConfig } from '@/config/app.config';

interface AppLogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export const AppLogo = ({ size = 'md', showText = true }: AppLogoProps) => {
    const sizes = { sm: 'h-6 w-6 text-xs', md: 'h-8 w-8 text-sm', lg: 'h-16 w-16 text-2xl' };
    const textSizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-4xl' };

    return (
        <div className="flex items-center gap-3">
            {appConfig.logoUrl ? (
                <img
                    src={appConfig.logoUrl}
                    alt={`${appConfig.name} logo`}
                    className={sizes[size]}
                />
            ) : (
                <div
                    className={`${sizes[size]} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}
                    style={{ backgroundColor: appConfig.primaryColor }}
                >
                    {appConfig.name.charAt(0)}
                </div>
            )}
            {showText && (
                <span className={`font-bold tracking-tight ${textSizes[size]}`} style={{ color: appConfig.primaryColor }}>
                    {appConfig.name}
                </span>
            )}
        </div>
    );
};
