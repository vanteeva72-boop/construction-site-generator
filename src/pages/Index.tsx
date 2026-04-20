import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "about" | "projects" | "news" | "tenders" | "docs" | "contacts";
type UserRole = "superadmin" | "contentadmin" | "user" | null;
interface User { name: string; role: UserRole; email: string; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, title: "Жилой комплекс «Северная звезда»", type: "ПГС", year: 2024, area: "48 500 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 2, title: "Участок метро «Тропарёво – Румянцево»", type: "Метро и тоннели", year: 2023, area: "3.4 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 3, title: "Автомагистраль М-12 «Восток»", type: "Дорожное строительство", year: 2024, area: "12.5 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "В процессе" },
  { id: 4, title: "Инженерные сети микрорайона «Новый»", type: "Инженерная инфраструктура", year: 2023, area: "18 600 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
  { id: 5, title: "Эстакада на ТТК, участок 4А", type: "Дорожное строительство", year: 2024, area: "820 м", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "В процессе" },
  { id: 6, title: "Проект реконструкции депо «Печатники»", type: "Проектирование", year: 2023, area: "—", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Завершён" },
];
const NEWS = [
  { id: 1, date: "18 апреля 2026", category: "Компания", title: "АО УРСТ вошло в топ-10 строительных компаний России", text: "По итогам ежегодного рейтинга отраслевого портала, компания заняла 7-е место среди крупнейших строительных организаций страны." },
  { id: 2, date: "10 апреля 2026", category: "Проекты", title: "Начало строительства нового участка метро на севере города", text: "На этой неделе официально стартовал один из крупнейших транспортных проектов этого года — участок метро протяжённостью 4.2 км." },
  { id: 3, date: "2 апреля 2026", category: "Тендеры", title: "Победа в государственном тендере на строительство дороги", text: "Наша компания одержала победу в конкурсе на возведение участка автомагистрали. Стоимость контракта — 2.1 млрд рублей." },
  { id: 4, date: "25 марта 2026", category: "Компания", title: "Открытие нового регионального офиса в Санкт-Петербурге", text: "В рамках стратегии расширения географии присутствия открылся наш офис в Северной столице." },
];
const TENDERS = [
  { id: 1, title: "Строительство тоннельного участка метро", deadline: "15 мая 2026", budget: "от 4.5 млрд ₽", type: "Открытый конкурс", status: "active" },
  { id: 2, title: "Реконструкция инженерных сетей", deadline: "28 мая 2026", budget: "от 45 млн ₽", type: "Запрос котировок", status: "active" },
  { id: 3, title: "Строительство автомобильной дороги II категории", deadline: "5 июня 2026", budget: "от 780 млн ₽", type: "Открытый конкурс", status: "active" },
  { id: 4, title: "Проектирование объектов инфраструктуры", deadline: "20 апреля 2026", budget: "от 8 млн ₽", type: "Запрос котировок", status: "closed" },
  { id: 5, title: "Поставка строительных материалов 2026", deadline: "1 апреля 2026", budget: "от 62 млн ₽", type: "Открытый конкурс", status: "closed" },
];
const DOCS = [
  { id: 1, name: "Устав АО «УРСТ»", type: "PDF", size: "2.4 МБ", category: "Учредительные", date: "01.01.2020" },
  { id: 2, name: "Лицензия на строительную деятельность", type: "PDF", size: "1.1 МБ", category: "Лицензии", date: "15.03.2023" },
  { id: 3, name: "Сертификат ISO 9001:2015", type: "PDF", size: "0.8 МБ", category: "Сертификаты", date: "10.06.2024" },
  { id: 4, name: "Допуск СРО на особо опасные объекты", type: "PDF", size: "1.6 МБ", category: "СРО", date: "22.09.2023" },
  { id: 5, name: "Финансовая отчётность 2025", type: "XLSX", size: "3.2 МБ", category: "Финансы", date: "28.02.2026", restricted: true },
  { id: 6, name: "Технические регламенты и стандарты", type: "PDF", size: "5.7 МБ", category: "Техническая", date: "01.04.2026" },
];

const B = "#0066FF";   // accent blue
const INK = "#0A0F1E"; // dark text
const MUT = "#6B7896"; // muted

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (email === "super@ao-urst.ru" && pw === "super123") onLogin({ name: "Иван", role: "superadmin", email });
    else if (email === "admin@ao-urst.ru" && pw === "admin123") onLogin({ name: "Мария Иванова", role: "contentadmin", email });
    else if (email === "user@ao-urst.ru" && pw === "user123") onLogin({ name: "Сергей Попов", role: "user", email });
    else setErr("Неверный логин или пароль");
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-md animate-scale-in"
        style={{ borderRadius: 16, boxShadow: "0 32px 80px rgba(5,9,26,.25)", overflow: "hidden" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ background: INK }} className="px-8 py-6 flex justify-between items-center">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1.05rem" }} className="text-white">Вход в систему</div>
            <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,.5)" }}>АО УРСТ</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <Icon name="X" size={18} />
          </button>
        </div>
        {/* Demo hint */}
        <div className="mx-8 mt-6 px-4 py-3 rounded-lg" style={{ background: "rgba(0,102,255,.06)", border: "1px solid rgba(0,102,255,.15)" }}>
          <div className="text-xs font-semibold mb-1" style={{ color: B, fontFamily: "'Inter',sans-serif" }}>Демо-доступ</div>
          <div className="text-xs leading-relaxed" style={{ color: MUT }}>
            <span style={{ color: INK, fontWeight: 600 }}>Суперадмин:</span> super@ao-urst.ru / super123<br />
            <span style={{ color: INK, fontWeight: 600 }}>Контент-админ:</span> admin@ao-urst.ru / admin123<br />
            <span style={{ color: INK, fontWeight: 600 }}>Пользователь:</span> user@ao-urst.ru / user123
          </div>
        </div>
        <form onSubmit={submit} className="px-8 py-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email</label>
            <input type="email" className="field" value={email} onChange={e => setEmail(e.target.value)} placeholder="Введите email" required />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Пароль</label>
            <input type="password" className="field" value={pw} onChange={e => setPw(e.target.value)} placeholder="Введите пароль" required />
          </div>
          {err && <div className="text-red-500 text-sm flex items-center gap-2"><Icon name="AlertCircle" size={14} />{err}</div>}
          <button type="submit" className="btn-primary w-full justify-center">Войти</button>
        </form>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ active, go, user, onLogin, onLogout, mob, setMob }: {
  active: Section; go: (s: Section) => void; user: User | null;
  onLogin: () => void; onLogout: () => void; mob: boolean; setMob: (v: boolean) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const allNav: { key: Section; label: string; auth?: boolean }[] = [
    { key: "home", label: "Главная" },
    { key: "about", label: "О компании" },
    { key: "projects", label: "Проекты" },
    { key: "news", label: "Новости" },
    { key: "contacts", label: "Контакты" },
    { key: "tenders", label: "Тендеры", auth: true },
    { key: "docs", label: "Документация", auth: true },
  ];
  const nav = allNav.filter(item => !item.auth || (user && (user.role === "user" || user.role === "contentadmin")));

  // Прозрачный только на главной для обычных пользователей, для админов всегда тёмный
  const isHome = active === "home";
  const isAdmin = user?.role === "superadmin" || user?.role === "contentadmin";
  const solid = !isHome || scrolled || isAdmin;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: solid ? "rgba(5,9,26,.96)" : "transparent",
        backdropFilter: solid ? "blur(20px)" : "none",
        WebkitBackdropFilter: solid ? "blur(20px)" : "none",
        borderBottom: solid ? "1px solid rgba(255,255,255,.07)" : "none",
      }}>
      {/* Top contact bar */}
      <div className="hidden md:block" style={{ background: "rgba(0,102,255,.9)", backdropFilter: "blur(8px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-6 text-white" style={{ fontSize: ".75rem", fontFamily: "'Inter',sans-serif", opacity: .9 }}>
            <span className="flex items-center gap-1.5"><Icon name="Phone" size={11} /> +7 (495) 940-07-03</span>
            <span className="flex items-center gap-1.5"><Icon name="Mail" size={11} /> info@ao-urst.ru</span>
          </div>
          <span className="text-white flex items-center gap-1.5" style={{ fontSize: ".75rem", fontFamily: "'Inter',sans-serif", opacity: .7 }}>
            <Icon name="Clock" size={11} /> Пн–Пт, 9:00–18:00
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => go("home")} className="flex items-center gap-3 group">
          <div style={{ borderRadius: 8, boxShadow: "0 4px 12px rgba(0,102,255,.4)", overflow: "hidden", background: "transparent" }}
            className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/f7e42cde-bc9f-49ef-9ea5-01f05ae05665.png"
              alt="АО УРСТ" style={{ height: 34, width: "auto", display: "block" }} />
          </div>
          <div className="leading-tight">
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#fff", letterSpacing: "-.01em" }}>АО УРСТ</div>
            <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.45)", letterSpacing: ".1em", fontFamily: "'Inter',sans-serif" }}>СТРОИТЕЛЬНАЯ КОМПАНИЯ</div>
          </div>
        </button>

        {/* Desktop nav — скрываем для суперадмина */}
        {user?.role !== "superadmin" && (
          <nav className="hidden lg:flex items-center gap-7">
            {nav.map(item => (
              <button key={item.key} onClick={() => go(item.key)}
                className={`nav-item ${active === item.key ? "active" : ""}`}
                style={{ color: active === item.key ? "#fff" : "rgba(255,255,255,.6)" }}>
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2.5">
                <div style={{ background: B, width: 30, height: 30, borderRadius: 7, fontSize: ".8rem", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}
                  className="flex items-center justify-center text-white">{user.name.charAt(0)}</div>
                <div>
                  <div style={{ color: "#fff", fontSize: ".8rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: ".68rem", fontFamily: "'Inter',sans-serif", color: user.role === "superadmin" ? "#f59e0b" : user.role === "contentadmin" ? "#3385FF" : "rgba(255,255,255,.4)" }}>
                    {user.role === "superadmin" ? "Суперадмин" : user.role === "contentadmin" ? "Контент-админ" : "Пользователь"}
                  </div>
                </div>
              </div>
              <button onClick={onLogout} className="text-gray-400 hover:text-white transition-colors p-1"><Icon name="LogOut" size={15} /></button>
            </div>
          ) : (
            <button onClick={onLogin} className="btn-primary text-xs py-2 px-4">Войти</button>
          )}
          <button className="lg:hidden text-white p-1" onClick={() => setMob(!mob)}>
            <Icon name={mob ? "X" : "Menu"} size={21} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mob && (
        <div style={{ background: "rgba(5,9,26,.97)", backdropFilter: "blur(20px)", borderTop: `1px solid rgba(0,102,255,.2)` }} className="lg:hidden px-6 pb-5">
          {nav.map(item => (
            <button key={item.key} onClick={() => { go(item.key); setMob(false); }}
              className="block w-full text-left py-3 border-b text-sm"
              style={{ borderColor: "rgba(255,255,255,.06)", color: active === item.key ? "#3385FF" : "rgba(255,255,255,.7)", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Page Header (inner pages) ────────────────────────────────────────────────
function PageHeader({ label, title, sub }: { label: string; title: string; sub: string }) {
  return (
    <div style={{ background: INK, paddingTop: 140 }} className="pb-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="chip mb-4">{label}</div>
        <h1 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: "#fff", letterSpacing: "-.03em", lineHeight: 1.1 }} className="mb-3">{title}</h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".95rem", maxWidth: 520 }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeSection({ go }: { go: (s: Section) => void }) {
  const stats = [
    { value: "13+", label: "Лет на рынке" },
    { value: "250 млн. руб.", label: "Составляет уставный капитал" },
    { value: "350 км", label: "Тоннелей и дорог" },
    { value: "9000+", label: "Закупок у поставщиков" },
  ];
  const services = [
    { icon: "Train", title: "Метро и тоннели", text: "Строительство и проектирование линий метро (глубокого и мелкого заложения), электродепо, тоннелей." },
    { icon: "Truck", title: "Дорожное строительство", text: "Строительство автомобильных дорог, автомагистралей и искусственных сооружений (мосты, эстакады)." },
    { icon: "Building2", title: "ПГС", text: "Строительство жилых и нежилых зданий, а также объектов инженерной инфраструктуры." },
    { icon: "Zap", title: "Инженерная инфраструктура", text: "Строительство коммуникаций: водоснабжение, водоотведение, газоснабжение, ЛЭП." },
    { icon: "FileText", title: "Проектирование", text: "Разработка строительных проектов любой сложности." },
  ];

  return (
    <div>
      {/* ── Hero ────────────────────────────── */}
      <section className="hero-bg min-h-screen flex items-end relative" style={{ paddingTop: 80 }}>
        <div className="hero-grid" />

        <div className="max-w-7xl mx-auto px-6 pb-20 w-full relative z-10">
          {/* Hero grid: text left, image right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="chip mb-6 animate-fade-up" style={{ opacity: 0 }}>13+ лет профессиональной деятельности</div>
              <h1 className="animate-fade-up d-100 text-white"
                style={{ opacity: 0, fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.6rem,6vw,5rem)", lineHeight: 1.0, letterSpacing: "-.04em" }}>
                Строим<br />
                <span style={{ color: "#3385FF" }}>инфраструктуру</span><br />
                будущего
              </h1>
              <p className="animate-fade-up d-200 mt-6 text-base leading-relaxed" style={{ opacity: 0, color: "rgba(255,255,255,.55)", maxWidth: 520 }}>
                Полный цикл строительства — от проектирования до сдачи объекта. Государственные и коммерческие заказчики.
              </p>
              <div className="flex gap-3 flex-wrap mt-8 animate-fade-up d-300" style={{ opacity: 0 }}>
                <button onClick={() => go("projects")} className="btn-primary">Наши проекты <Icon name="ArrowRight" size={14} /></button>
                <button onClick={() => go("contacts")} className="btn-ghost">Связаться с нами</button>
              </div>
            </div>
            {/* Hero image */}
            <div className="hidden lg:flex items-center justify-center animate-fade-up d-200" style={{ opacity: 0 }}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.08)" }}>
                <img
                  src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/bd1efb26-9159-4593-b3b4-35f24f64ad35.jpg"
                  alt="Строительство инфраструктуры"
                  style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-up d-400" style={{ opacity: 0 }}>
            {stats.map((s, i) => (
              <div key={i} className="glass px-5 py-4 rounded-xl">
                <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#fff", letterSpacing: "-.03em" }}>{s.value}</div>
                <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.45)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #fff)" }} />
      </section>

      {/* ── Services ────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <div className="section-label mb-2">Направления</div>
              <div className="accent-bar mb-4" />
              <h2 className="section-title mb-5">Что мы строим</h2>
              <p style={{ color: MUT, lineHeight: 1.7, fontSize: ".95rem" }}>
                Акционерное Общество «Управление Развития Строительных Технологий» выполняет широкий перечень услуг, связанный с разработкой проектов в строительной сфере, проектированием и строительством объектов гражданского назначения.
              </p>
            </div>
            <div className="hidden lg:block">
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(10,15,30,.12)" }}>
                <img
                  src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/75f7704f-4a3a-4cd1-ace5-32e9fce13c32.jpg"
                  alt="Строительство"
                  style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <div key={i} className="card-lift p-6 rounded-2xl group cursor-pointer"
                style={{ background: "#F7F8FC", border: "1px solid #E4E8F0", transition: "all .3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,102,255,.25)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#F7F8FC"; (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(0,102,255,.08)" }} className="flex items-center justify-center mb-4">
                  <Icon name={s.icon as "Building2"} size={20} style={{ color: B }} />
                </div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
            {/* CTA card */}
            <div className="card-lift p-6 rounded-2xl flex flex-col justify-between cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${B} 0%, #0052CC 100%)`, border: "none" }}
              onClick={() => go("contacts")}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,.15)" }} className="flex items-center justify-center mb-4">
                  <Icon name="MessageSquare" size={20} className="text-white" />
                </div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#fff", marginBottom: 6 }}>Обсудить проект</h3>
                <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>Рассчитаем стоимость в течение одного рабочего дня.</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-white" style={{ fontSize: ".8rem", fontWeight: 600 }}>
                Связаться <Icon name="ArrowRight" size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News preview ────────────────────── */}
      <section className="py-24" style={{ background: "#F7F8FC" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="section-label mb-2">Пресс-центр</div>
              <h2 className="section-title">Последние новости</h2>
            </div>
            <button onClick={() => go("news")} className="btn-outline hidden md:inline-flex">
              Все новости <Icon name="ArrowRight" size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {NEWS.slice(0, 3).map((n, idx) => (
              <div key={n.id} className="card-lift bg-white rounded-2xl overflow-hidden group cursor-pointer"
                style={{ border: "1px solid #E4E8F0" }}>
                <div style={{ height: 4, background: idx === 0 ? B : "#E4E8F0" }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="chip">{n.category}</span>
                    <span style={{ fontSize: ".7rem", color: MUT }}>{n.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK, lineHeight: 1.45, marginBottom: 8 }}>{n.title}</h3>
                  <p style={{ fontSize: ".82rem", color: MUT, lineHeight: 1.6 }}>{n.text.slice(0, 85)}…</p>
                  <div className="mt-4 flex items-center gap-1" style={{ color: B, fontSize: ".78rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                    Читать <Icon name="ArrowRight" size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const values = [
    { icon: "ShieldCheck", title: "Надёжность", text: "13 лет на рынке — каждый объект строится в срок и с гарантией." },
    { icon: "Award", title: "Качество", text: "Международные стандарты ISO, современные технологии и материалы." },
    { icon: "Users", title: "Команда", text: "Опытные инженеры, строители, проектировщики." },
    { icon: "TrendingUp", title: "Развитие", text: "Постоянное инвестирование в оборудование и обучение персонала." },
  ];
  const team = [
    { name: "Смирнов Игорь", role: "Генеральный директор", exp: "20 лет в строительстве" },
    { name: "Елена Миронова", role: "Главный инженер", exp: "15 лет в отрасли" },
    { name: "Алексей Варшавский", role: "Директор по проектам", exp: "12 лет в управлении" },
    { name: "Ирина Федотова", role: "Финансовый директор", exp: "10 лет в финансах" },
  ];

  return (
    <div>
      <PageHeader label="О нас" title="О компании" sub="Строим инфраструктуру Москвы с 1931 года." />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-2">История</div>
            <div className="accent-bar mb-4" />
            <h2 className="section-title mb-6">Миссия и история</h2>
            <p style={{ color: MUT, lineHeight: 1.75, marginBottom: 12 }}>Официальную историю АО «УРСТ» ведет с 1953 года, с реорганизации Краснопресненского ремонтно-строительного треста.</p>
            <p style={{ color: MUT, lineHeight: 1.75, marginBottom: 12 }}>За двадцать последующих лет трест серьезно расширил сферу своих компетенций: к началу 1980-х в его составе было уже пять управлений: 3 строительных и 2 ремонтных. В штате насчитывалось порядка 1700 работников, а показатели сдачи жилья достигли 60–75 тысяч квадратных метров в год.</p>
            <p style={{ color: MUT, lineHeight: 1.75, marginBottom: 12 }}>В 2013 году сложилось современное наименование предприятия — из Государственного Унитарного Предприятия города Москвы «Управление развития строительных технологий» оно было преобразовано в АО «УРСТ». Единственным акционером АО «УРСТ» является акционерное общество «Мосинжпроект» со 100%-ой долей уставного капитала.</p>
            <p style={{ color: MUT, lineHeight: 1.75, marginBottom: 16 }}>АО «УРСТ» зарекомендовало себя как надёжного партнера и качественного исполнителя строительных работ на самых сложных направлениях.</p>
            <p style={{ color: MUT, lineHeight: 1.75 }}>Наша миссия — создавать объекты, которые служат людям десятилетиями: надёжные, функциональные, современные.</p>
            <div className="flex flex-wrap gap-8 mt-10">
              {[["2013", "Год основания"], ["120+", "Объектов сдано"], ["350 км", "Тоннелей и дорог"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.75rem", color: INK, letterSpacing: "-.03em" }}>{v}</div>
                  <div style={{ fontSize: ".8rem", color: MUT, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/5dcc861c-9695-40f3-a9b3-c963da3c8aa5.jpg"
              alt="АО УРСТ" className="w-full object-cover rounded-2xl" style={{ height: 400 }} />
            <div className="absolute -bottom-5 -right-5 px-6 py-4 rounded-xl text-white"
              style={{ background: B, boxShadow: "0 12px 32px rgba(0,102,255,.4)" }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.8rem" }}>13</div>
              <div style={{ fontSize: ".7rem", letterSpacing: ".1em", opacity: .8 }}>ЛЕТ ОПЫТА</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "#F7F8FC" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-label mb-2">Ценности</div>
            <h2 className="section-title">Наши принципы</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div key={i} className="card-lift bg-white p-6 rounded-2xl text-center" style={{ border: "1px solid #E4E8F0" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(0,102,255,.08)", margin: "0 auto 16px" }} className="flex items-center justify-center">
                  <Icon name={v.icon as "ShieldCheck"} size={24} style={{ color: B }} />
                </div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK, marginBottom: 6 }}>{v.title}</h3>
                <p style={{ fontSize: ".82rem", color: MUT, lineHeight: 1.6 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label mb-2">Команда</div>
          <div className="accent-bar mb-4" />
          <h2 className="section-title mb-10">Руководство</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((t, i) => (
              <div key={i} className="card-lift rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
                <div style={{ height: 4, background: B }} />
                <div className="p-6">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: B, fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem" }}
                    className="flex items-center justify-center text-white mb-4">{t.name.charAt(0)}</div>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK }}>{t.name}</h3>
                  <div style={{ fontSize: ".78rem", color: B, fontWeight: 600, margin: "4px 0" }}>{t.role}</div>
                  <div style={{ fontSize: ".75rem", color: MUT }}>{t.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  const [filter, setFilter] = useState("Все");
  const types = ["Все", "Метро и тоннели", "Дорожное строительство", "ПГС", "Инженерная инфраструктура", "Проектирование"];
  const filtered = filter === "Все" ? PROJECTS : PROJECTS.filter(p => p.type === filter);

  return (
    <div>
      <PageHeader label="Портфолио" title="Проекты" sub="120+ реализованных объектов по всей России." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  fontFamily: "'Inter',sans-serif", letterSpacing: ".02em",
                  background: filter === t ? B : "#F7F8FC",
                  color: filter === t ? "#fff" : MUT,
                  border: filter === t ? `1.5px solid ${B}` : "1.5px solid #E4E8F0",
                }}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div key={p.id} className="card-lift rounded-2xl overflow-hidden group" style={{ border: "1px solid #E4E8F0" }}>
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,9,26,.85), transparent)" }} />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="chip" style={{ background: "rgba(0,0,0,.5)", borderColor: "rgba(255,255,255,.15)", color: "#fff" }}>{p.type}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ fontFamily: "'Inter',sans-serif", background: p.status === "Завершён" ? "rgba(34,197,94,.85)" : "rgba(0,102,255,.85)", color: "#fff" }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK, marginBottom: 10, lineHeight: 1.4 }}>{p.title}</h3>
                  <div className="flex gap-4" style={{ fontSize: ".78rem", color: MUT }}>
                    <span className="flex items-center gap-1"><Icon name="Calendar" size={11} /> {p.year}</span>
                    <span className="flex items-center gap-1"><Icon name="Maximize2" size={11} /> {p.area}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────
function NewsSection() {
  return (
    <div>
      <PageHeader label="Пресс-центр" title="Новости" sub="Актуальные события компании и отрасли." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {NEWS.map(n => (
                <div key={n.id} className="card-lift rounded-2xl overflow-hidden group cursor-pointer" style={{ border: "1px solid #E4E8F0" }}>
                  <div className="flex">
                    <div style={{ width: 3, background: B, flexShrink: 0 }} />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="chip">{n.category}</span>
                        <span style={{ fontSize: ".72rem", color: MUT }}>{n.date}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, lineHeight: 1.45, marginBottom: 8 }}>{n.title}</h3>
                      <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.65 }}>{n.text}</p>
                      <div className="mt-4 flex items-center gap-1" style={{ color: B, fontSize: ".78rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                        Читать далее <Icon name="ArrowRight" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl p-6" style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 8 }}>Подписка на новости</h3>
                <p style={{ fontSize: ".8rem", color: MUT, marginBottom: 12 }}>Получайте важные новости компании первыми.</p>
                <input type="email" className="field mb-3" placeholder="Ваш email" />
                <button className="btn-primary w-full justify-center text-xs py-2.5">Подписаться</button>
              </div>
              <div className="rounded-2xl p-6" style={{ background: INK }}>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: "#fff", marginBottom: 12 }}>Пресс-служба</h3>
                <div className="space-y-2.5" style={{ fontSize: ".82rem", color: "rgba(255,255,255,.5)" }}>
                  <div className="flex items-center gap-2"><Icon name="User" size={13} /> Ксения Белова</div>
                  <div className="flex items-center gap-2"><Icon name="Phone" size={13} /> +7 (495) 940-07-03</div>
                  <div className="flex items-center gap-2"><Icon name="Mail" size={13} /> press@ao-urst.ru</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tenders ──────────────────────────────────────────────────────────────────
function TendersSection({ user }: { user: User | null }) {
  const [tab, setTab] = useState<"active" | "closed">("active");
  const filtered = TENDERS.filter(t => t.status === tab);

  return (
    <div>
      <PageHeader label="Закупки" title="Тендеры" sub="Актуальные конкурсные процедуры компании." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {user?.role === "admin" && (
            <div className="rounded-2xl p-5 mb-8 flex items-center justify-between"
              style={{ background: "rgba(0,102,255,.05)", border: "1px solid rgba(0,102,255,.18)" }}>
              <div className="flex items-center gap-3">
                <Icon name="ShieldCheck" size={17} style={{ color: B }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".88rem", color: INK }}>Панель администратора</span>
              </div>
              <button className="btn-primary text-xs py-2 px-4"><Icon name="Plus" size={13} /> Добавить</button>
            </div>
          )}
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
            {(["active", "closed"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  fontFamily: "'Inter',sans-serif",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? INK : MUT,
                  boxShadow: tab === t ? "0 1px 4px rgba(10,15,30,.08)" : "none",
                }}>
                {t === "active" ? "Активные" : "Завершённые"}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map(tender => (
              <div key={tender.id} className="card-lift rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ border: "1px solid #E4E8F0", background: "#fff" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="chip">{tender.type}</span>
                    {tender.status === "active" && <span style={{ fontSize: ".72rem", color: "#16a34a", fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>● Активный</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, marginBottom: 8 }}>{tender.title}</h3>
                  <div className="flex gap-5" style={{ fontSize: ".82rem", color: MUT }}>
                    <span className="flex items-center gap-1.5"><Icon name="Calendar" size={12} /> {tender.deadline}</span>
                    <span className="flex items-center gap-1.5"><Icon name="DollarSign" size={12} /> {tender.budget}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="btn-outline text-xs py-2 px-4"><Icon name="FileText" size={13} /> Документы</button>
                  {tender.status === "active" && <button className="btn-primary text-xs py-2 px-4">Подать заявку</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Docs ─────────────────────────────────────────────────────────────────────
function DocsSection({ user }: { user: User | null }) {
  const categories = ["Все", "Учредительные", "Лицензии", "Сертификаты", "СРО", "Финансы", "Техническая"];
  const [cat, setCat] = useState("Все");
  const filtered = cat === "Все" ? DOCS : DOCS.filter(d => d.category === cat);

  return (
    <div>
      <PageHeader label="Документы" title="Документация" sub="Лицензии, сертификаты и корпоративные документы компании." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {!user && (
            <div className="rounded-2xl p-4 mb-8 flex items-center gap-3"
              style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
              <Icon name="Lock" size={16} style={{ color: MUT }} />
              <span style={{ fontSize: ".85rem", color: MUT }}>Некоторые документы доступны только авторизованным пользователям.</span>
            </div>
          )}
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  fontFamily: "'Inter',sans-serif",
                  background: cat === c ? INK : "#F7F8FC",
                  color: cat === c ? "#fff" : MUT,
                  border: `1.5px solid ${cat === c ? INK : "#E4E8F0"}`,
                }}>
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {filtered.map(doc => {
              const restricted = (doc as typeof doc & { restricted?: boolean }).restricted && !user;
              return (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl transition-all"
                  style={{ border: "1px solid #E4E8F0", opacity: restricted ? .55 : 1 }}
                  onMouseEnter={e => { if (!restricted) (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,102,255,.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ fontFamily: "'Inter',sans-serif", background: doc.type === "PDF" ? "rgba(239,68,68,.08)" : "rgba(34,197,94,.08)", color: doc.type === "PDF" ? "#ef4444" : "#16a34a" }}>
                      {doc.type}
                    </div>
                    <div>
                      <div className="flex items-center gap-2" style={{ fontWeight: 600, fontSize: ".88rem", color: INK, fontFamily: "'Inter',sans-serif" }}>
                        {doc.name}
                        {(doc as typeof doc & { restricted?: boolean }).restricted && <Icon name="Lock" size={12} style={{ color: B }} />}
                      </div>
                      <div style={{ fontSize: ".75rem", color: MUT, marginTop: 2 }}>{doc.category} · {doc.size} · {doc.date}</div>
                    </div>
                  </div>
                  <button style={{ color: restricted ? "#ccd4e0" : B, fontSize: ".8rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}
                    className="flex items-center gap-1.5" disabled={!!restricted}>
                    <Icon name={restricted ? "Lock" : "Download"} size={13} />
                    {restricted ? "Войдите" : "Скачать"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
function ContactsSection() {
  const offices = [
    { city: "Москва (Главный офис)", address: "г. Москва, ул. Климашкина 22 с 2", phone: "+7 (495) 940-07-03", email: "info@ao-urst.ru" },
    { city: "Санкт-Петербург", address: "Невский пр., д. 112, оф. 304", phone: "+7 (812) 940-07-03", email: "spb@ao-urst.ru" },
    { city: "Екатеринбург", address: "ул. Ленина, д. 52, оф. 201", phone: "+7 (343) 940-07-03", email: "ekb@ao-urst.ru" },
  ];

  return (
    <div>
      <PageHeader label="Связь" title="Контакты" sub="Мы работаем по всей России. Напишите или позвоните." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <div className="section-label mb-2">Форма связи</div>
            <div className="accent-bar mb-5" />
            <h2 className="section-title mb-7">Написать нам</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Имя</label>
                  <input className="field" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Компания</label>
                  <input className="field" placeholder="Название компании" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email</label>
                <input type="email" className="field" placeholder="email@company.ru" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Телефон</label>
                <input className="field" placeholder="+7 (___) ___-__-__" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Тема</label>
                <select className="field">
                  <option>Строительный проект</option>
                  <option>Участие в тендере</option>
                  <option>Партнёрство</option>
                  <option>Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Сообщение</label>
                <textarea className="field" rows={4} placeholder="Опишите ваш запрос…" />
              </div>
              <button className="btn-primary w-full justify-center">Отправить сообщение <Icon name="Send" size={14} /></button>
            </div>
          </div>

          {/* Offices */}
          <div>
            <div className="section-label mb-2">Офисы</div>
            <div className="accent-bar mb-5" />
            <h2 className="section-title mb-7">Наши офисы</h2>
            <div className="space-y-3 mb-6">
              {offices.map((o, i) => (
                <div key={i} className="card-lift p-5 rounded-2xl" style={{ border: "1px solid #E4E8F0" }}>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: B, marginBottom: 10 }}>{o.city}</h3>
                  <div className="space-y-2" style={{ fontSize: ".85rem", color: MUT }}>
                    <div className="flex items-start gap-2.5"><Icon name="MapPin" size={13} className="mt-0.5 flex-shrink-0" style={{ color: INK }} /> {o.address}</div>
                    <div className="flex items-center gap-2.5"><Icon name="Phone" size={13} style={{ color: INK }} /> {o.phone}</div>
                    <div className="flex items-center gap-2.5"><Icon name="Mail" size={13} style={{ color: INK }} /> {o.email}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-6" style={{ background: INK }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: "#fff", marginBottom: 8 }}>Горячая линия</h3>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#3385FF", letterSpacing: "-.02em" }}>+7 (495) 940-07-03</div>
              <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 4 }}>Пн–Пт, 9:00–18:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Superadmin Dashboard ─────────────────────────────────────────────────────
function SuperAdminDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const statCards = [
    { icon: "Newspaper", label: "Новости", value: 12, sub: "+3 за неделю", color: "#0066FF" },
    { icon: "HardHat", label: "Проекты", value: 8, sub: "+2 за месяц", color: "#8b5cf6" },
    { icon: "FileText", label: "Тендеры", value: 5, sub: "+1 за неделю", color: "#f59e0b" },
    { icon: "Users", label: "Пользователи", value: 45, sub: "+5 за неделю", color: "#10b981" },
  ];
  const recentNews = [
    { title: "Завершено строительство моста", date: "15.04.2026", draft: false },
    { title: "Получен сертификат ISO 9001", date: "10.04.2026", draft: false },
    { title: "Новый проект метро", date: "—", draft: true },
  ];
  const recentUsers = [
    { name: "Иванов И.", when: "сегодня" },
    { name: "Петров П.", when: "вчера" },
    { name: "Сидорова А.", when: "2 дня назад" },
  ];
  const actions = [
    { icon: "Plus", label: "Добавить новость" },
    { icon: "Plus", label: "Добавить проект" },
    { icon: "Plus", label: "Добавить тендер" },
    { icon: "UserPlus", label: "Добавить пользователя" },
    { icon: "FilePlus", label: "Добавить документ" },
    { icon: "Settings", label: "Настройки" },
  ];

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
      {/* Top bar */}
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Дашборд АО УРСТ</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Панель суперадминистратора</div>
          </div>
          <div style={{ fontSize: ".88rem", color: "rgba(255,255,255,.7)", fontFamily: "'Inter',sans-serif" }}>
            Здравствуйте, <span style={{ color: "#fff", fontWeight: 600 }}>{user.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 card-lift" style={{ border: "1px solid #E4E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "18", marginBottom: 12 }} className="flex items-center justify-center">
                <Icon name={s.icon as "Users"} size={20} style={{ color: s.color }} />
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: INK, letterSpacing: "-.03em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 600, color: INK, fontFamily: "'Inter',sans-serif", marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: ".72rem", color: s.color, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Badges row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3" style={{ border: "1px solid #E4E8F0" }}>
            <Icon name="FileEdit" size={18} style={{ color: "#f59e0b" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".88rem", color: INK }}>Черновики: <span style={{ color: "#f59e0b" }}>2</span></span>
          </div>
          <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3" style={{ border: "1px solid #E4E8F0" }}>
            <Icon name="Clock" size={18} style={{ color: "#ef4444" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".88rem", color: INK }}>Скоро закрываются тендеры: <span style={{ color: "#ef4444" }}>3</span></span>
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние новости</div>
            <div className="space-y-2.5">
              {recentNews.map((n, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.draft ? "#f59e0b" : B, flexShrink: 0 }} />
                  <span style={{ fontSize: ".85rem", color: INK, flex: 1 }}>{n.title}</span>
                  {n.draft ? (
                    <span style={{ fontSize: ".7rem", background: "rgba(245,158,11,.1)", color: "#f59e0b", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>черновик</span>
                  ) : (
                    <span style={{ fontSize: ".72rem", color: MUT }}>{n.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние пользователи</div>
            <div className="space-y-2.5">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: B + "18", flexShrink: 0 }} className="flex items-center justify-center">
                    <Icon name="User" size={14} style={{ color: B }} />
                  </div>
                  <span style={{ fontSize: ".85rem", color: INK, flex: 1 }}>{u.name}</span>
                  <span style={{ fontSize: ".72rem", color: MUT }}>{u.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Быстрые действия</div>
          <div className="flex flex-wrap gap-3">
            {actions.map((a, i) => (
              <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: INK }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B; (e.currentTarget as HTMLElement).style.color = B; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; (e.currentTarget as HTMLElement).style.color = INK; }}>
                <Icon name={a.icon as "Plus"} size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ContentAdmin Dashboard ───────────────────────────────────────────────────
function ContentAdminDashboard({ user }: { user: User }) {
  const statCards = [
    { icon: "Newspaper", label: "Новости", value: 12, sub: "+3 за неделю", color: "#0066FF" },
    { icon: "HardHat", label: "Проекты", value: 8, sub: "+2 за месяц", color: "#8b5cf6" },
    { icon: "FileText", label: "Тендеры", value: 5, sub: "+1 за неделю", color: "#f59e0b" },
  ];
  const recentNews = [
    { title: "Завершено строительство моста", date: "15.04.2026", draft: false },
    { title: "Получен сертификат ISO 9001", date: "10.04.2026", draft: false },
    { title: "Новый проект метро (черновик)", date: "—", draft: true, own: true },
  ];
  const actions = [
    { icon: "Plus", label: "Добавить новость" },
    { icon: "Plus", label: "Добавить проект" },
  ];

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
      {/* Top bar */}
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Дашборд АО УРСТ</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Панель контент-администратора</div>
          </div>
          <div style={{ fontSize: ".88rem", color: "rgba(255,255,255,.7)", fontFamily: "'Inter',sans-serif" }}>
            Здравствуйте, <span style={{ color: "#fff", fontWeight: 600 }}>{user.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 card-lift" style={{ border: "1px solid #E4E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "18", marginBottom: 12 }} className="flex items-center justify-center">
                <Icon name={s.icon as "Users"} size={20} style={{ color: s.color }} />
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: INK, letterSpacing: "-.03em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 600, color: INK, fontFamily: "'Inter',sans-serif", marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: ".72rem", color: s.color, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3" style={{ border: "1px solid #E4E8F0" }}>
            <Icon name="FileEdit" size={18} style={{ color: "#f59e0b" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".88rem", color: INK }}>Черновики: <span style={{ color: "#f59e0b" }}>2</span></span>
          </div>
          <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3" style={{ border: "1px solid #E4E8F0" }}>
            <Icon name="Clock" size={18} style={{ color: "#ef4444" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".88rem", color: INK }}>Скоро закрываются тендеры: <span style={{ color: "#ef4444" }}>3</span></span>
          </div>
        </div>

        {/* News table */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние новости</div>
          <div className="space-y-3">
            {recentNews.map((n, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.draft ? "#f59e0b" : B, flexShrink: 0 }} />
                <span style={{ fontSize: ".85rem", color: INK, flex: 1 }}>{n.title}</span>
                {n.draft ? (
                  <div className="flex items-center gap-2">
                    {n.own && <span style={{ fontSize: ".7rem", color: MUT }}>← только вы видите</span>}
                    <span style={{ fontSize: ".7rem", background: "rgba(245,158,11,.1)", color: "#f59e0b", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>черновик</span>
                  </div>
                ) : (
                  <span style={{ fontSize: ".72rem", color: MUT }}>{n.date}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Быстрые действия</div>
          <div className="flex flex-wrap gap-3">
            {actions.map((a, i) => (
              <button key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: INK }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B; (e.currentTarget as HTMLElement).style.color = B; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; (e.currentTarget as HTMLElement).style.color = INK; }}>
                <Icon name={a.icon as "Plus"} size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ go }: { go: (s: Section) => void }) {
  const labels: Record<Section, string> = { home: "Главная", about: "О компании", projects: "Проекты", news: "Новости", tenders: "Тендеры", docs: "Документация", contacts: "Контакты" };
  return (
    <footer style={{ background: "#05091A", borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ borderRadius: 7, overflow: "hidden", boxShadow: "0 4px 10px rgba(0,102,255,.35)" }} className="flex-shrink-0">
              <img src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/f7e42cde-bc9f-49ef-9ea5-01f05ae05665.png"
                alt="АО УРСТ" style={{ height: 30, width: "auto", display: "block" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "#fff" }}>АО УРСТ</div>
              <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.3)", letterSpacing: ".05em" }}>с 2013 года</div>
            </div>
          </div>
          <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.3)", lineHeight: 1.65 }}>Полный цикл строительства от проектирования до сдачи объекта.</p>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Навигация</div>
          <div className="space-y-2">
            {(["home", "about", "projects", "news"] as Section[]).map(s => (
              <button key={s} onClick={() => go(s)} style={{ display: "block", fontSize: ".82rem", color: "rgba(255,255,255,.45)", fontFamily: "'Golos Text',sans-serif" }}
                className="hover:text-white transition-colors">{labels[s]}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.3)", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Контакты</div>
          <div className="space-y-2.5" style={{ fontSize: ".82rem", color: "rgba(255,255,255,.4)" }}>
            <div className="flex items-center gap-2"><Icon name="Phone" size={11} /> +7 (495) 940-07-03</div>
            <div className="flex items-center gap-2"><Icon name="Mail" size={11} /> info@ao-urst.ru</div>
            <div className="flex items-center gap-2"><Icon name="MapPin" size={11} /> г. Москва, ул. Климашкина 22 с 2</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)" }} className="py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.2)", fontFamily: "'Inter',sans-serif" }}>
            © 2026 АО «УРСТ». Все права защищены.
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.4)", fontFamily: "'Inter',sans-serif" }}>Входит в группу</span>
            <img
              src="https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/13ef7463-bb6a-411e-a582-2df6633a7c73.png"
              alt="Мосинжпроект"
              style={{ height: 26, width: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);

  const go = (s: Section) => { setSection(s); setMob(false); };

  const logout = () => { setUser(null); go("home"); };

  // Суперадмин видит только дашборд
  if (user?.role === "superadmin") {
    return (
      <div>
        <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} />
        <SuperAdminDashboard user={user} onLogout={logout} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
      </div>
    );
  }

  // Контент-админ видит дашборд
  if (user?.role === "contentadmin") {
    return (
      <div>
        <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} />
        <ContentAdminDashboard user={user} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
      </div>
    );
  }

  return (
    <div>
      <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} />
      <main>
        {section === "home"     && <HomeSection go={go} />}
        {section === "about"    && <AboutSection />}
        {section === "projects" && <ProjectsSection />}
        {section === "news"     && <NewsSection />}
        {section === "tenders"  && <TendersSection user={user} />}
        {section === "docs"     && <DocsSection user={user} />}
        {section === "contacts" && <ContactsSection />}
      </main>
      <Footer go={go} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
    </div>
  );
}