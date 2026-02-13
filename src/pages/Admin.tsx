import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { LogIn, LogOut, Plus, Trash2, Mail, X, Upload } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_url: string;
  github_url: string;
  display_order: number;
  image_url: string | null;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [tab, setTab] = useState<"projects" | "messages">("projects");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: "", description: "", tech_stack: "", live_url: "", github_url: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchProjects();
      fetchMessages();
    }
  }, [session]);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order") as { data: Project[] | null };
    if (data) setProjects(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }) as { data: ContactMessage[] | null };
    if (data) setMessages(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(fileName, file);
    if (error) return null;
    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    const techArray = newProject.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("projects").insert({
      title: newProject.title,
      description: newProject.description,
      tech_stack: techArray,
      live_url: newProject.live_url || null,
      github_url: newProject.github_url || null,
      image_url: imageUrl,
      display_order: projects.length + 1,
    } as any);
    if (!error) {
      setShowForm(false);
      setNewProject({ title: "", description: "", tech_stack: "", live_url: "", github_url: "" });
      setImageFile(null);
      setImagePreview(null);
      fetchProjects();
    }
    setUploading(false);
  };

  const handleDeleteProject = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const handleDeleteMessage = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    fetchMessages();
  };

  const inputClass = "w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all duration-300";

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2 text-center">Admin Login</h1>
          <p className="text-muted-foreground text-sm text-center mb-6">Sign in to manage your portfolio</p>
          {authError && <p className="text-destructive text-sm mb-4 text-center">{authError}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <LogIn size={18} /> Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-heading font-bold text-foreground">Admin Panel</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {(["projects", "messages"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tab === t ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-primary"}`}>
              {t === "projects" ? "Projects" : "Messages"}
            </button>
          ))}
        </div>

        {tab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-foreground">Featured Projects ({projects.length})</h2>
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/20 transition-all">
                {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Cancel" : "Add Project"}
              </button>
            </div>

            {showForm && (
              <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleAddProject} className="glass-card rounded-xl p-6 mb-6 space-y-4">
                <input placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} required className={inputClass} />
                <textarea placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} required className={`${inputClass} resize-none`} rows={3} />
                <input placeholder="Tech Stack (comma separated)" value={newProject.tech_stack} onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })} required className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="Live URL (optional)" value={newProject.live_url} onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })} className={inputClass} />
                  <input placeholder="GitHub URL (optional)" value={newProject.github_url} onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })} className={inputClass} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Project Image (optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary transition-all cursor-pointer">
                      <Upload size={16} /> Choose Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="h-16 w-24 object-cover rounded-lg border border-border" />
                        <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={uploading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50">
                  {uploading ? "Saving..." : "Save Project"}
                </button>
              </motion.form>
            )}

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="glass-card rounded-xl p-5 flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.title} className="h-16 w-24 object-cover rounded-lg border border-border flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.tech_stack.map((t) => (
                          <span key={t} className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Contact Messages ({messages.length})</h2>
            <div className="space-y-3">
              {messages.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="glass-card rounded-xl p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{m.name}</h3>
                      <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-primary flex items-center gap-1"><Mail size={12} /> {m.email}</p>
                    {m.subject && <p className="text-sm text-muted-foreground mt-1">Subject: {m.subject}</p>}
                    <p className="text-sm text-foreground/80 mt-2">{m.message}</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(m.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
