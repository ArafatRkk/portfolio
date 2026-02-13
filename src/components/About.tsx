import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Database, Globe, Server, GitBranch, Palette, Terminal, Layers } from "lucide-react";
import arafatPhoto from "@/assets/arafat-photo.jpg";

const skills = [
  { name: "JavaScript", icon: Code2 },
  { name: "React.js", icon: Globe },
  { name: "Node.js", icon: Server },
  { name: "Express.js", icon: Terminal },
  { name: "MongoDB", icon: Database },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Git", icon: GitBranch },
  { name: "REST APIs", icon: Layers },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">Get to know me</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold">
            About <span className="text-gradient">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl glass-card overflow-hidden">
                <img src={arafatPhoto} alt="Arafat Amin" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 -z-10 blur-sm" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm a passionate Full Stack MERN Developer with a deep love for building robust, scalable, and user-friendly web applications. With expertise across the entire JavaScript ecosystem — from crafting pixel-perfect React interfaces to designing efficient Node.js backends and MongoDB data architectures — I deliver complete solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I thrive on solving complex problems and continuously learning new technologies. My goal is to create digital experiences that are not only functional but also elegant and performant. Every line of code I write is with the end-user in mind.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 glass-card rounded-full text-sm text-primary font-medium">Problem Solver</span>
              <span className="px-4 py-1.5 glass-card rounded-full text-sm text-primary font-medium">Clean Code Advocate</span>
              <span className="px-4 py-1.5 glass-card rounded-full text-sm text-primary font-medium">Continuous Learner</span>
            </div>
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="text-xl font-heading font-semibold text-center mb-10">
            My <span className="text-gradient">Tech Stack</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="glass-card rounded-xl p-5 text-center hover-lift cursor-default group"
              >
                <skill.icon className="w-8 h-8 mx-auto mb-3 text-primary group-hover:text-secondary transition-colors duration-300" />
                <p className="text-sm font-medium text-foreground">{skill.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
