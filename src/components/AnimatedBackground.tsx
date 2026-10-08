export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-navy-600/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-navy-500/15 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: "4s" }} />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%238093f9' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
