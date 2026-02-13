import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    // Simulate submission
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const inputClasses =
    "w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary glow-input transition-all duration-300";

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">Let's work together</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold">
            Get In <span className="text-gradient">Touch</span>
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-6 sm:p-10 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name *"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClasses}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email *"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject (optional)"
            value={formData.subject}
            onChange={handleChange}
            className={inputClasses}
          />
          <textarea
            name="message"
            placeholder="Your Message *"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className={`${inputClasses} resize-none`}
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover-lift hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Send size={18} />
            Send Message
          </button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-primary text-sm"
            >
              <CheckCircle size={16} /> Message sent successfully! I'll get back to you soon.
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive text-sm"
            >
              <AlertCircle size={16} /> Something went wrong. Please try again.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
