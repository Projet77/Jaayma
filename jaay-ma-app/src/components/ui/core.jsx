import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading,
    ...props
}) => {
    const variants = {
        primary: "bg-black text-white hover:bg-neutral-800 border border-transparent shadow-[0px_4px_16px_rgba(0,0,0,0.1)]",
        secondary: "bg-white text-black border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-black",
        outline: "bg-transparent border-2 border-current hover:bg-black hover:text-white hover:border-black",
        accent: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        relative overflow-hidden font-medium rounded-full transition-colors flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${isLoading ? 'opacity-70 cursor-wait' : ''}
        ${className}
      `}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </motion.button>
    );
};

export const Card = ({ children, className = '', hover = true, ...props }) => (
    <div
        className={`bg-white rounded-3xl border border-neutral-100 p-6 ${hover ? 'hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1' : ''} transition-all duration-500 ease-out ${className}`}
        {...props}
    >
        {children}
    </div>
);
