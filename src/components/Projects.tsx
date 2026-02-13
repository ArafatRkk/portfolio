import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
}

const allTechs = ["All", "React", "Node.js", "MongoDB", "Express"];

const Projects = () => {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*").order("display_order") as { data: Project[] | null };
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter((p) => p.tech_stack.includes(filter));

  const getLink = (url: string | null) => {
    if (!url || url === "#") return "/404";
    return url;
  };

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">What I've built</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === tech
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "glass-card text-muted-foreground hover:text-primary"
              }`}
            >
              {tech}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass-card rounded-xl overflow-hidden hover-lift group"
            >
              <div className="h-44 bg-gradient-to-br from-muted to-card flex items-center justify-center relative overflow-hidden">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                    <Code2Icon className="text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
                  </>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary font-medium">{tech}</span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href={getLink(project.live_url)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                  <a href={getLink(project.github_url)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-all duration-300">
                    <Github size={14} /> GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Code2Icon = ({ className }: { className?: string }) => (
  <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
  </svg>
);

export default Projects;
