import { NextRequest, NextResponse } from "next/server";
import { findUserByPhone, findUserByEmail, createUser } from "@/lib/users";
import { hashPassword, createUserToken, USER_COOKIE, COOKIE_MAX_AGE } from "@/lib/userAuth";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name?.trim() || !phone?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
    }

    const existing = await findUserByPhone(phone);
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким телефоном уже зарегистрирован" }, { status: 409 });
    }

    if (email) {
      const byEmail = await findUserByEmail(email);
      if (byEmail) {
        return NextResponse.json({ error: "Email уже используется" }, { status: 409 });
      }
    }

    const user = await createUser({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() ?? "",
      passwordHash: hashPassword(password),
    });

    const token = createUserToken(user.id);
    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
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
