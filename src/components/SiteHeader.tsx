import { Link, useNavigate } from "react-router";
import { logout } from "@/lib/auth";

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header
      className={`fixed top-0 z-50 flex w-full items-center justify-between px-5 py-4 md:px-10 ${
        dark ? "text-[hsl(var(--paper))]" : "text-[hsl(var(--ink))]"
      }`}
      style={{
        backdropFilter: "blur(10px)",
        background: dark ? "hsl(var(--ink) / 0.72)" : "hsl(var(--paper) / 0.78)",
        borderBottom: dark ? "1px solid hsl(var(--paper) / 0.12)" : "1px solid hsl(var(--line))",
      }}
    >
      <Link to="/course" className="flex items-baseline gap-2">
        <span className="font-brush text-2xl leading-none">涅盘</span>
        <span className="font-song text-xs tracking-[0.3em] opacity-70">心法课</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm md:gap-7">
        <Link to="/course" className="hidden opacity-70 transition-opacity hover:opacity-100 md:inline">
          课程大纲
        </Link>
        <button
          onClick={onLogout}
          className="border border-current px-4 py-1.5 transition-colors hover:border-[hsl(var(--cinnabar))] hover:bg-[hsl(var(--cinnabar))] hover:text-[hsl(var(--paper))]"
        >
          退出登录
        </button>
      </nav>
    </header>
  );
}
