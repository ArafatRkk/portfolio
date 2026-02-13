import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviewsData = [
  {
    clientName: "Mortgage Broker Client",
    quote: "Arafat built a stunning, high-converting website for our mortgage brokerage. The site is fast, professional, and our lead generation has increased significantly since launch. Exceptional work!",
    rating: 5,
  },
  {
    clientName: "BBM Agency",
    quote: "Arafat delivered a polished, modern website for our agency that perfectly captures our brand identity. His technical expertise and creative vision made the entire process seamless. Highly recommended!",
    rating: 5,
  },
];

const Reviews = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviewsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prev = () => setCurrent((c) => (c - 1 + reviewsData.length) % reviewsData.length);
  const next = () => setCurrent((c) => (c + 1) % reviewsData.length);

  return (
    <section id="reviews" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">What clients say</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold">
            Client <span className="text-gradient">Reviews</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="glass-card rounded-2xl p-8 sm:p-12 text-center min-h-[280px] flex flex-col items-center justify-center">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < reviewsData[current].rating ? "text-primary fill-primary" : "text-muted-foreground"
                  } transition-colors duration-300`}
                />
              ))}
            </div>

            <motion.p
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-lg sm:text-xl text-foreground/90 italic leading-relaxed mb-6 max-w-2xl"
            >
              "{reviewsData[current].quote}"
            </motion.p>

            <motion.p
              key={`name-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-primary font-semibold"
            >
              — {reviewsData[current].clientName}
            </motion.p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="p-2 glass-card rounded-full text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {reviewsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2 glass-card rounded-full text-muted-foreground hover:text-primary transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
