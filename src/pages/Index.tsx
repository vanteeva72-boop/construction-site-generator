import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "about" | "projects" | "news" | "tenders" | "docs" | "contacts" | "cabinet";
type UserRole = "superadmin" | "contentadmin" | "user" | null;
interface User { name: string; role: UserRole; email: string; phone?: string; company?: string; }

interface Message {
  id: number;
  date: string;
  subject: string;
  text: string;
  reply?: string;
  replyDate?: string;
}

interface TenderApp {
  id: number;
  date: string;
  tenderTitle: string;
  company: string;
  inn: string;
  status: "pending" | "review" | "accepted" | "rejected";
  feedback?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, title: "Парк «Зарядье»", type: "ПГС", year: 2018, area: "83 850 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/10fe1108-41e2-4553-953a-cb83313f04c8.jpg", status: "Сдан" },
  { id: 7, title: "Дворец гимнастики Ирины Винер-Усмановой", type: "ПГС", year: 2019, area: "25 730 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/582f8aa5-35a9-400f-b230-6632fc6056e0.jpg", status: "Сдан" },
  { id: 2, title: "Участок метро «Южная – Коммунарка»", type: "Метро и тоннели", year: 2019, area: "6.4 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/03ec1b03-d6a3-43b2-bece-dab3c668cab4.jpg", status: "Сдан" },
  { id: 3, title: "Московский скоростной диаметр (МСД)", type: "Дорожное строительство", year: 2026, area: "13,5 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/194d7c9e-67dc-4f48-a1b5-274d467f3c76.jpg", status: "В процессе" },
  { id: 5, title: "Транспортная система Мнёвниковской поймы", type: "Дорожное строительство", year: 2026, area: "11,7 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/194d7c9e-67dc-4f48-a1b5-274d467f3c76.jpg", status: "В процессе" },
  { id: 4, title: "Инженерная инфраструктура АДЦ «Коммунарка»", type: "Инженерная инфраструктура", year: 2023, area: "18 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Сдан" },
];
const NEWS = [
  { id: 1, date: "18 апреля 2026", category: "Компания", title: "АО УРСТ вошло в топ-10 строительных компаний России", text: "По итогам ежегодного рейтинга отраслевого портала, компания заняла 7-е место среди крупнейших строительных организаций страны.", full: "По итогам ежегодного рейтинга отраслевого портала «СтройРейтинг», АО «УРСТ» заняло 7-е место среди крупнейших строительных организаций России по объёму выполненных работ за 2025 год.\n\nВ рейтинге оцениваются финансовая устойчивость, количество завершённых объектов, соблюдение сроков и качество работ. В этом году компания поднялась на три позиции по сравнению с прошлым годом.\n\nГенеральный директор АО «УРСТ» отметил, что данное достижение — результат слаженной работы всего коллектива и чёткого следования стратегии устойчивого развития. В ближайшие годы компания планирует войти в топ-5 ведущих строительных организаций страны, расширив портфель проектов в сфере транспортной и инженерной инфраструктуры." },
  { id: 2, date: "10 апреля 2026", category: "Проекты", title: "Начало строительства нового участка метро на севере города", text: "На этой неделе официально стартовал один из крупнейших транспортных проектов этого года — участок метро протяжённостью 4.2 км.", full: "На этой неделе официально стартовал один из крупнейших транспортных проектов текущего года — строительство нового участка метро на севере Москвы протяжённостью 4.2 км с тремя новыми станциями.\n\nАО «УРСТ» выступает генеральным подрядчиком по тоннельным и отделочным работам. Контракт предусматривает строительство перегонных тоннелей методом щитовой проходки, возведение станционных комплексов и монтаж инженерных систем.\n\nСрок завершения работ — IV квартал 2027 года. Общий объём финансирования составляет порядка 18 млрд рублей. На объекте будет задействовано более 800 специалистов компании." },
  { id: 3, date: "2 апреля 2026", category: "Тендеры", title: "Победа в государственном тендере на строительство дороги", text: "Наша компания одержала победу в конкурсе на возведение участка автомагистрали. Стоимость контракта — 2.1 млрд рублей.", full: "АО «УРСТ» одержало победу в открытом государственном конкурсе на строительство участка автомагистрали протяжённостью 12.4 км в Подмосковье. Стоимость контракта составила 2.1 млрд рублей.\n\nВ рамках проекта планируется возведение двухполосного шоссе с расширением до четырёх полос, строительство двух транспортных развязок, двух путепроводов и системы ливневой канализации. Дорога свяжет два крупных жилых массива и снизит транспортную нагрузку на существующие артерии.\n\nСрок выполнения работ — 24 месяца с момента подписания контракта. Проектная документация уже разработана и прошла государственную экспертизу." },
  { id: 4, date: "25 марта 2026", category: "Компания", title: "Открытие нового регионального офиса в Москве", text: "В рамках стратегии расширения географии присутствия открылся наш новый офис в Москве по адресу ул. 5-я Магистральная, 10.", full: "В марте 2026 года АО «УРСТ» открыло новый офис в Москве по адресу ул. 5-я Магистральная, 10. Расширение географии присутствия продиктовано ростом портфеля проектов в столичном регионе.\n\nВ новом офисе разместятся проектный отдел, отдел по работе с заказчиками и технический надзор. Площадь офиса составляет 480 кв. м, здесь будет работать более 60 сотрудников.\n\nОткрытие нового офиса позволит компании оперативнее взаимодействовать с заказчиками и партнёрами, а также усилить присутствие в Московском регионе, который является ключевым для стратегии развития АО «УРСТ» на ближайшие пять лет." },
];
const TENDERS = [
  { id: 1, title: "Строительство тоннельного участка метро", deadline: "15 мая 2026", budget: "от 4.5 млрд ₽", type: "Открытый конкурс", status: "active" },
  { id: 2, title: "Реконструкция инженерных сетей", deadline: "28 мая 2026", budget: "от 45 млн ₽", type: "Запрос котировок", status: "active" },
  { id: 3, title: "Строительство автомобильной дороги II категории", deadline: "5 июня 2026", budget: "от 780 млн ₽", type: "Открытый конкурс", status: "active" },
  { id: 4, title: "Проектирование объектов инфраструктуры", deadline: "20 апреля 2026", budget: "от 8 млн ₽", type: "Запрос котировок", status: "closed" },
  { id: 5, title: "Поставка строительных материалов 2026", deadline: "1 апреля 2026", budget: "от 62 млн ₽", type: "Открытый конкурс", status: "closed" },
];
const DOCS_SECTIONS = [
  {
    id: "contractors",
    title: "Подрядным организациям",
    icon: "HardHat",
    docs: [
      { id: 1, name: "Регламент ИД", type: "PDF", size: "1.2 МБ" },
      { id: 2, name: "Соглашение КОТПБиООС", type: "PDF", size: "0.9 МБ" },
      { id: 3, name: "Стандарт ЭК", type: "PDF", size: "0.7 МБ" },
      { id: 4, name: "Положение о закупках", type: "PDF", size: "1.4 МБ" },
    ],
  },
  {
    id: "pricelist",
    title: "Прайс-лист на услуги техники с экипажем и оборудования",
    icon: "Receipt",
    docs: [
      { id: 5, name: "Прайс-лист", type: "PDF", size: "0.6 МБ" },
    ],
  },
  {
    id: "certs",
    title: "Сертификаты соответствия ИСМ",
    icon: "BadgeCheck",
    docs: [
      { id: 6, name: "ISO 9001:2015", type: "PDF", size: "0.8 МБ" },
      { id: 7, name: "ISO 14001:2015", type: "PDF", size: "0.8 МБ" },
      { id: 8, name: "ISO 45001:2018", type: "PDF", size: "0.8 МБ" },
    ],
  },
  {
    id: "personaldata",
    title: "Положение об обработке и защите персональных данных работников",
    icon: "ShieldCheck",
    docs: [
      { id: 9, name: "Защита персональных данных", type: "PDF", size: "1.1 МБ" },
    ],
  },
  {
    id: "labor",
    title: "Охрана труда",
    icon: "HardHat",
    subsections: [
      {
        id: "soут",
        title: "СОУТ — Специальная Оценка Условий Труда",
        docs: [
          { id: 10, name: "Перечень мероприятий 17.03.2025", type: "PDF", size: "0.9 МБ" },
          { id: 11, name: "Сводная ведомость 17.03.2025", type: "PDF", size: "1.3 МБ" },
          { id: 12, name: "Перечень мероприятий 15.11.2025", type: "PDF", size: "0.9 МБ" },
          { id: 13, name: "Сводная ведомость 15.11.2025", type: "PDF", size: "1.3 МБ" },
        ],
      },
      {
        id: "policies",
        title: 'Политики АО "Мосинжпроект" применяемые в АО "УРСТ"',
        docs: [
          { id: 14, name: "Политика в области употребления алкоголя, наркотических и психотропных веществ", type: "PDF", size: "0.5 МБ" },
          { id: 15, name: "Политика о вмешательстве в опасные ситуации. Право на приостановку (прекращение) работ", type: "PDF", size: "0.6 МБ" },
          { id: 16, name: 'Политика интегрированной системы менеджмента АО "Мосинжпроект" и его дочерних обществ', type: "PDF", size: "0.7 МБ" },
        ],
      },
      {
        id: "ecology",
        title: "Охрана окружающей среды / Экологические аспекты",
        docs: [
          { id: 17, name: "Реестр экологических аспектов", type: "PDF", size: "1.0 МБ" },
        ],
      },
    ],
  },
];

