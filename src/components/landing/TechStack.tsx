"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

const techStack = [
  {
    category: "Frontend",
    technologies: [
      { name: "Next.js 16", description: "React framework with App Router" },
      { name: "TypeScript", description: "Type-safe development" },
      { name: "Tailwind CSS", description: "Utility-first styling" },
      { name: "shadcn/ui", description: "Beautiful components" },
      { name: "Framer Motion", description: "Smooth animations" },
    ],
  },
  {
    category: "Backend",
    technologies: [
      { name: "Supabase", description: "PostgreSQL database & Auth" },
      { name: "Drizzle ORM", description: "Type-safe database queries" },
      { name: "Edge Functions", description: "Serverless API routes" },
    ],
  },
  {
    category: "Payments",
    technologies: [
      { name: "Stripe", description: "Payment processing" },
      { name: "LemonSqueezy", description: "Alternative payment provider" },
    ],
  },
  {
    category: "Infrastructure",
    technologies: [
      { name: "Docker", description: "Containerization" },
      { name: "Mailgun", description: "Transactional emails" },
      { name: "Vercel", description: "Deployment platform" },
    ],
  },
];

export const TechStack = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-secondary/20">
      <div className="container relative z-10 px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20"
          >
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Modern Tech Stack</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            Built with the{" "}
            <span className="text-gradient">best tools</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Industry-leading technologies, carefully selected for performance, 
            developer experience, and scalability.
          </p>
        </motion.div>

        {/* Tech stack grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {techStack.map((stack, stackIndex) => (
            <motion.div
              key={stackIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: stackIndex * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:bg-card/80 transition-all duration-300 hover:border-primary/30"
            >
              <h3 className="text-lg font-bold mb-4 text-primary">{stack.category}</h3>
              <ul className="space-y-3">
                {stack.technologies.map((tech, techIndex) => (
                  <li key={techIndex} className="group">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tech.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tech.description}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
