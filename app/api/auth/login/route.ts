import { NextRequest, NextResponse } from "next/server";
import { findUserByPhone, findUserByEmail } from "@/lib/users";
import { verifyPassword, createUserToken, USER_COOKIE, COOKIE_MAX_AGE } from "@/lib/userAuth";

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();
    if (!login?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Введите логин и пароль" }, { status: 400 });
    }

    const isPhone = /^[\d\s\+\-\(\)]{7,}$/.test(login.trim());
    const user = isPhone
      ? await findUserByPhone(login.trim())
      : await findUserByEmail(login.trim());

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Неверный телефон/email или пароль" }, { status: 401 });
    }

    const token = createUserToken(user.id);
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email },
    });
    res.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
