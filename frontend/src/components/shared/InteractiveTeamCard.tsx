import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Shield, Mail, Github, Twitter } from 'lucide-react';

interface TeamMemberProps {
    name: string;
    role: string;
    image?: string;
    initials?: string;
    email?: string;
    color?: string;
    socials?: {
        github?: string;
        twitter?: string;
    };
}

export const InteractiveTeamCard = ({ name, role, image, initials, email, color = '#A855F7', socials }: TeamMemberProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width - 0.5);
        const yPct = (mouseY / height - 0.5);

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className="group relative h-[400px] w-full max-w-[320px] rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-white/10 p-1 flex flex-col items-center justify-center transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_50px_-12px_rgba(var(--primary)/0.5)] overflow-hidden"
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20" />
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-[80px] bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500" />

            <div 
                style={{ transform: 'translateZ(75px)' }}
                className="relative z-30 flex flex-col items-center text-center p-6 w-full"
            >
                {/* Avatar */}
                <div className="relative mb-8 pt-4">
                    <div 
                        className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 overflow-hidden"
                        style={{ boxShadow: `0 20px 40px -10px ${color}40` }}
                    >
                        {image ? (
                            <img src={image} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-primary">{initials || name[0]}</span>
                        )}
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-3 -right-3 p-2 bg-background border border-white/10 rounded-xl shadow-xl group-hover:rotate-12 transition-transform duration-500">
                        <Shield className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight mb-2 text-glow">{name}</h3>
                <p 
                    className="text-[10px] uppercase tracking-[0.3em] font-black mb-6 px-4 py-1 rounded-full border border-white/5 bg-white/5 text-muted-foreground group-hover:text-primary transition-colors"
                >
                    {role}
                </p>

                {/* Info & Socials */}
                <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {email && (
                        <a href={`mailto:${email}`} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                            <Mail size={18} />
                        </a>
                    )}
                    {socials?.github && (
                        <a href={socials.github} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                            <Github size={18} />
                        </a>
                    )}
                    {socials?.twitter && (
                        <a href={socials.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                            <Twitter size={18} />
                        </a>
                    )}
                </div>
            </div>

            {/* Bottom Glow Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:via-primary transition-all duration-700" />
        </motion.div>
    );
};
