"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, stackSignals } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["01", "WORK", "#work"],
  ["02", "ABOUT", "#philosophy"],
  ["03", "CONTACT", "#contact"]
];

export default function HomeExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const containerRef = useRef(null);
  const contactWordRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 190, damping: 24, mass: 0.24 });
  const smoothY = useSpring(mouseY, { stiffness: 190, damping: 24, mass: 0.24 });
  const previewX = useTransform(smoothX, (value) => value - 310);
  const previewY = useTransform(smoothY, (value) => value - 190);

  useEffect(() => {
    const handlePointerMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".hero-title-line", {
        yPercent: 115,
        rotate: 2,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.12
      });

      gsap.from(".hero-fade", {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.22
      });

      gsap.utils.toArray(".reveal-up").forEach((element) => {
        gsap.from(element, {
          y: 74,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%"
          }
        });
      });

      gsap.to(".stack-marquee", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".stack-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      if (contactWordRef.current) {
        gsap.fromTo(
          contactWordRef.current,
          { scale: 0.86, letterSpacing: "0em" },
          {
            scale: 1,
            letterSpacing: "0.015em",
            ease: "none",
            scrollTrigger: {
              trigger: ".contact-section",
              start: "top 75%",
              end: "bottom bottom",
              scrub: true
            }
          }
        );
      }
    }, containerRef);

    return () => context.revert();
  }, []);

  return (
    <main ref={containerRef} id="top" className="relative overflow-hidden bg-graphite text-bone">
      <SignalCanvas />
      <div className="noise" aria-hidden="true" />
      <CustomCursor x={smoothX} y={smoothY} variant={cursorVariant} />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between p-4 mix-blend-difference md:p-8">
        <Magnetic
          as="a"
          href="#top"
          className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.08em]"
          onCursor={setCursorVariant}
        >
          <span className="mr-3 inline-grid size-11 place-items-center rounded-full border border-current">BT</span>
          <span className="hidden text-muted sm:inline">Portfolio</span>
        </Magnetic>
        <Magnetic
          as="button"
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          onCursor={setCursorVariant}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span>{menuOpen ? "CLOSE" : "MENU"}</span>
          <i className={menuOpen ? "is-open" : ""} />
        </Magnetic>
      </header>

      <aside className="fixed bottom-8 left-8 z-20 hidden gap-5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted [writing-mode:vertical-rl] lg:flex">
        <span>AMS / 2026</span>
        <span>WORK / ABOUT / CONTACT</span>
      </aside>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.76, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 grid grid-rows-[auto_1fr_auto] gap-8 bg-bone p-5 pt-24 text-graphite md:p-16"
          >
            <div className="flex justify-between gap-4 font-mono text-xs font-bold uppercase tracking-[0.08em]">
              <span>INDEX</span>
              <Magnetic as="a" href="mailto:bentakaki7@gmail.com" onCursor={setCursorVariant}>
                bentakaki7@gmail.com
              </Magnetic>
            </div>
            <div className="self-center">
              {navItems.map(([index, label, href]) => (
                <Magnetic
                  key={href}
                  as="a"
                  href={href}
                  className="group flex w-fit items-baseline gap-5 font-display text-[clamp(4.5rem,15vw,16rem)] uppercase leading-[0.78] transition-colors hover:text-ember"
                  onClick={() => setMenuOpen(false)}
                  onCursor={setCursorVariant}
                >
                  <span className="font-mono text-sm">{index}</span>
                  {label}
                </Magnetic>
              ))}
            </div>
            <p className="max-w-3xl text-[clamp(1.05rem,2vw,1.8rem)] leading-tight">
              Selected projects, a short introduction, and a direct way to contact me.
            </p>
          </motion.nav>
        )}
      </AnimatePresence>

      <section className="hero relative flex min-h-screen flex-col justify-center px-4 py-28 md:px-8">
        <div className="hero-fade mb-10 grid gap-4 font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted md:grid-cols-[0.72fr_0.28fr]">
          <span>BENJAMIN TAKAKI</span>
          <span>SOFTWARE / AI / WEB</span>
        </div>
        <h1 aria-label="Benjamin Takaki" className="font-display text-[clamp(3.8rem,15vw,17rem)] uppercase leading-[0.82] tracking-[-0.02em]">
          <span className="hero-title-line block">BENJAMIN</span>
          <span className="hero-title-line hero-outline block md:pl-[13vw]">TAKAKI</span>
        </h1>
        <div className="mt-10 grid items-end gap-7 md:grid-cols-[0.72fr_0.28fr]">
          <p className="hero-fade max-w-5xl text-[clamp(1.2rem,2.2vw,2.2rem)] leading-[1.05]">
            Software engineer building AI-assisted products, Flask apps, recommendation systems, and sharp web interfaces.
          </p>
          <Magnetic
            as="a"
            href="#work"
            className="hero-fade justify-self-start rounded-full border border-bone/40 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-acid md:justify-self-end"
            onCursor={setCursorVariant}
          >
            View work <span className="ml-3 inline-grid size-9 place-items-center rounded-full bg-acid text-graphite">v</span>
          </Magnetic>
        </div>
      </section>

      <section id="work" className="px-4 py-24 md:px-8 md:py-40">
        <SectionHeading kicker="01 / WORK" title="Selected work" />
        <motion.div
          className="pointer-events-none fixed z-20 hidden aspect-[1.35/1] w-[min(46vw,720px)] overflow-hidden border border-bone/40 lg:block"
          style={{ x: previewX, y: previewY }}
          animate={{ opacity: previewVisible ? 1 : 0, rotate: previewVisible ? -2 : 0, scale: previewVisible ? 1 : 0.92 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <ProjectPreviewCard project={activeProject} />
        </motion.div>
        <div className="mb-5 flex flex-wrap gap-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted">
          <span className="rounded-full border border-bone/20 px-3 py-2">Hover a title</span>
          <span className="rounded-full border border-bone/20 px-3 py-2">Click to open</span>
        </div>
        <div className="border-t border-bone/20">
          {projects.map((project) => (
            <Magnetic
              key={project.index}
              as="a"
              href={project.href}
              className="project-row group"
              onMouseEnter={() => {
                setActiveProject(project);
                setPreviewVisible(true);
                setCursorVariant("project");
              }}
              onMouseLeave={() => {
                setPreviewVisible(false);
                setCursorVariant("default");
              }}
              onCursor={setCursorVariant}
            >
              <span className="font-mono text-xs font-bold tracking-[0.08em]">{project.index}</span>
              <span className="font-display text-[clamp(2.8rem,9vw,10rem)] uppercase leading-[0.78]">{project.title}</span>
              <span className="font-mono text-xs font-bold tracking-[0.08em] text-muted group-hover:text-bone">{project.meta}</span>
            </Magnetic>
          ))}
        </div>
      </section>

      <section id="philosophy" className="grid items-center gap-10 px-4 py-24 md:px-8 md:py-40 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="reveal-up border border-bone/20 bg-panel/80 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-bone/20 px-4 py-3 font-mono text-xs text-muted">
            <span className="size-2 rounded-full bg-acid" />
            <span className="size-2 rounded-full bg-bone/40" />
            <span className="size-2 rounded-full bg-bone/20" />
            <strong className="ml-2">profile</strong>
          </div>
          <pre className="whitespace-pre-wrap p-5 font-mono text-[clamp(0.9rem,1.5vw,1.18rem)] leading-8">
{`I build practical software with a strong eye for how it feels.

Python, Flask, AI workflows, and web interfaces.`}
          </pre>
        </div>
        <div className="reveal-up">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.1em] text-acid">02 / ABOUT</p>
          <h2 className="font-display text-[clamp(2.6rem,7vw,8rem)] uppercase leading-[0.86]">
            Practical software with a sharper visual edge.
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-7 text-muted md:text-xl">
            My work sits between backend logic and interface design: products that are useful, readable, and visually memorable.
          </p>
        </div>
      </section>

      <section id="stack" className="stack-section overflow-hidden px-4 py-16 md:px-8 md:py-24">
        <div className="stack-marquee flex w-max gap-8 whitespace-nowrap font-display text-[clamp(4rem,12vw,13rem)] uppercase leading-none text-transparent">
          <span>SOFTWARE / AI / WEB / DESIGN / PYTHON / FLASK / JAVASCRIPT /</span>
          <span>SOFTWARE / AI / WEB / DESIGN / PYTHON / FLASK / JAVASCRIPT /</span>
        </div>
        <div className="mt-12 grid border border-bone/20 bg-bone/20 md:grid-cols-3">
          {stackSignals.map((signal) => (
            <article key={signal.index} className="reveal-up min-h-[15rem] border-b border-bone/20 bg-graphite p-5 md:border-b-0 md:border-r">
              <span className="font-mono font-bold text-acid">{signal.index}</span>
              <h3 className="mt-10 font-display text-[clamp(1.8rem,3vw,3.2rem)] uppercase leading-[0.9]">{signal.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{signal.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section flex min-h-screen flex-col justify-end px-4 py-24 md:px-8">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-acid">03 / CONTACT</p>
        <Magnetic
          as="a"
          href="mailto:bentakaki7@gmail.com"
          ref={contactWordRef}
          className="my-8 block origin-left font-display text-[clamp(4rem,18vw,20rem)] uppercase leading-[0.76]"
          onCursor={setCursorVariant}
        >
          CONTACT
        </Magnetic>
        <div className="border-t border-bone/20 font-mono text-sm font-bold uppercase tracking-[0.08em]">
          {[
            ["EMAIL", "bentakaki7@gmail.com", "mailto:bentakaki7@gmail.com", false],
            ["GITHUB", "BenjaminLTakaki", "https://github.com/BenjaminLTakaki", true],
            ["LINKEDIN", "benjamin-takaki", "https://linkedin.com/in/benjamin-takaki-3a7aa3302", true]
          ].map(([label, value, href, external]) => (
            <Magnetic
              key={label}
              as="a"
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex items-center justify-between gap-6 border-b border-bone/20 py-6 hover:text-acid md:py-8"
              onCursor={setCursorVariant}
            >
              <span className="text-muted group-hover:text-acid">{label}</span>
              <span className="font-display text-[clamp(1.6rem,5vw,4rem)] normal-case tracking-[-0.01em]">
                {value}
              </span>
              <span className="text-acid">{external ? "↗" : "→"}</span>
            </Magnetic>
          ))}
        </div>
      </section>

      <footer className="relative z-10 flex flex-col justify-between gap-3 border-t border-bone/20 px-4 py-8 font-mono text-xs font-bold uppercase tracking-[0.08em] text-muted md:flex-row md:px-8">
        <span>2026 BENJAMIN TAKAKI</span>
        <span>CREATIVE DEVELOPMENT / AI SYSTEMS</span>
      </footer>
    </main>
  );
}

function SectionHeading({ kicker, title }) {
  return (
    <div className="mb-12 grid items-end gap-4 md:grid-cols-[0.72fr_0.28fr]">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-acid">{kicker}</p>
      <h2 className="reveal-up max-w-5xl font-display text-[clamp(2.6rem,7vw,8rem)] uppercase leading-[0.86] md:col-start-1">{title}</h2>
    </div>
  );
}

function ProjectPreviewCard({ project }) {
  return (
    <div className="flex h-full flex-col justify-between bg-panel p-5">
      <div className="flex items-center justify-between border-b border-bone/20 pb-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-muted">
        <span>{project.index}</span>
        <span>Selected work</span>
      </div>
      <div className="grid gap-4">
        <div className="font-display text-[clamp(2.4rem,5vw,5.4rem)] uppercase leading-[0.82] text-bone">
          {project.title}
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">{project.summary}</p>
      </div>
      <div className="h-24 bg-acid" aria-hidden="true">
        <div className="h-full w-2/3 bg-bone" />
      </div>
    </div>
  );
}

const Magnetic = forwardRef(function Magnetic(
  {
    as: Component = "div",
    children,
    onCursor,
    className = "",
    onMouseEnter,
    onMouseLeave,
    onPointerMove,
    ...props
  },
  forwardedRef
) {
  const ref = useRef(null);

  const setRefs = (node) => {
    ref.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const handlePointerMove = (event) => {
    const element = ref.current;
    if (!element || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.13}px, ${y * 0.13}px)`;
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event) => {
    if (ref.current) ref.current.style.transform = "";
    onCursor?.("default");
    onMouseLeave?.(event);
  };

  return (
    <Component
      ref={setRefs}
      className={`magnetic transition-transform duration-300 ease-expo ${className}`}
      onMouseEnter={(event) => {
        onCursor?.("link");
        onMouseEnter?.(event);
      }}
      onMouseLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </Component>
  );
});

function CustomCursor({ x, y, variant }) {
  return (
    <>
      <motion.div className="custom-cursor-dot" style={{ x, y }} />
      <motion.div
        className="custom-cursor-ring"
        style={{ x, y }}
        animate={{
          width: variant === "project" ? 112 : variant === "link" ? 74 : 42,
          height: variant === "project" ? 112 : variant === "link" ? 74 : 42,
          borderColor: variant === "project" ? "#FF4D2E" : "#E3342F",
          backgroundColor: variant === "default" ? "rgba(0,0,0,0)" : variant === "project" ? "rgba(255,77,46,0.08)" : "rgba(227,52,47,0.1)"
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}

function SignalCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80" aria-hidden="true">
      <div className="absolute right-[-12vw] top-[-12vw] h-[46vw] w-[46vw] rounded-full bg-acid/20 blur-3xl" />
      <div className="absolute bottom-[-18vw] left-[-10vw] h-[42vw] w-[42vw] rounded-full bg-red-950/60 blur-3xl" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-bone/10" />
      <div className="absolute inset-y-0 left-1/3 w-px bg-bone/10" />
    </div>
  );
}

