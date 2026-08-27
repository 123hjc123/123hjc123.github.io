import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { isAuthed, login } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAuthed()) {
    return <Navigate to="/course" replace />;
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(account, password)) {
      navigate("/course", { replace: true });
    } else {
      setError("账号或密码错误");
    }
  };

  return (
    <div className="paper-bg flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* 标题 */}
        <div className="text-center">
          <p className="font-brush text-6xl leading-none md:text-7xl">涅盘</p>
          <p className="mt-3 font-song text-xs tracking-[0.5em] text-[hsl(var(--ink-3))]">心 法 课</p>
          <p className="mt-6 font-song text-sm text-[hsl(var(--ink-3))]">
            四年 87 倍的游资体系 · 16 课图解实战版
          </p>
        </div>

        {/* 登录卡 */}
        <form onSubmit={onSubmit} className="mt-10 border-2 border-[hsl(var(--ink))] bg-[hsl(var(--paper))]">
          <div className="border-b border-[hsl(var(--ink))] px-6 py-3">
            <p className="font-song text-sm font-bold tracking-widest">账密登录</p>
          </div>
          <div className="space-y-5 px-6 py-7">
            <div>
              <label className="mb-1.5 block font-song text-xs font-semibold tracking-widest text-[hsl(var(--ink-3))]">
                账号
              </label>
              <input
                value={account}
                onChange={(e) => {
                  setAccount(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                placeholder="请输入账号"
                className="w-full border border-[hsl(var(--ink)/0.5)] bg-transparent px-3.5 py-2.5 font-mono-num text-sm outline-none transition-colors placeholder:text-[hsl(var(--ink-3)/0.5)] focus:border-[hsl(var(--cinnabar))]"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-song text-xs font-semibold tracking-widest text-[hsl(var(--ink-3))]">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                placeholder="请输入密码"
                className="w-full border border-[hsl(var(--ink)/0.5)] bg-transparent px-3.5 py-2.5 font-mono-num text-sm outline-none transition-colors placeholder:text-[hsl(var(--ink-3)/0.5)] focus:border-[hsl(var(--cinnabar))]"
              />
            </div>
            {error && (
              <p className="border border-[hsl(var(--cinnabar))] bg-[hsl(var(--cinnabar)/0.06)] px-3 py-2 text-center font-song text-xs font-semibold text-[hsl(var(--cinnabar))]">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-[hsl(var(--cinnabar))] py-3 font-song text-sm font-bold tracking-[0.4em] text-[hsl(var(--paper))] transition-colors hover:bg-[hsl(var(--cinnabar-bright))]"
            >
              进入课程
            </button>
          </div>
        </form>

        <p className="mt-6 text-center font-song text-xs text-[hsl(var(--ink-3))]">
          登录态与学习进度均保存在本机浏览器
        </p>
      </div>
    </div>
  );
}