const B = "#0066FF";   // accent blue
const INK = "#0A0F1E"; // dark text
const MUT = "#6B7896"; // muted

// ─── Site Config ──────────────────────────────────────────────────────────────
interface SiteConfig {
  siteName: string;
  logoUrl: string;
  phone: string;
  email: string;
  schedule: string;
  address: string;
  footerCopyright: string;
  footerDesc: string;
}
const DEFAULT_LOGO = "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/f7e42cde-bc9f-49ef-9ea5-01f05ae05665.png";
const DEFAULT_CONFIG: SiteConfig = {
  siteName: "АО УРСТ",
  logoUrl: DEFAULT_LOGO,
  phone: "+7 (495) 940-07-03",
  email: "info@ao-urst.ru",
  schedule: "Пн–Пт, 9:00–18:00",
  address: "г. Москва, ул. Климашкина 22 с 2",
  footerCopyright: "© 2026 АО «УРСТ». Все права защищены.",
  footerDesc: "Полный цикл строительства от проектирования до сдачи объекта.",
};

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (email === "super@ao-urst.ru" && pw === "super123") onLogin({ name: "Иван", role: "superadmin", email, phone: "+7 (495) 000-00-01" });
    else if (email === "admin@ao-urst.ru" && pw === "admin123") onLogin({ name: "Мария Иванова", role: "contentadmin", email, phone: "+7 (495) 000-00-02" });
    else if (email === "user@ao-urst.ru" && pw === "user123") onLogin({ name: "Сергей Попов", role: "user", email, phone: "+7 (916) 234-56-78", company: "ООО СтройПроект" });
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
function Header({ active, go, user, onLogin, onLogout, mob, setMob, cfg }: {
  active: Section; go: (s: Section) => void; user: User | null;
  onLogin: () => void; onLogout: () => void; mob: boolean; setMob: (v: boolean) => void;
  cfg: SiteConfig;
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
            <span className="flex items-center gap-1.5"><Icon name="Phone" size={11} /> {cfg.phone}</span>
            <span className="flex items-center gap-1.5"><Icon name="Mail" size={11} /> {cfg.email}</span>
          </div>
          <span className="text-white flex items-center gap-1.5" style={{ fontSize: ".75rem", fontFamily: "'Inter',sans-serif", opacity: .7 }}>
            <Icon name="Clock" size={11} /> {cfg.schedule}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => go("home")} className="flex items-center gap-3 group">
          <div style={{ borderRadius: 8, boxShadow: "0 4px 12px rgba(0,102,255,.4)", overflow: "hidden", background: "transparent" }}
            className="flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <img src={cfg.logoUrl} alt={cfg.siteName} style={{ height: 34, width: "auto", display: "block" }} />
          </div>
          <div className="leading-tight">
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: ".95rem", color: "#fff", letterSpacing: "-.01em" }}>{cfg.siteName}</div>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => user.role === "user" ? go("cabinet") : undefined}
                className={`hidden md:flex items-center gap-2.5 ml-1 rounded-xl px-2 py-1 transition-all ${user.role === "user" ? "cursor-pointer hover:bg-white/10" : ""}`}
                style={{ background: active === "cabinet" && user.role === "user" ? "rgba(255,255,255,.12)" : "transparent" }}>
                <div style={{ background: B, width: 30, height: 30, borderRadius: 7, fontSize: ".8rem", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}
                  className="flex items-center justify-center text-white flex-shrink-0">{user.name.charAt(0)}</div>
                <div className="text-left">
                  <div style={{ color: "#fff", fontSize: ".8rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
                  <div style={{ fontSize: ".68rem", fontFamily: "'Inter',sans-serif", color: user.role === "superadmin" ? "#f59e0b" : user.role === "contentadmin" ? "#3385FF" : "rgba(255,255,255,.55)" }}>
                    {user.role === "superadmin" ? "Суперадмин" : user.role === "contentadmin" ? "Контент-админ" : "Личный кабинет →"}
                  </div>
                </div>
              </button>
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
              <div key={n.id} onClick={() => go("news")} className="card-lift bg-white rounded-2xl overflow-hidden group cursor-pointer"
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
  const types = ["Все", "ПГС", "Метро и тоннели", "Дорожное строительство", "Инженерная инфраструктура"];
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
                      style={{ fontFamily: "'Inter',sans-serif", background: p.status === "Сдан" ? "rgba(34,197,94,.85)" : "rgba(0,102,255,.85)", color: "#fff" }}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK, marginBottom: 10, lineHeight: 1.4 }}>{p.title}</h3>
                  <div className="flex gap-4" style={{ fontSize: ".78rem", color: "#4A5568" }}>
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

// ─── News Modal ────────────────────────────────────────────────────────────────
function NewsModal({ news, onClose }: { news: typeof NEWS[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="chip">{news.category}</span>
                <span style={{ fontSize: ".72rem", color: MUT }}>{news.date}</span>
              </div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.2rem", color: INK, lineHeight: 1.4 }}>{news.title}</h2>
            </div>
            <button onClick={onClose} className="flex-shrink-0 rounded-full p-2 hover:bg-gray-100 transition-colors" style={{ color: MUT }}>
              <Icon name="X" size={18} />
            </button>
          </div>
          <div style={{ fontSize: ".9rem", color: "#374151", lineHeight: 1.8 }}>
            {news.full.split("\n\n").map((p, i) => (
              <p key={i} style={{ marginBottom: i < news.full.split("\n\n").length - 1 ? 16 : 0 }}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News ─────────────────────────────────────────────────────────────────────
function NewsSection() {
  const [selected, setSelected] = useState<typeof NEWS[0] | null>(null);

  return (
    <div>
      <PageHeader label="Пресс-центр" title="Новости" sub="Актуальные события компании и отрасли." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {NEWS.map(n => (
                <div key={n.id} onClick={() => setSelected(n)} className="card-lift rounded-2xl overflow-hidden group cursor-pointer" style={{ border: "1px solid #E4E8F0" }}>
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
      {selected && <NewsModal news={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── Tenders ──────────────────────────────────────────────────────────────────
function TenderDocsModal({ tender, onClose }: { tender: typeof TENDERS[0]; onClose: () => void }) {
  const docs = [
    { name: "Тендерная документация", size: "1.8 МБ", icon: "FileText" },
    { name: "Техническое задание", size: "0.9 МБ", icon: "ClipboardList" },
    { name: "Форма заявки", size: "0.4 МБ", icon: "FileInput" },
    { name: "Проект договора", size: "1.1 МБ", icon: "ScrollText" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div style={{ fontSize: ".72rem", color: MUT, marginBottom: 4 }}>Конкурсная документация</div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, lineHeight: 1.4 }}>{tender.title}</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors flex-shrink-0" style={{ color: MUT }}>
              <Icon name="X" size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {docs.map(d => (
              <div key={d.name} className="flex items-center justify-between p-3.5 rounded-xl" style={{ border: "1px solid #E4E8F0" }}>
                <div className="flex items-center gap-3">
                  <Icon name={d.icon} size={16} style={{ color: B }} />
                  <div>
                    <div style={{ fontSize: ".85rem", fontWeight: 600, color: INK, fontFamily: "'Inter',sans-serif" }}>{d.name}</div>
                    <div style={{ fontSize: ".72rem", color: MUT }}>PDF · {d.size}</div>
                  </div>
                </div>
                <a href="#" onClick={e => e.preventDefault()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: "#F0F7FF", color: B, fontSize: ".78rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                  <Icon name="Download" size={13} /> Скачать
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TenderApplyModal({ tender, user, onClose, onSubmit, goToCabinet }: {
  tender: typeof TENDERS[0];
  user: User;
  onClose: () => void;
  onSubmit: (app: Omit<TenderApp, "id">) => void;
  goToCabinet: () => void;
}) {
  const [company, setCompany] = useState(user.company || "");
  const [inn, setInn] = useState("");
  const [fileName, setFileName] = useState("");
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ company?: string; inn?: string }>({});

  const handleSubmit = () => {
    const newErrors: { company?: string; inn?: string } = {};
    if (!company.trim()) newErrors.company = "Введите название компании";
    if (!inn.trim()) newErrors.inn = "Введите ИНН";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onSubmit({
      date: new Date().toLocaleDateString("ru-RU"),
      tenderTitle: tender.title,
      company,
      inn,
      status: "pending",
    });
    setDone(true);
  };

  if (done) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="rounded-full flex items-center justify-center" style={{ width: 60, height: 60, background: "#DCFCE7" }}>
            <Icon name="CheckCircle" size={30} style={{ color: "#16a34a" }} />
          </div>
        </div>
        <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Заявка отправлена</h3>
        <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.7, marginBottom: 20 }}>
          Ваша заявка принята. Пожалуйста, отслеживайте её статус и ответ от компании в личном кабинете.
        </p>
        <button onClick={() => { onClose(); goToCabinet(); }} className="btn-primary justify-center w-full mb-3">
          <Icon name="User" size={14} /> Перейти в личный кабинет
        </button>
        <button onClick={onClose} className="w-full text-sm" style={{ color: MUT }}>Закрыть</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-4" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div style={{ fontSize: ".72rem", color: MUT, marginBottom: 4 }}>Подача заявки</div>
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, lineHeight: 1.4 }}>{tender.title}</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100 transition-colors flex-shrink-0" style={{ color: MUT }}>
              <Icon name="X" size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Название компании *</label>
              <input className="field" value={company} onChange={e => { setCompany(e.target.value); setErrors(p => ({ ...p, company: undefined })); }}
                placeholder="ООО Название" style={{ borderColor: errors.company ? "#ef4444" : undefined }} />
              {errors.company && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.company}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>ИНН *</label>
              <input className="field" value={inn} onChange={e => { setInn(e.target.value); setErrors(p => ({ ...p, inn: undefined })); }}
                placeholder="7700000000" style={{ borderColor: errors.inn ? "#ef4444" : undefined }} />
              {errors.inn && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.inn}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Коммерческое предложение</label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all" style={{ border: "1.5px dashed #CBD5E1" }}>
                <Icon name="Upload" size={16} style={{ color: MUT }} />
                <span style={{ fontSize: ".85rem", color: fileName ? INK : MUT }}>{fileName || "Прикрепить файл (PDF, DOCX)"}</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
            <div className="p-4 rounded-xl" style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
              <div style={{ fontSize: ".75rem", color: MUT, marginBottom: 8, fontWeight: 600, fontFamily: "'Inter',sans-serif", textTransform: "uppercase", letterSpacing: ".06em" }}>Контактное лицо (из профиля)</div>
              <div className="space-y-1.5" style={{ fontSize: ".85rem", color: INK }}>
                <div className="flex items-center gap-2"><Icon name="User" size={13} style={{ color: MUT }} /> {user.name}</div>
                <div className="flex items-center gap-2"><Icon name="Phone" size={13} style={{ color: MUT }} /> {user.phone || "—"}</div>
                <div className="flex items-center gap-2"><Icon name="Mail" size={13} style={{ color: MUT }} /> {user.email}</div>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full justify-center">
              Отправить заявку <Icon name="Send" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TendersSection({ user, onAddApp, go }: { user: User | null; onAddApp: (app: Omit<TenderApp, "id">) => void; go: (s: Section) => void }) {
  const [tab, setTab] = useState<"active" | "closed">("active");
  const [docsModal, setDocsModal] = useState<typeof TENDERS[0] | null>(null);
  const [applyModal, setApplyModal] = useState<typeof TENDERS[0] | null>(null);
  const filtered = TENDERS.filter(t => t.status === tab);

  return (
    <div>
      <PageHeader label="Закупки" title="Тендеры" sub="Актуальные конкурсные процедуры компании." />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {!user && (
            <div className="rounded-2xl p-4 mb-8 flex items-center gap-3" style={{ background: "#FFF8ED", border: "1px solid #FDE68A" }}>
              <Icon name="Info" size={16} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: ".85rem", color: INK }}>Для скачивания документов и подачи заявок необходимо <button onClick={() => {}} className="font-semibold underline" style={{ color: B }}>войти в систему</button>.</span>
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
                  {user
                    ? <button onClick={() => setDocsModal(tender)} className="btn-outline text-xs py-2 px-4"><Icon name="FileText" size={13} /> Документы</button>
                    : <button onClick={() => go("contacts")} className="btn-outline text-xs py-2 px-4"><Icon name="Lock" size={13} /> Документы</button>
                  }
                  {tender.status === "active" && (
                    user
                      ? <button onClick={() => setApplyModal(tender)} className="btn-primary text-xs py-2 px-4">Подать заявку</button>
                      : <button onClick={() => go("contacts")} className="btn-primary text-xs py-2 px-4" style={{ opacity: 0.6 }}>Подать заявку</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {docsModal && <TenderDocsModal tender={docsModal} onClose={() => setDocsModal(null)} />}
      {applyModal && user && (
        <TenderApplyModal
          tender={applyModal}
          user={user}
          onClose={() => setApplyModal(null)}
          onSubmit={app => { onAddApp(app); }}
          goToCabinet={() => { setApplyModal(null); go("cabinet"); }}
        />
      )}
    </div>
  );
}

// ─── Docs ─────────────────────────────────────────────────────────────────────
function DocRow({ doc }: { doc: { id: number; name: string; type: string; size: string } }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl transition-all"
      style={{ border: "1px solid #E4E8F0" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,102,255,.3)"; (e.currentTarget as HTMLElement).style.background = "#F8FBFF"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; (e.currentTarget as HTMLElement).style.background = ""; }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ fontFamily: "'Inter',sans-serif", background: "rgba(239,68,68,.08)", color: "#ef4444" }}>
          PDF
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: ".85rem", color: INK, fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }}>{doc.name}</div>
          <div style={{ fontSize: ".72rem", color: MUT, marginTop: 2 }}>{doc.size}</div>
        </div>
      </div>
      <button className="flex items-center gap-1.5 flex-shrink-0 ml-4"
        style={{ color: B, fontSize: ".8rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
        <Icon name="Download" size={13} /> Скачать
      </button>
    </div>
  );
}

function DocsSection({ user }: { user: User | null }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ contractors: true });
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }));
  const toggleSub = (id: string) => setOpenSub(p => ({ ...p, [id]: !p[id] }));

  return (
    <div>
      <PageHeader label="Документы" title="Документация" sub="Нормативные, технические и корпоративные документы компании." />
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {!user && (
            <div className="rounded-2xl p-4 mb-8 flex items-center gap-3"
              style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
              <Icon name="Lock" size={16} style={{ color: MUT }} />
              <span style={{ fontSize: ".85rem", color: MUT }}>Некоторые документы доступны только авторизованным пользователям.</span>
            </div>
          )}
          <div className="space-y-3">
            {DOCS_SECTIONS.map(section => (
              <div key={section.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
                {/* Section header */}
                <button
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-all"
                  style={{ background: open[section.id] ? "#F0F7FF" : "#fff" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open[section.id] ? B : "#F7F8FC" }}>
                      <Icon name={section.icon as "HardHat"} size={16} style={{ color: open[section.id] ? "#fff" : MUT }} />
                    </div>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".92rem", color: INK, lineHeight: 1.4 }}>{section.title}</span>
                  </div>
                  <Icon name={open[section.id] ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: MUT, flexShrink: 0, marginLeft: 12 }} />
                </button>

                {/* Section body */}
                {open[section.id] && (
                  <div className="px-5 pb-5" style={{ borderTop: "1px solid #E4E8F0" }}>
                    {"subsections" in section ? (
                      <div className="pt-4 space-y-3">
                        {section.subsections!.map(sub => (
                          <div key={sub.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
                            <button
                              onClick={() => toggleSub(sub.id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                              style={{ background: openSub[sub.id] ? "#F7F8FC" : "#fff" }}>
                              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".85rem", color: INK }}>{sub.title}</span>
                              <Icon name={openSub[sub.id] ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: MUT, flexShrink: 0, marginLeft: 12 }} />
                            </button>
                            {openSub[sub.id] && (
                              <div className="px-4 pb-4 space-y-2" style={{ borderTop: "1px solid #E4E8F0", paddingTop: 12 }}>
                                {sub.docs.map(doc => <DocRow key={doc.id} doc={doc} />)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-4 space-y-2">
                        {section.docs!.map(doc => <DocRow key={doc.id} doc={doc} />)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
function ContactsSection({ user, onLogin, onSend }: { user: User | null; onLogin: () => void; onSend: (subject: string, text: string) => void }) {
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("Строительный проект");
  const [msgText, setMsgText] = useState("");
  const [cName, setCName] = useState(user?.name || "");
  const [cEmail, setCEmail] = useState(user?.email || "");
  const [cPhone, setCPhone] = useState(user?.phone || "");
  const [cCompany, setCCompany] = useState(user?.company || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const offices = [
    { city: "Москва (Главный офис)", address: "г. Москва, ул. Климашкина 22 с 2", phone: "+7 (495) 940-07-03", email: "info@ao-urst.ru" },
    { city: "Москва (Офис)", address: "г. Москва, ул. 5-я Магистральная 10", phone: "+7 (495) 374-18-92", email: "office2@ao-urst.ru" },
  ];

  const handleSend = () => {
    const errs: Record<string, string> = {};
    if (!cName.trim()) errs.name = "Укажите ваше имя";
    if (!cEmail.trim()) errs.email = "Укажите email";
    if (!cPhone.trim()) errs.phone = "Укажите телефон";
    if (!msgText.trim()) errs.text = "Напишите сообщение";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    onSend(subject, msgText);
    setSent(true);
  };

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
            {sent ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: "#F0F7FF", border: "1px solid #C7DDFF" }}>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: B }}>
                    <Icon name="CheckCircle" size={28} style={{ color: "#fff" }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Сообщение отправлено</h3>
                {!user ? (
                  <>
                    <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.7, marginBottom: 16 }}>
                      Ответ на ваш запрос вы можете получить, зарегистрировавшись в личном кабинете.
                    </p>
                    <button onClick={onLogin} className="btn-primary justify-center">
                      Войти в личный кабинет <Icon name="ArrowRight" size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.7, marginBottom: 16 }}>
                      Сообщение сохранено. Ответ появится в вашем личном кабинете.
                    </p>
                  </>
                )}
                <button onClick={() => setSent(false)} className="mt-4 block mx-auto text-xs" style={{ color: MUT }}>Отправить ещё одно сообщение</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Имя *</label>
                    <input className="field" placeholder="Ваше имя" value={cName} onChange={e => { setCName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                      style={{ borderColor: errors.name ? "#ef4444" : undefined }} />
                    {errors.name && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Компания</label>
                    <input className="field" placeholder="Название компании" value={cCompany} onChange={e => setCCompany(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email *</label>
                  <input type="email" className="field" placeholder="email@company.ru" value={cEmail} onChange={e => { setCEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                    style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
                  {errors.email && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Телефон *</label>
                  <input className="field" placeholder="+7 (___) ___-__-__" value={cPhone} onChange={e => { setCPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }}
                    style={{ borderColor: errors.phone ? "#ef4444" : undefined }} />
                  {errors.phone && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Тема</label>
                  <select className="field" value={subject} onChange={e => setSubject(e.target.value)}>
                    <option>Строительный проект</option>
                    <option>Участие в тендере</option>
                    <option>Партнёрство</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Сообщение *</label>
                  <textarea className="field" rows={4} placeholder="Опишите ваш запрос…" value={msgText} onChange={e => { setMsgText(e.target.value); setErrors(p => ({ ...p, text: "" })); }}
                    style={{ borderColor: errors.text ? "#ef4444" : undefined }} />
                  {errors.text && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.text}</p>}
                </div>
                <button onClick={handleSend} className="btn-primary w-full justify-center">Отправить сообщение <Icon name="Send" size={14} /></button>
              </div>
            )}
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

            {/* Реквизиты */}
            <div className="rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14 }}>Реквизиты</h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".82rem", color: INK, marginBottom: 12 }}>
                Акционерное общество «Управление развития строительных технологий»
              </p>
              <div className="space-y-2" style={{ fontSize: ".82rem" }}>
                {[
                  ["ИНН", "7703800010"],
                  ["КПП", "770301001"],
                  ["ОГРН", "5137746040372"],
                  ["ОКПО", "03994521"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4" style={{ borderBottom: "1px solid #F0F2F7", paddingBottom: 6 }}>
                    <span style={{ color: MUT }}>{k}</span>
                    <span style={{ color: INK, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid #E4E8F0" }}>
                  <div style={{ fontSize: ".75rem", color: MUT, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Банковские реквизиты</div>
                  {[
                    ["Расчётный счёт", "40702810638170022413"],
                    ["Банк", "ПАО СБЕРБАНК"],
                    ["БИК", "044525225"],
                    ["Корр. счёт", "30101810400000000225"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 mb-1.5">
                      <span style={{ color: MUT }}>{k}</span>
                      <span style={{ color: INK, fontWeight: 600, fontFamily: "'Inter',sans-serif", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-label mb-2">Расположение</div>
          <div className="accent-bar mb-5" />
          <h2 className="section-title mb-7">На карте</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E8F0", height: 400 }}>
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=37.543%2C55.766&z=14&pt=37.559600%2C55.760600%2Cpm2rdl1~37.526375%2C55.772451%2Cpm2rdl2&l=map"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              title="Офисы АО УРСТ на карте"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Cabinet ─────────────────────────────────────────────────────────────
function UserCabinet({ user, setUser, messages, tenderApps, go }: {
  user: User;
  setUser: (u: User) => void;
  messages: Message[];
  tenderApps: TenderApp[];
  go: (s: Section) => void;
}) {
  const [tab, setTab] = useState<"profile" | "messages" | "apps">("profile");
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user.phone || "");
  const [company, setCompany] = useState(user.company || "");
  const [name, setName] = useState(user.name);

  const statusLabel: Record<TenderApp["status"], string> = {
    pending: "На рассмотрении",
    review: "Изучается",
    accepted: "Принята",
    rejected: "Отклонена",
  };
  const statusColor: Record<TenderApp["status"], string> = {
    pending: "#f59e0b",
    review: "#3b82f6",
    accepted: "#16a34a",
    rejected: "#ef4444",
  };

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div style={{ background: B, width: 52, height: 52, borderRadius: 14, fontSize: "1.3rem", fontFamily: "'Inter',sans-serif", fontWeight: 800 }}
            className="flex items-center justify-center text-white flex-shrink-0">{user.name.charAt(0)}</div>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: INK }}>{user.name}</div>
            <div style={{ fontSize: ".8rem", color: MUT }}>Личный кабинет</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ background: "#fff", border: "1px solid #E4E8F0" }}>
          {([
            { key: "profile", label: "Профиль", icon: "User" },
            { key: "messages", label: "Сообщения", icon: "Mail" },
            { key: "apps", label: "Заявки", icon: "FileText" },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                fontFamily: "'Inter',sans-serif",
                background: tab === t.key ? INK : "transparent",
                color: tab === t.key ? "#fff" : MUT,
              }}>
              <Icon name={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid #E4E8F0" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Личные данные</h2>
              {!editing
                ? <button onClick={() => setEditing(true)} className="btn-outline text-xs py-2 px-4"><Icon name="Pencil" size={13} /> Редактировать</button>
                : <div className="flex gap-2">
                    <button onClick={() => {
                      setUser({ ...user, name, phone, company });
                      setEditing(false);
                    }} className="btn-primary text-xs py-2 px-4"><Icon name="Check" size={13} /> Сохранить</button>
                    <button onClick={() => setEditing(false)} className="btn-outline text-xs py-2 px-4">Отмена</button>
                  </div>
              }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Имя и фамилия", value: name, setter: setName, field: "name" },
                { label: "Email", value: user.email, setter: () => {}, field: "email", readonly: true },
                { label: "Телефон", value: phone, setter: setPhone, field: "phone" },
                { label: "Компания", value: company, setter: setCompany, field: "company" },
              ].map(({ label, value, setter, readonly }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>{label}</label>
                  {editing && !readonly
                    ? <input className="field" value={value} onChange={e => setter(e.target.value)} />
                    : <div className="px-3 py-2.5 rounded-xl" style={{ background: "#F7F8FC", fontSize: ".88rem", color: INK, fontFamily: "'Golos Text',sans-serif" }}>{value || "—"}</div>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {tab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #E4E8F0" }}>
                <Icon name="Mail" size={32} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ color: MUT, fontSize: ".88rem" }}>Вы ещё не отправляли сообщений.</p>
                <button onClick={() => go("contacts")} className="btn-primary mt-4 justify-center text-xs py-2 px-5">Написать нам</button>
              </div>
            ) : messages.map(m => (
              <div key={m.id} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK }}>{m.subject}</h3>
                  <span style={{ fontSize: ".72rem", color: MUT, flexShrink: 0 }}>{m.date}</span>
                </div>
                <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.7 }}>{m.text}</p>
                {m.reply ? (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: "#F0F7FF", borderLeft: `3px solid ${B}` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="MessageSquare" size={13} style={{ color: B }} />
                      <span style={{ fontSize: ".75rem", fontWeight: 700, color: B, fontFamily: "'Inter',sans-serif" }}>Ответ от АО УРСТ · {m.replyDate}</span>
                    </div>
                    <p style={{ fontSize: ".85rem", color: INK, lineHeight: 1.7 }}>{m.reply}</p>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1.5" style={{ fontSize: ".75rem", color: "#f59e0b" }}>
                    <Icon name="Clock" size={12} /> Ожидает ответа
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => go("contacts")} className="btn-outline w-full justify-center text-sm mt-2">
              <Icon name="Plus" size={14} /> Написать новое сообщение
            </button>
          </div>
        )}

        {/* Tender Applications */}
        {tab === "apps" && (
          <div className="space-y-4">
            {tenderApps.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid #E4E8F0" }}>
                <Icon name="FileText" size={32} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ color: MUT, fontSize: ".88rem" }}>Вы ещё не подавали заявок на тендеры.</p>
                <button onClick={() => go("tenders")} className="btn-primary mt-4 justify-center text-xs py-2 px-5">Перейти к тендерам</button>
              </div>
            ) : tenderApps.map(app => (
              <div key={app.id} className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK }}>{app.tenderTitle}</h3>
                  <span style={{ fontSize: ".72rem", fontWeight: 700, color: statusColor[app.status], flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
                    ● {statusLabel[app.status]}
                  </span>
                </div>
                <div className="flex gap-4 mb-3" style={{ fontSize: ".8rem", color: MUT }}>
                  <span>{app.company}</span>
                  <span>ИНН: {app.inn}</span>
                  <span>{app.date}</span>
                </div>
                {app.feedback && (
                  <div className="p-4 rounded-xl" style={{ background: "#F0F7FF", borderLeft: `3px solid ${B}` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name="MessageSquare" size={13} style={{ color: B }} />
                      <span style={{ fontSize: ".75rem", fontWeight: 700, color: B, fontFamily: "'Inter',sans-serif" }}>Обратная связь от АО УРСТ</span>
                    </div>
                    <p style={{ fontSize: ".85rem", color: INK }}>{app.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Superadmin: types & helpers ──────────────────────────────────────────────
interface AdminUser {
  id: number; name: string; login: string; email: string; phone: string;
  role: "superadmin" | "contentadmin" | "user"; regDate: string;
  blocked?: boolean;
}

const ROLE_LABELS: Record<string, string> = { superadmin: "Суперадмин", contentadmin: "Контент-админ", user: "Пользователь" };
const ROLE_COLORS: Record<string, string> = { superadmin: "#f59e0b", contentadmin: "#3385FF", user: "#10b981" };

function AdminActionBtn({ icon, label, color, onClick }: { icon: string; label: string; color?: string; onClick: () => void }) {
  return (
    <button title={label} onClick={onClick}
      className="p-1.5 rounded-lg transition-all hover:bg-gray-100"
      style={{ color: color || MUT }}>
      <Icon name={icon as "Edit"} size={15} />
    </button>
  );
}

// ─── Modals for superadmin ────────────────────────────────────────────────────
function AddTenderModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: { title: string; deadline: string; budget: string; fileName: string }) => void }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Введите наименование";
    if (!deadline.trim()) errs.deadline = "Укажите дату окончания";
    if (!budget.trim()) errs.budget = "Укажите сумму";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ title, deadline, budget, fileName });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Новый тендер</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Наименование тендера *</label>
              <input className="field" value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }} placeholder="Строительство объекта…"
                style={{ borderColor: errors.title ? "#ef4444" : undefined }} />
              {errors.title && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Дата окончания *</label>
                <input type="date" className="field" value={deadline} onChange={e => { setDeadline(e.target.value); setErrors(p => ({ ...p, deadline: "" })); }}
                  style={{ borderColor: errors.deadline ? "#ef4444" : undefined }} />
                {errors.deadline && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.deadline}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Сумма *</label>
                <input className="field" value={budget} onChange={e => { setBudget(e.target.value); setErrors(p => ({ ...p, budget: "" })); }} placeholder="от 5 млн ₽"
                  style={{ borderColor: errors.budget ? "#ef4444" : undefined }} />
                {errors.budget && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.budget}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Пакет документов</label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer" style={{ border: "1.5px dashed #CBD5E1" }}>
                <Icon name="Upload" size={16} style={{ color: MUT }} />
                <span style={{ fontSize: ".85rem", color: fileName ? INK : MUT }}>{fileName || "Прикрепить архив документов (PDF, ZIP)"}</span>
                <input type="file" accept=".pdf,.zip,.doc,.docx" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Создать тендер <Icon name="Plus" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onAdd }: { onClose: () => void; onAdd: (u: AdminUser) => void }) {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Введите ФИО";
    if (!login.trim()) errs.login = "Введите логин";
    if (!pw.trim()) errs.pw = "Введите пароль";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ id: Date.now(), name, login, email: email || login + "@ao-urst.ru", phone: "—", role: "user", regDate: new Date().toLocaleDateString("ru-RU") });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: "#10b981" }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Новый пользователь</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>ФИО *</label>
              <input className="field" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }} placeholder="Иванов Иван Иванович"
                style={{ borderColor: errors.name ? "#ef4444" : undefined }} />
              {errors.name && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Логин *</label>
              <input className="field" value={login} onChange={e => { setLogin(e.target.value); setErrors(p => ({ ...p, login: "" })); }} placeholder="ivanov"
                style={{ borderColor: errors.login ? "#ef4444" : undefined }} />
              {errors.login && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.login}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email</label>
              <input type="email" className="field" value={email} onChange={e => setEmail(e.target.value)} placeholder="ivanov@ao-urst.ru" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Пароль *</label>
              <input type="password" className="field" value={pw} onChange={e => { setPw(e.target.value); setErrors(p => ({ ...p, pw: "" })); }} placeholder="Введите пароль"
                style={{ borderColor: errors.pw ? "#ef4444" : undefined }} />
              {errors.pw && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.pw}</p>}
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Добавить пользователя <Icon name="UserPlus" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddDocModal({ onClose }: { onClose: () => void }) {
  const existingSections = DOCS_SECTIONS.map(s => s.title);
  const [useExisting, setUseExisting] = useState(true);
  const [selectedSection, setSelectedSection] = useState(existingSections[0]);
  const [newSection, setNewSection] = useState("");
  const [docName, setDocName] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!docName.trim()) errs.docName = "Введите наименование документа";
    if (!useExisting && !newSection.trim()) errs.newSection = "Введите название нового раздела";
    if (!fileName) errs.file = "Прикрепите файл";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: "#8b5cf6" }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Добавить документ</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            {/* Раздел */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Раздел документации *</label>
              <div className="flex gap-3 mb-3">
                <button onClick={() => setUseExisting(true)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: useExisting ? INK : "#F7F8FC", color: useExisting ? "#fff" : MUT, border: `1.5px solid ${useExisting ? INK : "#E4E8F0"}`, fontFamily: "'Inter',sans-serif" }}>
                  Существующий
                </button>
                <button onClick={() => setUseExisting(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: !useExisting ? INK : "#F7F8FC", color: !useExisting ? "#fff" : MUT, border: `1.5px solid ${!useExisting ? INK : "#E4E8F0"}`, fontFamily: "'Inter',sans-serif" }}>
                  Новый раздел
                </button>
              </div>
              {useExisting ? (
                <select className="field" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                  {existingSections.map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <>
                  <input className="field" value={newSection} onChange={e => { setNewSection(e.target.value); setErrors(p => ({ ...p, newSection: "" })); }}
                    placeholder="Название нового раздела" style={{ borderColor: errors.newSection ? "#ef4444" : undefined }} />
                  {errors.newSection && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.newSection}</p>}
                </>
              )}
            </div>
            {/* Наименование */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Наименование документа *</label>
              <input className="field" value={docName} onChange={e => { setDocName(e.target.value); setErrors(p => ({ ...p, docName: "" })); }}
                placeholder="Название документа" style={{ borderColor: errors.docName ? "#ef4444" : undefined }} />
              {errors.docName && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.docName}</p>}
            </div>
            {/* Файл */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Файл *</label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{ border: `1.5px dashed ${errors.file ? "#ef4444" : "#CBD5E1"}` }}>
                <Icon name="Upload" size={16} style={{ color: MUT }} />
                <span style={{ fontSize: ".85rem", color: fileName ? INK : MUT }}>{fileName || "Загрузить файл (PDF, DOCX)"}</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { setFileName(e.target.files?.[0]?.name || ""); setErrors(p => ({ ...p, file: "" })); }} />
              </label>
              {errors.file && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.file}</p>}
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Добавить документ <Icon name="FilePlus" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditUserModal({ adminUser, onClose, onSave }: { adminUser: AdminUser; onClose: () => void; onSave: (u: AdminUser) => void }) {
  const [name, setName] = useState(adminUser.name);
  const [email, setEmail] = useState(adminUser.email);
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Введите ФИО";
    if (!email.trim()) errs.email = "Введите email";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...adminUser, name, email });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Редактирование пользователя</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>ФИО *</label>
              <input className="field" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                style={{ borderColor: errors.name ? "#ef4444" : undefined }} />
              {errors.name && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email *</label>
              <input type="email" className="field" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
              {errors.email && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Новый пароль</label>
              <input type="password" className="field" value={pw} onChange={e => setPw(e.target.value)} placeholder="Оставьте пустым, если не меняете" />
              {pw && <p style={{ color: "#10b981", fontSize: ".75rem", marginTop: 4 }}>Пароль будет сброшен</p>}
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Сохранить изменения</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({ cfg, onSave, onBack }: { cfg: SiteConfig; onSave: (c: SiteConfig) => void; onBack: () => void }) {
  const [form, setForm] = useState<SiteConfig>({ ...cfg });
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(cfg.logoUrl);

  const set = (k: keyof SiteConfig, v: string) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  const handle = () => { onSave({ ...form, logoUrl: logoPreview }); setSaved(true); };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      setLogoPreview(url);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const resetLogo = () => { setLogoPreview(DEFAULT_LOGO); setSaved(false); };

  const Field = ({ label, k, placeholder }: { label: string; k: keyof SiteConfig; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>{label}</label>
      <input className="field" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
    </div>
  );

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.6)" }}>
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Настройки сайта</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Хедер, футер и контактные данные</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Основное */}
        <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 18, letterSpacing: ".04em", textTransform: "uppercase" }}>
            Основное
          </div>
          <div className="space-y-5">
            <Field label="Наименование сайта" k="siteName" placeholder="АО УРСТ" />
            {/* Логотип */}
            <div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Логотип</label>
              <div className="flex items-center gap-5">
                {/* Preview */}
                <div className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: 80, height: 56, background: INK, borderRadius: 10, overflow: "hidden", border: "2px solid #E4E8F0" }}>
                  <img src={logoPreview} alt="Логотип" style={{ maxHeight: 40, maxWidth: 70, objectFit: "contain" }} />
                </div>
                {/* Controls */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all"
                    style={{ background: B + "12", border: `1.5px solid ${B}30`, color: B, fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B + "22"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = B + "12"}>
                    <Icon name="Upload" size={14} /> Загрузить логотип
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={handleLogo} />
                  </label>
                  {logoPreview !== DEFAULT_LOGO && (
                    <button onClick={resetLogo} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                      style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", color: MUT, fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
                      <Icon name="RotateCcw" size={13} /> Сбросить
                    </button>
                  )}
                  <p style={{ fontSize: ".72rem", color: MUT }}>PNG, JPG, SVG, WEBP · рекомендуется 200×60px</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Хедер */}
        <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 18, letterSpacing: ".04em", textTransform: "uppercase" }}>
            Контактная строка в шапке
          </div>
          <div className="space-y-4">
            <Field label="Номер телефона" k="phone" placeholder="+7 (495) 940-07-03" />
            <Field label="Email" k="email" placeholder="info@ao-urst.ru" />
            <Field label="График работы" k="schedule" placeholder="Пн–Пт, 9:00–18:00" />
          </div>
        </div>

        {/* Футер */}
        <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 18, letterSpacing: ".04em", textTransform: "uppercase" }}>
            Футер
          </div>
          <div className="space-y-4">
            <Field label="Адрес" k="address" placeholder="г. Москва, ул. Климашкина 22 с 2" />
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Описание компании</label>
              <textarea className="field" rows={2} value={form.footerDesc} onChange={e => set("footerDesc", e.target.value)} />
            </div>
            <Field label="Строка копирайта" k="footerCopyright" placeholder="© 2026 АО «УРСТ». Все права защищены." />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handle} className="btn-primary">
            <Icon name="Save" size={14} /> Сохранить изменения
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm" style={{ color: "#10b981", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
              <Icon name="CheckCircle" size={15} /> Изменения сохранены
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Users Page ───────────────────────────────────────────────────────────────
function UsersPage({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 1, name: "Иванов Иван Петрович", login: "ivanov", email: "ivanov@ao-urst.ru", phone: "+7 (916) 111-11-11", role: "user", regDate: "10.01.2026" },
    { id: 2, name: "Петрова Мария Сергеевна", login: "petrova", email: "petrova@ao-urst.ru", phone: "+7 (916) 222-22-22", role: "user", regDate: "15.02.2026" },
    { id: 3, name: "Сидоров Алексей Юрьевич", login: "sidorov", email: "sidorov@ao-urst.ru", phone: "+7 (916) 333-33-33", role: "contentadmin", regDate: "20.03.2026" },
    { id: 4, name: "Козлова Анна Дмитриевна", login: "kozlova", email: "kozlova@ao-urst.ru", phone: "+7 (916) 444-44-44", role: "user", regDate: "01.04.2026" },
    { id: 5, name: "Новиков Дмитрий Игоревич", login: "novikov", email: "novikov@ao-urst.ru", phone: "+7 (916) 555-55-55", role: "user", regDate: "05.04.2026", blocked: true },
  ]);
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const changeRole = (id: number, role: AdminUser["role"]) => setUsers(p => p.map(u => u.id === id ? { ...u, role } : u));
  const toggleBlock = (id: number) => setUsers(p => p.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u));
  const deleteUser = (id: number) => { setUsers(p => p.filter(u => u.id !== id)); setDeleteId(null); };

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.6)" }}>
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Пользователи</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Управление учётными записями</div>
          </div>
          <div className="ml-auto">
            <button onClick={() => setAddModal(true)} className="btn-primary text-sm">
              <Icon name="UserPlus" size={14} /> Добавить пользователя
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
          {/* Table header */}
          <div className="hidden md:grid px-5 py-3 gap-4 text-xs font-bold uppercase tracking-wider"
            style={{ gridTemplateColumns: "2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr auto", color: MUT, fontFamily: "'Inter',sans-serif", background: "#F7F8FC", borderBottom: "1px solid #E4E8F0" }}>
            <span>ФИО</span><span>Логин</span><span>Email</span><span>Телефон</span><span>Дата регистрации</span><span>Роль</span><span>Действия</span>
          </div>

          {users.map((u, i) => (
            <div key={u.id} className="px-5 py-4 flex flex-col md:grid gap-4 items-center"
              style={{ gridTemplateColumns: "2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr auto", borderBottom: i < users.length - 1 ? "1px solid #E4E8F0" : "none", opacity: u.blocked ? 0.6 : 1 }}>
              {/* ФИО */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: ROLE_COLORS[u.role] + "cc", fontFamily: "'Inter',sans-serif" }}>{u.name.charAt(0)}</div>
                <div className="min-w-0">
                  <div style={{ fontWeight: 600, fontSize: ".85rem", color: INK, fontFamily: "'Inter',sans-serif" }} className="truncate">{u.name}</div>
                  {u.blocked && <span style={{ fontSize: ".68rem", color: "#ef4444", fontWeight: 600 }}>Заблокирован</span>}
                </div>
              </div>
              {/* Логин */}
              <div style={{ fontSize: ".82rem", color: MUT, fontFamily: "'Inter',sans-serif" }}>{u.login}</div>
              {/* Email */}
              <div style={{ fontSize: ".82rem", color: MUT, fontFamily: "'Inter',sans-serif" }} className="truncate">{u.email}</div>
              {/* Телефон */}
              <div style={{ fontSize: ".82rem", color: MUT, fontFamily: "'Inter',sans-serif" }}>{u.phone}</div>
              {/* Дата */}
              <div style={{ fontSize: ".82rem", color: MUT, fontFamily: "'Inter',sans-serif" }}>{u.regDate}</div>
              {/* Роль */}
              <div>
                <select value={u.role} onChange={e => changeRole(u.id, e.target.value as AdminUser["role"])}
                  className="rounded-lg px-2 py-1 text-xs font-semibold border-0 outline-none cursor-pointer"
                  style={{ background: ROLE_COLORS[u.role] + "18", color: ROLE_COLORS[u.role], fontFamily: "'Inter',sans-serif" }}>
                  <option value="user">Пользователь</option>
                  <option value="contentadmin">Контент-админ</option>
                  <option value="superadmin">Суперадмин</option>
                </select>
              </div>
              {/* Действия */}
              <div className="flex items-center gap-1">
                <AdminActionBtn icon="Edit" label="Редактировать" color={B} onClick={() => setEditUser(u)} />
                <AdminActionBtn icon={u.blocked ? "Unlock" : "Lock"} label={u.blocked ? "Разблокировать" : "Заблокировать"} color={u.blocked ? "#10b981" : "#f59e0b"} onClick={() => toggleBlock(u.id)} />
                <AdminActionBtn icon="Trash2" label="Удалить" color="#ef4444" onClick={() => setDeleteId(u.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="Trash2" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить пользователя?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", color: INK, fontFamily: "'Inter',sans-serif" }}>Отмена</button>
              <button onClick={() => deleteUser(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {addModal && <AddUserModal onClose={() => setAddModal(false)} onAdd={u => setUsers(p => [...p, u])} />}
      {editUser && <EditUserModal adminUser={editUser} onClose={() => setEditUser(null)} onSave={updated => setUsers(p => p.map(u => u.id === updated.id ? updated : u))} />}
    </div>
  );
}

// ─── Superadmin Dashboard ─────────────────────────────────────────────────────
function SuperAdminDashboard({ user, onLogout, go, cfg, onCfgSave }: {
  user: User; onLogout: () => void; go: (s: Section) => void;
  cfg: SiteConfig; onCfgSave: (c: SiteConfig) => void;
}) {
  const [view, setView] = useState<"dashboard" | "users" | "settings">("dashboard");
  const [addTender, setAddTender] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addDoc, setAddDoc] = useState(false);

  const statCards = [
    { icon: "Newspaper", label: "Новости за неделю", value: 3, sub: "Всего: 12", color: "#0066FF", onClick: () => go("news") },
    { icon: "HardHat", label: "Проекты", value: 8, sub: "+2 за месяц", color: "#8b5cf6", onClick: () => go("projects") },
    { icon: "FileText", label: "Тендеры", value: 5, sub: "+1 за неделю", color: "#f59e0b", onClick: () => go("tenders") },
    { icon: "Users", label: "Пользователи", value: 45, sub: "+5 за неделю", color: "#10b981", onClick: () => setView("users") },
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
    { icon: "Plus", label: "Добавить тендер", onClick: () => setAddTender(true) },
    { icon: "UserPlus", label: "Добавить пользователя", onClick: () => setAddUser(true) },
    { icon: "FilePlus", label: "Добавить документ", onClick: () => setAddDoc(true) },
    { icon: "Settings", label: "Настройки", onClick: () => setView("settings") },
  ];

  if (view === "users") return <UsersPage onBack={() => setView("dashboard")} />;
  if (view === "settings") return <SettingsPage cfg={cfg} onSave={onCfgSave} onBack={() => setView("dashboard")} />;

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh", paddingTop: 90 }}>
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
            <button key={i} onClick={s.onClick}
              className="bg-white rounded-2xl p-5 text-left transition-all hover:shadow-md"
              style={{ border: "1px solid #E4E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "18", marginBottom: 12 }} className="flex items-center justify-center">
                <Icon name={s.icon as "Users"} size={20} style={{ color: s.color }} />
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: INK, letterSpacing: "-.03em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 600, color: INK, fontFamily: "'Inter',sans-serif", marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: ".72rem", color: s.color, marginTop: 3 }}>{s.sub}</div>
            </button>
          ))}
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
              <button key={i} onClick={a.onClick} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: INK }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B; (e.currentTarget as HTMLElement).style.color = B; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; (e.currentTarget as HTMLElement).style.color = INK; }}>
                <Icon name={a.icon as "Plus"} size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {addTender && <AddTenderModal onClose={() => setAddTender(false)} onAdd={() => {}} />}
      {addUser && <AddUserModal onClose={() => setAddUser(false)} onAdd={() => {}} />}
      {addDoc && <AddDocModal onClose={() => setAddDoc(false)} />}
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
function Footer({ go, cfg }: { go: (s: Section) => void; cfg: SiteConfig }) {
  const labels: Record<Section, string> = { home: "Главная", about: "О компании", projects: "Проекты", news: "Новости", tenders: "Тендеры", docs: "Документация", contacts: "Контакты", cabinet: "Личный кабинет" };
  return (
    <footer style={{ background: "#05091A", borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ borderRadius: 7, overflow: "hidden", boxShadow: "0 4px 10px rgba(0,102,255,.35)" }} className="flex-shrink-0">
              <img src={cfg.logoUrl} alt={cfg.siteName} style={{ height: 30, width: "auto", display: "block" }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: ".9rem", color: "#fff" }}>{cfg.siteName}</div>
              <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.5)", letterSpacing: ".05em" }}>с 2013 года</div>
            </div>
          </div>
          <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.5)", lineHeight: 1.65 }}>{cfg.footerDesc}</p>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Навигация</div>
          <div className="space-y-2">
            {(["home", "about", "projects", "news"] as Section[]).map(s => (
              <button key={s} onClick={() => go(s)} style={{ display: "block", fontSize: ".82rem", color: "rgba(255,255,255,.5)", fontFamily: "'Golos Text',sans-serif" }}
                className="hover:text-white transition-colors">{labels[s]}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", color: "rgba(255,255,255,.5)", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>Контакты</div>
          <div className="space-y-2.5" style={{ fontSize: ".82rem", color: "rgba(255,255,255,.5)" }}>
            <div className="flex items-center gap-2"><Icon name="Phone" size={11} /> {cfg.phone}</div>
            <div className="flex items-center gap-2"><Icon name="Mail" size={11} /> {cfg.email}</div>
            <div className="flex items-center gap-2"><Icon name="MapPin" size={11} /> {cfg.address}</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.06)" }} className="py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", fontFamily: "'Inter',sans-serif" }}>
            {cfg.footerCopyright}
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.5)", fontFamily: "'Inter',sans-serif" }}>Входит в группу</span>
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
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, date: "15 апреля 2026", subject: "Строительный проект", text: "Добрый день! Интересует возможность сотрудничества по строительству объекта в Подмосковье. Прошу предоставить информацию о ваших услугах.", reply: "Добрый день! Спасибо за обращение. Мы готовы рассмотреть ваш проект. Наш менеджер свяжется с вами в течение одного рабочего дня.", replyDate: "16 апреля 2026" },
    { id: 2, date: "10 апреля 2026", subject: "Партнёрство", text: "Здравствуйте, хотели бы обсудить возможность партнёрства в рамках тендера на строительство дороги." },
  ]);
  const [tenderApps, setTenderApps] = useState<TenderApp[]>([
    { id: 1, date: "5 апреля 2026", tenderTitle: "Проектирование объектов инфраструктуры", company: "ООО СтройПроект", inn: "7712345678", status: "review", feedback: "Ваша заявка принята в работу. Ожидайте результатов рассмотрения до 25 апреля 2026." },
  ]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);

  const go = (s: Section) => { setSection(s); setMob(false); };
  const logout = () => { setUser(null); go("home"); };

  const handleSendMessage = (subject: string, text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
      subject,
      text,
    }]);
  };

  const handleAddApp = (app: Omit<TenderApp, "id">) => {
    setTenderApps(prev => [...prev, { ...app, id: Date.now() }]);
  };

  // Суперадмин видит только дашборд
  if (user?.role === "superadmin") {
    return (
      <div>
        <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} cfg={cfg} />
        <SuperAdminDashboard user={user} onLogout={logout} go={go} cfg={cfg} onCfgSave={setCfg} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
      </div>
    );
  }

  // Контент-админ видит дашборд
  if (user?.role === "contentadmin") {
    return (
      <div>
        <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} cfg={cfg} />
        <ContentAdminDashboard user={user} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
      </div>
    );
  }

  return (
    <div>
      <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} cfg={cfg} />
      <main>
        {section === "home"     && <HomeSection go={go} />}
        {section === "about"    && <AboutSection />}
        {section === "projects" && <ProjectsSection />}
        {section === "news"     && <NewsSection />}
        {section === "tenders"  && <TendersSection user={user} onAddApp={handleAddApp} go={go} />}
        {section === "docs"     && <DocsSection user={user} />}
        {section === "contacts" && <ContactsSection user={user} onLogin={() => setShowLogin(true)} onSend={handleSendMessage} />}
        {section === "cabinet"  && user?.role === "user" && (
          <UserCabinet user={user} setUser={setUser} messages={messages} tenderApps={tenderApps} go={go} />
        )}
      </main>
      {section !== "cabinet" && <Footer go={go} cfg={cfg} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} />}
    </div>
  );
}