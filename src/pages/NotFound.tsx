import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center section-padding">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-8xl sm:text-9xl font-heading font-bold text-gradient mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Oops! Page not found.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Home size={18} />
          Go Home
        </motion.button>
      </div>
    </div>
  );
};

export default NotFound;
