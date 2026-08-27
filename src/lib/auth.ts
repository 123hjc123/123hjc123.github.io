// 极简前端账密（内部测试用）：账号 123 / 密码 123，登录态存本机浏览器。
const KEY = "niepan_auth_v1";

export const ACCOUNT = "123";
export const PASSWORD = "123";

export function isAuthed(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function login(account: string, password: string): boolean {
  if (account.trim() === ACCOUNT && password === PASSWORD) {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
}

export function logout(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
