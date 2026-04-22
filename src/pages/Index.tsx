import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "home" | "about" | "projects" | "news" | "tenders" | "docs" | "contacts" | "cabinet" | "search";
type UserRole = "superadmin" | "contentadmin" | "user" | null;
interface User { name: string; role: UserRole; email: string; phone?: string; company?: string; consentGiven?: boolean; consentDate?: string; }

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
interface ProjectItem {
  id: number; title: string; type: string; year?: number; area?: string; img: string; status: "Сдан" | "В процессе";
}
const PROJECTS_INITIAL: ProjectItem[] = [
  { id: 1, title: "Парк «Зарядье»", type: "ПГС", year: 2018, area: "83 850 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/10fe1108-41e2-4553-953a-cb83313f04c8.jpg", status: "Сдан" },
  { id: 7, title: "Дворец гимнастики Ирины Винер-Усмановой", type: "ПГС", year: 2019, area: "25 730 м²", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/bucket/582f8aa5-35a9-400f-b230-6632fc6056e0.jpg", status: "Сдан" },
  { id: 2, title: "Участок метро «Южная – Коммунарка»", type: "Метро и тоннели", year: 2019, area: "6.4 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/03ec1b03-d6a3-43b2-bece-dab3c668cab4.jpg", status: "Сдан" },
  { id: 3, title: "Московский скоростной диаметр (МСД)", type: "Дорожное строительство", year: 2026, area: "13,5 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/194d7c9e-67dc-4f48-a1b5-274d467f3c76.jpg", status: "В процессе" },
  { id: 5, title: "Транспортная система Мнёвниковской поймы", type: "Дорожное строительство", year: 2026, area: "11,7 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/194d7c9e-67dc-4f48-a1b5-274d467f3c76.jpg", status: "В процессе" },
  { id: 4, title: "Инженерная инфраструктура АДЦ «Коммунарка»", type: "Инженерная инфраструктура", year: 2023, area: "18 км", img: "https://cdn.poehali.dev/projects/232d353a-884c-46d3-ba1a-b2a0e421060f/files/32c14947-3147-4e77-8f6d-a8717f8e0d95.jpg", status: "Сдан" },
];
interface NewsItem {
  id: number; date: string; category: string; title: string; text: string; full: string; draft?: boolean;
}
const NEWS_INITIAL: NewsItem[] = [
  { id: 1, date: "18 апреля 2026", category: "Компания", title: "АО УРСТ вошло в топ-10 строительных компаний России", text: "По итогам ежегодного рейтинга отраслевого портала, компания заняла 7-е место среди крупнейших строительных организаций страны.", full: "По итогам ежегодного рейтинга отраслевого портала «СтройРейтинг», АО «УРСТ» заняло 7-е место среди крупнейших строительных организаций России по объёму выполненных работ за 2025 год.\n\nВ рейтинге оцениваются финансовая устойчивость, количество завершённых объектов, соблюдение сроков и качество работ. В этом году компания поднялась на три позиции по сравнению с прошлым годом.\n\nГенеральный директор АО «УРСТ» отметил, что данное достижение — результат слаженной работы всего коллектива и чёткого следования стратегии устойчивого развития. В ближайшие годы компания планирует войти в топ-5 ведущих строительных организаций страны, расширив портфель проектов в сфере транспортной и инженерной инфраструктуры." },
  { id: 2, date: "10 апреля 2026", category: "Проекты", title: "Начало строительства нового участка метро на севере города", text: "На этой неделе официально стартовал один из крупнейших транспортных проектов этого года — участок метро протяжённостью 4.2 км.", full: "На этой неделе официально стартовал один из крупнейших транспортных проектов текущего года — строительство нового участка метро на севере Москвы протяжённостью 4.2 км с тремя новыми станциями.\n\nАО «УРСТ» выступает генеральным подрядчиком по тоннельным и отделочным работам. Контракт предусматривает строительство перегонных тоннелей методом щитовой проходки, возведение станционных комплексов и монтаж инженерных систем.\n\nСрок завершения работ — IV квартал 2027 года. Общий объём финансирования составляет порядка 18 млрд рублей. На объекте будет задействовано более 800 специалистов компании." },
  { id: 3, date: "2 апреля 2026", category: "Тендеры", title: "Победа в государственном тендере на строительство дороги", text: "Наша компания одержала победу в конкурсе на возведение участка автомагистрали. Стоимость контракта — 2.1 млрд рублей.", full: "АО «УРСТ» одержало победу в открытом государственном конкурсе на строительство участка автомагистрали протяжённостью 12.4 км в Подмосковье. Стоимость контракта составила 2.1 млрд рублей.\n\nВ рамках проекта планируется возведение двухполосного шоссе с расширением до четырёх полос, строительство двух транспортных развязок, двух путепроводов и системы ливневой канализации. Дорога свяжет два крупных жилых массива и снизит транспортную нагрузку на существующие артерии.\n\nСрок выполнения работ — 24 месяца с момента подписания контракта. Проектная документация уже разработана и прошла государственную экспертизу." },
  { id: 4, date: "25 марта 2026", category: "Компания", title: "Открытие нового регионального офиса в Москве", text: "В рамках стратегии расширения географии присутствия открылся наш новый офис в Москве по адресу ул. 5-я Магистральная, 10.", full: "В марте 2026 года АО «УРСТ» открыло новый офис в Москве по адресу ул. 5-я Магистральная, 10. Расширение географии присутствия продиктовано ростом портфеля проектов в столичном регионе.\n\nВ новом офисе разместятся проектный отдел, отдел по работе с заказчиками и технический надзор. Площадь офиса составляет 480 кв. м, здесь будет работать более 60 сотрудников.\n\nОткрытие нового офиса позволит компании оперативнее взаимодействовать с заказчиками и партнёрами, а также усилить присутствие в Московском регионе, который является ключевым для стратегии развития АО «УРСТ» на ближайшие пять лет." },
];
const TENDERS_INITIAL = [
  { id: 1, title: "Строительство тоннельного участка метро", deadline: "15 мая 2026", budget: "от 4.5 млрд ₽", type: "Открытый конкурс", status: "active" },
  { id: 2, title: "Реконструкция инженерных сетей", deadline: "28 мая 2026", budget: "от 45 млн ₽", type: "Запрос котировок", status: "active" },
  { id: 3, title: "Строительство автомобильной дороги II категории", deadline: "5 июня 2026", budget: "от 780 млн ₽", type: "Открытый конкурс", status: "active" },
  { id: 4, title: "Проектирование объектов инфраструктуры", deadline: "20 апреля 2026", budget: "от 8 млн ₽", type: "Запрос котировок", status: "closed" },
  { id: 5, title: "Поставка строительных материалов 2026", deadline: "1 апреля 2026", budget: "от 62 млн ₽", type: "Открытый конкурс", status: "closed" },
];
interface DocItem { id: number; name: string; type: string; size: string; }
interface DocSubSection { id: string; title: string; docs: DocItem[]; }
interface DocSection {
  id: string; title: string; icon: string;
  docs?: DocItem[]; subsections?: DocSubSection[];
}
const DOCS_INITIAL: DocSection[] = [
  {
    id: "contractors", title: "Подрядным организациям", icon: "HardHat",
    docs: [
      { id: 1, name: "Регламент ИД", type: "PDF", size: "1.2 МБ" },
      { id: 2, name: "Соглашение КОТПБиООС", type: "PDF", size: "0.9 МБ" },
      { id: 3, name: "Стандарт ЭК", type: "PDF", size: "0.7 МБ" },
      { id: 4, name: "Положение о закупках", type: "PDF", size: "1.4 МБ" },
    ],
  },
  {
    id: "pricelist", title: "Прайс-лист на услуги техники с экипажем и оборудования", icon: "Receipt",
    docs: [{ id: 5, name: "Прайс-лист", type: "PDF", size: "0.6 МБ" }],
  },
  {
    id: "certs", title: "Сертификаты соответствия ИСМ", icon: "BadgeCheck",
    docs: [
      { id: 6, name: "ISO 9001:2015", type: "PDF", size: "0.8 МБ" },
      { id: 7, name: "ISO 14001:2015", type: "PDF", size: "0.8 МБ" },
      { id: 8, name: "ISO 45001:2018", type: "PDF", size: "0.8 МБ" },
    ],
  },
  {
    id: "personaldata", title: "Положение об обработке и защите персональных данных работников", icon: "ShieldCheck",
    docs: [{ id: 9, name: "Защита персональных данных", type: "PDF", size: "1.1 МБ" }],
  },
  {
    id: "labor", title: "Охрана труда", icon: "HardHat",
    subsections: [
      {
        id: "soут", title: "СОУТ — Специальная Оценка Условий Труда",
        docs: [
          { id: 10, name: "Перечень мероприятий 17.03.2025", type: "PDF", size: "0.9 МБ" },
          { id: 11, name: "Сводная ведомость 17.03.2025", type: "PDF", size: "1.3 МБ" },
          { id: 12, name: "Перечень мероприятий 15.11.2025", type: "PDF", size: "0.9 МБ" },
          { id: 13, name: "Сводная ведомость 15.11.2025", type: "PDF", size: "1.3 МБ" },
        ],
      },
      {
        id: "policies", title: 'Политики АО "Мосинжпроект" применяемые в АО "УРСТ"',
        docs: [
          { id: 14, name: "Политика в области употребления алкоголя, наркотических и психотропных веществ", type: "PDF", size: "0.5 МБ" },
          { id: 15, name: "Политика о вмешательстве в опасные ситуации. Право на приостановку (прекращение) работ", type: "PDF", size: "0.6 МБ" },
          { id: 16, name: 'Политика интегрированной системы менеджмента АО "Мосинжпроект" и его дочерних обществ', type: "PDF", size: "0.7 МБ" },
        ],
      },
      {
        id: "ecology", title: "Охрана окружающей среды / Экологические аспекты",
        docs: [{ id: 17, name: "Реестр экологических аспектов", type: "PDF", size: "1.0 МБ" }],
      },
    ],
  },
];
// обратная совместимость для мест где используется DOCS_SECTIONS
const DOCS_SECTIONS = DOCS_INITIAL;

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

// ─── Privacy Policy Modal ─────────────────────────────────────────────────────
function PrivacyPolicyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(5,9,26,.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: INK }} className="px-7 py-5 flex justify-between items-center flex-shrink-0">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff" }}>Политика конфиденциальности</div>
            <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.45)", marginTop: 2 }}>Последнее обновление: 22 апреля 2026 г.</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.6)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-7 py-6 space-y-6 text-sm" style={{ color: "#374151", lineHeight: 1.75, fontFamily: "'Golos Text',sans-serif" }}>
          <p style={{ color: MUT, fontSize: ".82rem" }}>
            Настоящая Политика конфиденциальности описывает, как АО «УРСТ» (далее — «Оператор») собирает, использует и хранит персональные данные пользователей сайта в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
          </p>

          {[
            {
              title: "1. Какие данные мы собираем",
              content: (
                <ul className="space-y-1.5 pl-4" style={{ listStyleType: "disc" }}>
                  <li><strong>Имя и фамилия</strong> — для идентификации пользователя</li>
                  <li><strong>Адрес электронной почты</strong> — для входа в систему и уведомлений</li>
                  <li><strong>Номер телефона</strong> — для связи по заявкам и тендерам</li>
                  <li><strong>Наименование компании и ИНН</strong> — при подаче заявок на тендеры</li>
                  <li><strong>IP-адрес</strong> — в технических целях обеспечения безопасности</li>
                </ul>
              )
            },
            {
              title: "2. Цели обработки данных",
              content: (
                <ul className="space-y-1.5 pl-4" style={{ listStyleType: "disc" }}>
                  <li>Регистрация и аутентификация на сайте</li>
                  <li>Обработка заявок на участие в тендерах</li>
                  <li>Направление уведомлений об изменении статуса заявок</li>
                  <li>Обеспечение обратной связи с пользователем</li>
                  <li>Улучшение качества работы сервиса</li>
                </ul>
              )
            },
            {
              title: "3. Правовые основания",
              content: (
                <p>Обработка персональных данных осуществляется на основании <strong>Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»</strong>, а также на основании согласия субъекта персональных данных, выраженного при регистрации на сайте или при подаче заявки на тендер.</p>
              )
            },
            {
              title: "4. Срок хранения данных",
              content: (
                <p>Персональные данные хранятся в течение всего срока действия учётной записи, а также в течение <strong>3 лет</strong> после её удаления или отзыва согласия — в целях исполнения требований законодательства. По истечении указанного срока данные уничтожаются или обезличиваются.</p>
              )
            },
            {
              title: "5. Права пользователя",
              content: (
                <ul className="space-y-1.5 pl-4" style={{ listStyleType: "disc" }}>
                  <li><strong>Право на доступ</strong> — запросить сведения об обрабатываемых данных</li>
                  <li><strong>Право на исправление</strong> — потребовать уточнения неточных данных</li>
                  <li><strong>Право на удаление</strong> — потребовать удаления данных (право «быть забытым»)</li>
                  <li><strong>Право на отзыв согласия</strong> — в любое время через личный кабинет или обратившись к нам</li>
                  <li><strong>Право на ограничение обработки</strong> — при оспаривании точности данных</li>
                </ul>
              )
            },
            {
              title: "6. Контактная информация",
              content: (
                <div className="space-y-1">
                  <p>По всем вопросам, связанным с обработкой персональных данных, обращайтесь:</p>
                  <p><strong>АО «УРСТ»</strong></p>
                  <p>Адрес: г. Москва, ул. Климашкина, 22 с 2</p>
                  <p>Email: <span style={{ color: B }}>info@ao-urst.ru</span></p>
                  <p>Телефон: +7 (495) 940-07-03</p>
                </div>
              )
            },
          ].map(s => (
            <div key={s.title}>
              <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".9rem", color: INK, marginBottom: 10 }}>{s.title}</h3>
              <div style={{ color: "#4B5563" }}>{s.content}</div>
            </div>
          ))}
        </div>
        <div className="px-7 py-4 flex-shrink-0" style={{ borderTop: "1px solid #E4E8F0" }}>
          <button onClick={onClose} className="btn-primary w-full justify-center">Закрыть</button>
        </div>
      </div>
    </div>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onLogin, onRegister }: { onClose: () => void; onLogin: (u: User) => void; onRegister?: (u: User) => void }) {
  const [tab, setTab] = useState<"login" | "register">("login");

  // --- Вход ---
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");

  // --- Регистрация ---
  const [rName, setRName] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rCompany, setRCompany] = useState("");
  const [rPw, setRPw] = useState("");
  const [showRPw, setShowRPw] = useState(false);
  const [rConsent, setRConsent] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [rErrors, setRErrors] = useState<Record<string, string>>({});
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    if (email === "super@ao-urst.ru" && pw === "super123") onLogin({ name: "Иван", role: "superadmin", email, phone: "+7 (495) 000-00-01", consentGiven: true, consentDate: "01.01.2026" });
    else if (email === "admin@ao-urst.ru" && pw === "admin123") onLogin({ name: "Мария Иванова", role: "contentadmin", email, phone: "+7 (495) 000-00-02", consentGiven: true, consentDate: "01.01.2026" });
    else if (email === "user@ao-urst.ru" && pw === "user123") onLogin({ name: "Сергей Попов", role: "user", email, phone: "+7 (916) 234-56-78", company: "ООО СтройПроект", consentGiven: true, consentDate: "01.03.2026" });
    else setErr("Неверный логин или пароль");
  };

  const submitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!rName.trim()) errs.name = "Введите имя и фамилию";
    if (!rEmail.trim() || !rEmail.includes("@")) errs.email = "Введите корректный email";
    if (!rPw.trim() || rPw.length < 6) errs.pw = "Пароль должен быть не менее 6 символов";
    if (!rConsent) errs.consent = "Необходимо принять условия Политики конфиденциальности";
    if (Object.keys(errs).length) { setRErrors(errs); return; }
    const consentDate = new Date().toLocaleDateString("ru-RU");
    setRegisteredUser({ name: rName.trim(), role: "user", email: rEmail.trim(), phone: rPhone.trim() || undefined, company: rCompany.trim() || undefined, consentGiven: true, consentDate });
  };

  return (
    <>
      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
      <div className="modal-backdrop animate-fade-in" onClick={onClose}>
        <div className="bg-white w-full max-w-md animate-scale-in"
          style={{ borderRadius: 16, boxShadow: "0 32px 80px rgba(5,9,26,.25)", overflow: "hidden" }}
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={{ background: INK }} className="px-8 py-5 flex justify-between items-center">
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1.05rem" }} className="text-white">
                {tab === "login" ? "Вход в систему" : "Регистрация"}
              </div>
              <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,.5)" }}>АО УРСТ</div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: "1px solid #E4E8F0" }}>
            {(["login", "register"] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setErr(""); setRErrors({}); }}
                className="flex-1 py-3 text-sm font-semibold transition-all"
                style={{ fontFamily: "'Inter',sans-serif", color: tab === t ? B : MUT, borderBottom: tab === t ? `2px solid ${B}` : "2px solid transparent", background: "transparent" }}>
                {t === "login" ? "Вход" : "Регистрация"}
              </button>
            ))}
          </div>

          {/* Login Tab */}
          {tab === "login" && (
            <>
              <div className="mx-8 mt-5 px-4 py-3 rounded-lg" style={{ background: "rgba(0,102,255,.06)", border: "1px solid rgba(0,102,255,.15)" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: B, fontFamily: "'Inter',sans-serif" }}>Демо-доступ</div>
                <div className="text-xs leading-relaxed" style={{ color: MUT }}>
                  <span style={{ color: INK, fontWeight: 600 }}>Суперадмин:</span> super@ao-urst.ru / super123<br />
                  <span style={{ color: INK, fontWeight: 600 }}>Контент-админ:</span> admin@ao-urst.ru / admin123<br />
                  <span style={{ color: INK, fontWeight: 600 }}>Пользователь:</span> user@ao-urst.ru / user123
                </div>
              </div>
              <form onSubmit={submitLogin} className="px-8 py-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email</label>
                  <input type="email" className="field" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Введите email" required style={{ borderColor: err ? "#ef4444" : undefined }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Пароль</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} className="field pr-10" value={pw}
                      onChange={e => setPw(e.target.value)} placeholder="Введите пароль" required
                      style={{ borderColor: err ? "#ef4444" : undefined }} />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: MUT }}>
                      <Icon name={showPw ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                </div>
                {err && <div className="text-red-500 text-sm flex items-center gap-2"><Icon name="AlertCircle" size={14} />{err}</div>}
                <button type="submit" className="btn-primary w-full justify-center">Войти</button>
              </form>
            </>
          )}

          {/* Register Tab */}
          {tab === "register" && (
            registeredUser ? (
              <div className="px-8 py-10 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#DCFCE7" }}>
                  <Icon name="CheckCircle" size={32} style={{ color: "#16a34a" }} />
                </div>
                <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: INK, marginBottom: 8 }}>
                  Регистрация успешна!
                </h3>
                <p style={{ fontSize: ".88rem", color: MUT, marginBottom: 6 }}>
                  Добро пожаловать, <strong style={{ color: INK }}>{registeredUser.name}</strong>!
                </p>
                <p style={{ fontSize: ".82rem", color: MUT, marginBottom: 24 }}>
                  Ваш аккаунт создан. Теперь вы можете подавать заявки на тендеры и отслеживать их статус.
                </p>
                <button onClick={() => (onRegister ?? onLogin)(registeredUser)} className="btn-primary w-full justify-center mb-3">
                  <Icon name="User" size={14} /> Войти в личный кабинет
                </button>
                <button onClick={onClose} className="w-full text-sm" style={{ color: MUT }}>Закрыть</button>
              </div>
            ) : (
              <form onSubmit={submitRegister} className="px-8 py-6 space-y-4">
                {/* Имя */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Имя и фамилия *</label>
                  <input className="field" value={rName} onChange={e => { setRName(e.target.value); setRErrors(p => ({ ...p, name: "" })); }}
                    placeholder="Иван Иванов" style={{ borderColor: rErrors.name ? "#ef4444" : undefined }} />
                  {rErrors.name && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{rErrors.name}</p>}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email *</label>
                  <input type="email" className="field" value={rEmail} onChange={e => { setREmail(e.target.value); setRErrors(p => ({ ...p, email: "" })); }}
                    placeholder="mail@example.com" style={{ borderColor: rErrors.email ? "#ef4444" : undefined }} />
                  {rErrors.email && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{rErrors.email}</p>}
                </div>
                {/* Телефон */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Телефон</label>
                  <input className="field" value={rPhone} onChange={e => setRPhone(e.target.value)} placeholder="+7 (999) 000-00-00" />
                </div>
                {/* Компания */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Компания</label>
                  <input className="field" value={rCompany} onChange={e => setRCompany(e.target.value)} placeholder="ООО Название (необязательно)" />
                </div>
                {/* Пароль */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Пароль *</label>
                  <div className="relative">
                    <input type={showRPw ? "text" : "password"} className="field pr-10" value={rPw}
                      onChange={e => { setRPw(e.target.value); setRErrors(p => ({ ...p, pw: "" })); }}
                      placeholder="Минимум 6 символов" style={{ borderColor: rErrors.pw ? "#ef4444" : undefined }} />
                    <button type="button" onClick={() => setShowRPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: MUT }}>
                      <Icon name={showRPw ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                  {rErrors.pw && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{rErrors.pw}</p>}
                </div>
                {/* Согласие на ПД */}
                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5">
                      <div onClick={() => { setRConsent(v => !v); setRErrors(p => ({ ...p, consent: "" })); }}
                        className="w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer"
                        style={{ background: rConsent ? B : "#fff", border: `2px solid ${rErrors.consent ? "#ef4444" : rConsent ? B : "#CBD5E1"}` }}>
                        {rConsent && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
                      </div>
                    </div>
                    <span style={{ fontSize: ".82rem", color: "#4B5563", lineHeight: 1.5, fontFamily: "'Golos Text',sans-serif" }}>
                      Я принимаю условия{" "}
                      <button type="button" onClick={e => { e.stopPropagation(); setShowPrivacy(true); }}
                        style={{ color: B, fontWeight: 600, textDecoration: "underline" }}>
                        Политики конфиденциальности
                      </button>
                      {" "}и даю согласие на обработку моих персональных данных
                    </span>
                  </label>
                  {rErrors.consent && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 6 }}>{rErrors.consent}</p>}
                </div>
                <button type="submit" disabled={!rConsent}
                  className="btn-primary w-full justify-center"
                  style={{ opacity: rConsent ? 1 : 0.45, cursor: rConsent ? "pointer" : "not-allowed" }}>
                  <Icon name="UserPlus" size={14} /> Зарегистрироваться
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ active, go, user, onLogin, onLogout, mob, setMob, cfg, onSearch }: {
  active: Section; go: (s: Section) => void; user: User | null;
  onLogin: () => void; onLogout: () => void; mob: boolean; setMob: (v: boolean) => void;
  cfg: SiteConfig; onSearch: (q: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

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

        {/* Search + Auth */}
        <div className="flex items-center gap-2">
          {/* Поисковая строка — только для гостей и обычных пользователей */}
          {(!user || user.role === "user") && (
            <div className="relative hidden md:flex items-center">
              {searchOpen ? (
                <form onSubmit={e => { e.preventDefault(); if (searchQ.trim()) { onSearch(searchQ.trim()); setSearchOpen(false); } }}
                  className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Поиск по сайту..."
                    className="rounded-xl px-3 py-1.5 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", width: 220, fontFamily: "'Inter',sans-serif" }}
                    onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                  />
                  <button type="submit" className="p-1.5 rounded-lg hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.7)" }}>
                    <Icon name="Search" size={16} />
                  </button>
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQ(""); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.5)" }}>
                    <Icon name="X" size={14} />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.6)" }} title="Поиск">
                  <Icon name="Search" size={18} />
                </button>
              )}
            </div>
          )}

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
          {(!user || user.role === "user") && (
            <form onSubmit={e => { e.preventDefault(); if (searchQ.trim()) { onSearch(searchQ.trim()); setMob(false); } }} className="flex gap-2 py-3 border-b" style={{ borderColor: "rgba(255,255,255,.06)" }}>
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск по сайту..."
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.15)", fontFamily: "'Inter',sans-serif" }} />
              <button type="submit" className="p-2 rounded-xl" style={{ background: B, color: "#fff" }}>
                <Icon name="Search" size={15} />
              </button>
            </form>
          )}
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

// ─── Admin back bar ───────────────────────────────────────────────────────────
function AdminBackBar({ go, user, onCabinet, onLogout }: { go: (s: Section) => void; user: User; onCabinet: () => void; onLogout: () => void }) {
  const accentColor = user.role === "superadmin" ? "#f59e0b" : "#3385FF";
  return (
    <div style={{ background: INK }} className="px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "rgba(255,255,255,.5)", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#fff"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.5)"}>
          <Icon name="ArrowLeft" size={13} /> Вернуться в дашборд
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onCabinet} className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-white/10">
            <div style={{ background: accentColor, width: 28, height: 28, borderRadius: 7, fontSize: ".8rem", fontFamily: "'Inter',sans-serif", fontWeight: 800 }}
              className="flex items-center justify-center text-white flex-shrink-0">{user.name.charAt(0)}</div>
            <div className="hidden md:block text-left">
              <div style={{ color: "#fff", fontSize: ".78rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
              <div style={{ fontSize: ".65rem", color: accentColor, fontFamily: "'Inter',sans-serif" }}>Личный кабинет →</div>
            </div>
          </button>
          <button onClick={onLogout} title="Выйти" className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.5)" }}>
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page Header (inner pages) ────────────────────────────────────────────────
function PageHeader({ label, title, sub, compact }: { label: string; title: string; sub: string; compact?: boolean }) {
  return (
    <div style={{ background: INK, paddingTop: compact ? 16 : 140 }} className="pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="chip mb-4">{label}</div>
        <h1 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: "#fff", letterSpacing: "-.03em", lineHeight: 1.1 }} className="mb-3">{title}</h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: ".95rem", maxWidth: 520 }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeSection({ go, news: newsProp }: { go: (s: Section) => void; news?: NewsItem[] }) {
  const news = newsProp ?? NEWS_INITIAL;
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
            {news.filter(n => !n.draft).slice(0, 3).map((n, idx) => (
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
function ProjectsSection({ adminBar, projects: projectsProp, setProjects, isAdmin }: {
  adminBar?: React.ReactNode; projects?: ProjectItem[];
  setProjects?: React.Dispatch<React.SetStateAction<ProjectItem[]>>; isAdmin?: boolean;
} = {}) {
  const projects = projectsProp ?? PROJECTS_INITIAL;
  const [filter, setFilter] = useState("Все");
  const [addProject, setAddProject] = useState(false);
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const allTypes = ["Все", ...Array.from(new Set(projects.map(p => p.type)))];
  const filtered = filter === "Все" ? projects : projects.filter(p => p.type === filter);

  const handleAdd = (p: ProjectItem) => { setProjects?.(prev => [p, ...prev]); setToast("Проект успешно опубликован!"); };
  const handleDelete = (id: number) => { setProjects?.(p => p.filter(x => x.id !== id)); setDeleteId(null); };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {adminBar}
      <PageHeader label="Портфолио" title="Проекты" sub="120+ реализованных объектов по всей России." compact={!!adminBar} />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isAdmin && (
            <div className="flex justify-end mb-4">
              <button onClick={() => setAddProject(true)} className="btn-primary text-sm"><Icon name="Plus" size={14} /> Добавить проект</button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-10">
            {allTypes.map(t => (
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
              <div key={p.id} className="card-lift rounded-2xl overflow-hidden group relative" style={{ border: "1px solid #E4E8F0" }}>
                {isAdmin && (
                  <button onClick={() => setDeleteId(p.id)}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-lg transition-colors"
                    style={{ background: "rgba(239,68,68,.85)" }} title="Удалить">
                    <Icon name="Trash2" size={13} style={{ color: "#fff" }} />
                  </button>
                )}
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
                    {p.year && <span className="flex items-center gap-1"><Icon name="Calendar" size={11} /> {p.year}</span>}
                    {p.area && <span className="flex items-center gap-1"><Icon name="Maximize2" size={11} /> {p.area}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {addProject && <AddProjectModal onClose={() => setAddProject(false)} onAdd={handleAdd}
        existingTypes={Array.from(new Set(projects.map(p => p.type)))} />}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="Trash2" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить проект?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center" style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-outline flex items-center justify-center">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toast уведомление ────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed bottom-6 left-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
      style={{ transform: "translateX(-50%)", background: "#10b981", color: "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".9rem", minWidth: 260 }}>
      <Icon name="CheckCircle" size={18} style={{ flexShrink: 0 }} />
      {message}
      <button onClick={onClose} className="ml-auto opacity-70 hover:opacity-100"><Icon name="X" size={14} /></button>
    </div>
  );
}

// ─── AddNewsModal ─────────────────────────────────────────────────────────────
function AddNewsModal({ onClose, onAdd }: { onClose: () => void; onAdd: (n: NewsItem) => void }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Компания");
  const [imgFile, setImgFile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Введите заголовок";
    if (!text.trim()) errs.text = "Введите текст";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const now = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    onAdd({ id: Date.now(), date: now, category, title, text: text.slice(0, 180), full: text, img: imgFile || undefined } as NewsItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Новая новость</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Категория</label>
              <select className="field" value={category} onChange={e => setCategory(e.target.value)}>
                {["Компания", "Проекты", "Тендеры", "Отрасль"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Заголовок *</label>
              <input className="field" value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }} placeholder="Введите заголовок новости"
                style={{ borderColor: errors.title ? "#ef4444" : undefined }} />
              {errors.title && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Текст новости *</label>
              <textarea className="field" rows={5} value={text} onChange={e => { setText(e.target.value); setErrors(p => ({ ...p, text: "" })); }} placeholder="Введите полный текст новости..."
                style={{ borderColor: errors.text ? "#ef4444" : undefined, resize: "vertical" }} />
              {errors.text && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.text}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Баннер / Картинка</label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer" style={{ border: "1.5px dashed #CBD5E1" }}>
                <Icon name="Image" size={16} style={{ color: MUT }} />
                <span style={{ fontSize: ".85rem", color: imgFile ? INK : MUT }}>{imgFile || "Прикрепить изображение (JPG, PNG)"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Опубликовать новость <Icon name="Send" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EditNewsModal ────────────────────────────────────────────────────────────
function EditNewsModal({ item, onClose, onSave }: { item: NewsItem; onClose: () => void; onSave: (n: NewsItem) => void }) {
  const [title, setTitle] = useState(item.title);
  const [text, setText] = useState(item.full);
  const [category, setCategory] = useState(item.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: "#f59e0b" }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Редактировать новость</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Категория</label>
              <select className="field" value={category} onChange={e => setCategory(e.target.value)}>
                {["Компания", "Проекты", "Тендеры", "Отрасль"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Заголовок</label>
              <input className="field" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Текст</label>
              <textarea className="field" rows={5} value={text} onChange={e => setText(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { onSave({ ...item, title, full: text, text: text.slice(0, 180), category }); onClose(); }} className="btn-primary flex-1 justify-center">Сохранить</button>
              <button onClick={onClose} className="btn-outline px-4">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AddProjectModal ──────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onAdd, existingTypes }: { onClose: () => void; onAdd: (p: ProjectItem) => void; existingTypes: string[] }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState(existingTypes[0] || "");
  const [customType, setCustomType] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<"Сдан" | "В процессе">("Сдан");
  const [imgFile, setImgFile] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Введите наименование";
    if (useCustom && !customType.trim()) errs.type = "Введите категорию";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ id: Date.now(), title, type: useCustom ? customType : type, year: year ? Number(year) : undefined, img: imgFile || PROJECTS_INITIAL[0].img, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: "#8b5cf6" }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Новый проект</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Категория</label>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setUseCustom(false)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: !useCustom ? INK : "#F7F8FC", color: !useCustom ? "#fff" : MUT, fontFamily: "'Inter',sans-serif" }}>Существующая</button>
                <button onClick={() => setUseCustom(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: useCustom ? INK : "#F7F8FC", color: useCustom ? "#fff" : MUT, fontFamily: "'Inter',sans-serif" }}>Новая категория</button>
              </div>
              {!useCustom
                ? <select className="field" value={type} onChange={e => setType(e.target.value)}>
                    {existingTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                : <input className="field" value={customType} onChange={e => { setCustomType(e.target.value); setErrors(p => ({ ...p, type: "" })); }} placeholder="Название новой категории"
                    style={{ borderColor: errors.type ? "#ef4444" : undefined }} />
              }
              {errors.type && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.type}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Наименование проекта *</label>
              <input className="field" value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }} placeholder="Название объекта"
                style={{ borderColor: errors.title ? "#ef4444" : undefined }} />
              {errors.title && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Год окончания</label>
                <input className="field" type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2026 (необязательно)" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Статус</label>
                <select className="field" value={status} onChange={e => setStatus(e.target.value as "Сдан" | "В процессе")}>
                  <option value="Сдан">Сдан</option>
                  <option value="В процессе">В процессе</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Фото для баннера</label>
              <label className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer" style={{ border: "1.5px dashed #CBD5E1" }}>
                <Icon name="Image" size={16} style={{ color: MUT }} />
                <span style={{ fontSize: ".85rem", color: imgFile ? INK : MUT }}>{imgFile || "Прикрепить изображение (JPG, PNG)"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => setImgFile(e.target.files?.[0]?.name || "")} />
              </label>
            </div>
            <button onClick={handle} className="btn-primary w-full justify-center">Опубликовать проект <Icon name="Send" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News Modal ────────────────────────────────────────────────────────────────
function NewsModal({ news, onClose }: { news: typeof NEWS_INITIAL[0]; onClose: () => void }) {
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
function NewsSection({ adminBar, news: newsProp, setNews, isAdmin }: {
  adminBar?: React.ReactNode; news?: NewsItem[];
  setNews?: React.Dispatch<React.SetStateAction<NewsItem[]>>; isAdmin?: boolean;
} = {}) {
  const news = newsProp ?? NEWS_INITIAL;
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [addNews, setAddNews] = useState(false);
  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = (n: NewsItem) => { setNews?.(p => [n, ...p]); setToast("Новость успешно опубликована!"); };
  const handleEdit = (n: NewsItem) => { setNews?.(p => p.map(x => x.id === n.id ? n : x)); setToast("Новость обновлена!"); };
  const handleDelete = (id: number) => { setNews?.(p => p.filter(x => x.id !== id)); setDeleteId(null); };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {adminBar}
      <PageHeader label="Пресс-центр" title="Новости" sub="Актуальные события компании и отрасли." compact={!!adminBar} />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <button onClick={() => setAddNews(true)} className="btn-primary text-sm"><Icon name="Plus" size={14} /> Добавить новость</button>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {news.filter(n => !n.draft).map(n => (
                <div key={n.id} className="card-lift rounded-2xl overflow-hidden group" style={{ border: "1px solid #E4E8F0" }}>
                  <div className="flex">
                    <div style={{ width: 3, background: B, flexShrink: 0 }} />
                    <div className="p-6 flex-1 cursor-pointer" onClick={() => setSelected(n)}>
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
                    {isAdmin && (
                      <div className="flex flex-col gap-1 p-3 border-l" style={{ borderColor: "#E4E8F0" }}>
                        <button onClick={() => setEditItem(n)} className="p-2 rounded-lg hover:bg-blue-50 transition-colors" title="Редактировать">
                          <Icon name="Pencil" size={14} style={{ color: B }} />
                        </button>
                        <button onClick={() => setDeleteId(n.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors" title="Удалить">
                          <Icon name="Trash2" size={14} style={{ color: "#ef4444" }} />
                        </button>
                      </div>
                    )}
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
      {editItem && <EditNewsModal item={editItem} onClose={() => setEditItem(null)} onSave={handleEdit} />}
      {addNews && <AddNewsModal onClose={() => setAddNews(false)} onAdd={handleAdd} />}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="Trash2" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить новость?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center" style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-outline flex items-center justify-center">Отмена</button>
            </div>
          </div>
        </div>
      )}
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
  const [tConsent, setTConsent] = useState(!!user.consentGiven);
  const [showTPrivacy, setShowTPrivacy] = useState(false);
  const [errors, setErrors] = useState<{ company?: string; inn?: string; consent?: string }>({});

  const handleSubmit = () => {
    const newErrors: { company?: string; inn?: string; consent?: string } = {};
    if (!company.trim()) newErrors.company = "Введите название компании";
    if (!inn.trim()) newErrors.inn = "Введите ИНН";
    if (!tConsent) newErrors.consent = "Необходимо дать согласие на обработку персональных данных";
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
    <>
      {showTPrivacy && <PrivacyPolicyModal onClose={() => setShowTPrivacy(false)} />}
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
            {/* Согласие на ПД */}
            {!user.consentGiven && (
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="flex-shrink-0 mt-0.5">
                    <div onClick={() => { setTConsent(v => !v); setErrors(p => ({ ...p, consent: "" })); }}
                      className="w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer"
                      style={{ background: tConsent ? B : "#fff", border: `2px solid ${errors.consent ? "#ef4444" : tConsent ? B : "#CBD5E1"}` }}>
                      {tConsent && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
                    </div>
                  </div>
                  <span style={{ fontSize: ".82rem", color: "#4B5563", lineHeight: 1.5, fontFamily: "'Golos Text',sans-serif" }}>
                    Даю согласие на обработку персональных данных в соответствии с{" "}
                    <button type="button" onClick={e => { e.stopPropagation(); setShowTPrivacy(true); }}
                      style={{ color: B, fontWeight: 600, textDecoration: "underline" }}>
                      Политикой конфиденциальности
                    </button>
                  </span>
                </label>
                {errors.consent && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 6 }}>{errors.consent}</p>}
              </div>
            )}
            {user.consentGiven && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "rgba(22,163,74,.06)", border: "1px solid rgba(22,163,74,.2)" }}>
                <Icon name="ShieldCheck" size={14} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: ".78rem", color: "#15803d", fontFamily: "'Inter',sans-serif" }}>
                  Согласие на обработку данных дано {user.consentDate ? `(${user.consentDate})` : ""}
                </span>
              </div>
            )}
            <button onClick={handleSubmit} disabled={!tConsent}
              className="btn-primary w-full justify-center"
              style={{ opacity: tConsent ? 1 : 0.45, cursor: tConsent ? "pointer" : "not-allowed" }}>
              Отправить заявку <Icon name="Send" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

type TenderItem = { id: number; title: string; deadline: string; budget: string; type: string; status: string };

function EditTenderModal({ tender, onClose, onSave }: { tender: TenderItem; onClose: () => void; onSave: (t: TenderItem) => void }) {
  const [title, setTitle] = useState(tender.title);
  const [deadline, setDeadline] = useState(tender.deadline);
  const [budget, setBudget] = useState(tender.budget);
  const [type, setType] = useState(tender.type);
  const [status, setStatus] = useState(tender.status);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Введите наименование";
    if (!deadline.trim()) errs.deadline = "Укажите дату";
    if (!budget.trim()) errs.budget = "Укажите сумму";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...tender, title, deadline, budget, type, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Редактировать тендер</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Наименование *</label>
              <input className="field" value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
                style={{ borderColor: errors.title ? "#ef4444" : undefined }} />
              {errors.title && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Дата окончания *</label>
                <input className="field" value={deadline} onChange={e => { setDeadline(e.target.value); setErrors(p => ({ ...p, deadline: "" })); }}
                  style={{ borderColor: errors.deadline ? "#ef4444" : undefined }} placeholder="15 мая 2026" />
                {errors.deadline && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.deadline}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Сумма *</label>
                <input className="field" value={budget} onChange={e => { setBudget(e.target.value); setErrors(p => ({ ...p, budget: "" })); }}
                  style={{ borderColor: errors.budget ? "#ef4444" : undefined }} placeholder="от 5 млн ₽" />
                {errors.budget && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.budget}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Тип</label>
                <select className="field" value={type} onChange={e => setType(e.target.value)}>
                  <option>Открытый конкурс</option>
                  <option>Запрос котировок</option>
                  <option>Запрос предложений</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Статус</label>
                <select className="field" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">Активный</option>
                  <option value="closed">Завершён</option>
                </select>
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
            <button onClick={handle} className="btn-primary w-full justify-center">Сохранить изменения</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TendersSection({ user, onAddApp, go, isAdmin, adminBar, tenders: tendersProp, setTenders: setTendersProp }: {
  user: User | null; onAddApp: (app: Omit<TenderApp, "id">) => void;
  go: (s: Section) => void; isAdmin?: boolean; adminBar?: React.ReactNode;
  tenders?: TenderItem[]; setTenders?: React.Dispatch<React.SetStateAction<TenderItem[]>>;
}) {
  const [tab, setTab] = useState<"active" | "closed">("active");
  const [localTenders, setLocalTenders] = useState<TenderItem[]>(tendersProp ?? TENDERS_INITIAL);
  const tenders = tendersProp ?? localTenders;
  const setTenders = setTendersProp ?? setLocalTenders;
  const [docsModal, setDocsModal] = useState<TenderItem | null>(null);
  const [applyModal, setApplyModal] = useState<TenderItem | null>(null);
  const [editModal, setEditModal] = useState<TenderItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addModal, setAddModal] = useState(false);
  const filtered = tenders.filter(t => t.status === tab);

  const handleAdd = (t: { title: string; deadline: string; budget: string; fileName: string }) => {
    setTenders(p => [...p, { id: Date.now(), title: t.title, deadline: t.deadline, budget: t.budget, type: "Открытый конкурс", status: "active" }]);
  };

  return (
    <div>
      {adminBar}
      <PageHeader label="Закупки" title="Тендеры" sub="Актуальные конкурсные процедуры компании." compact={!!adminBar} />
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Admin toolbar */}
          {isAdmin && (
            <div className="mb-6 flex justify-end">
              <button onClick={() => setAddModal(true)} className="btn-primary text-sm">
                <Icon name="Plus" size={14} /> Добавить тендер
              </button>
            </div>
          )}
          {!user && !isAdmin && (
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
                style={{ fontFamily: "'Inter',sans-serif", background: tab === t ? "#fff" : "transparent", color: tab === t ? INK : MUT, boxShadow: tab === t ? "0 1px 4px rgba(10,15,30,.08)" : "none" }}>
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
                    {tender.status === "active"
                      ? <span style={{ fontSize: ".72rem", color: "#16a34a", fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>● Активный</span>
                      : <span style={{ fontSize: ".72rem", color: MUT, fontWeight: 700, fontFamily: "'Inter',sans-serif" }}>● Завершён</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, marginBottom: 8 }}>{tender.title}</h3>
                  <div className="flex gap-5" style={{ fontSize: ".82rem", color: MUT }}>
                    <span className="flex items-center gap-1.5"><Icon name="Calendar" size={12} /> {tender.deadline}</span>
                    <span className="flex items-center gap-1.5"><Icon name="DollarSign" size={12} /> {tender.budget}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 items-center">
                  {isAdmin ? (
                    <>
                      <button onClick={() => setEditModal(tender)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: B + "12", color: B, border: `1px solid ${B}30`, fontFamily: "'Inter',sans-serif" }}>
                        <Icon name="Edit" size={13} /> Редактировать
                      </button>
                      <button onClick={() => setDeleteId(tender.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: "rgba(239,68,68,.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,.2)", fontFamily: "'Inter',sans-serif" }}>
                        <Icon name="Trash2" size={13} /> Удалить
                      </button>
                    </>
                  ) : (
                    <>
                      {user
                        ? <button onClick={() => setDocsModal(tender)} className="btn-outline text-xs py-2 px-4"><Icon name="FileText" size={13} /> Документы</button>
                        : <button onClick={() => go("contacts")} className="btn-outline text-xs py-2 px-4"><Icon name="Lock" size={13} /> Документы</button>
                      }
                      {tender.status === "active" && (
                        user
                          ? <button onClick={() => setApplyModal(tender)} className="btn-primary text-xs py-2 px-4">Подать заявку</button>
                          : <button onClick={() => go("contacts")} className="btn-primary text-xs py-2 px-4" style={{ opacity: 0.6 }}>Подать заявку</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>
                <Icon name="FileText" size={36} style={{ color: "#E4E8F0", margin: "0 auto 12px" }} />
                <p>Нет тендеров в этой категории</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="Trash2" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить тендер?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", color: INK, fontFamily: "'Inter',sans-serif" }}>Отмена</button>
              <button onClick={() => { setTenders(p => p.filter(t => t.id !== deleteId)); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center"
                style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {addModal && <AddTenderModal onClose={() => setAddModal(false)} onAdd={handleAdd} />}
      {editModal && <EditTenderModal tender={editModal} onClose={() => setEditModal(null)} onSave={updated => setTenders(p => p.map(t => t.id === updated.id ? updated : t))} />}
      {docsModal && <TenderDocsModal tender={docsModal as typeof TENDERS[0]} onClose={() => setDocsModal(null)} />}
      {applyModal && user && (
        <TenderApplyModal
          tender={applyModal as typeof TENDERS[0]}
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

function EditDocNameModal({ doc, onClose, onSave }: { doc: DocItem; onClose: () => void; onSave: (name: string) => void }) {
  const [name, setName] = useState(doc.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div style={{ height: 4, background: B }} />
        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Переименовать документ</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100" style={{ color: MUT }}><Icon name="X" size={16} /></button>
          </div>
          <input className="field mb-5" value={name} onChange={e => setName(e.target.value)} placeholder="Название документа" />
          <div className="flex gap-2">
            <button onClick={() => { if (name.trim()) onSave(name.trim()); }} className="btn-primary flex-1 justify-center">Сохранить</button>
            <button onClick={onClose} className="btn-outline px-5">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocsSection({ user, adminBar, docSections: docSectionsProp, setDocSections, isAdmin }: {
  user: User | null; adminBar?: React.ReactNode;
  docSections?: DocSection[]; setDocSections?: React.Dispatch<React.SetStateAction<DocSection[]>>;
  isAdmin?: boolean;
}) {
  const sections = docSectionsProp ?? DOCS_INITIAL;
  const [open, setOpen] = useState<Record<string, boolean>>({ contractors: true });
  const [openSub, setOpenSub] = useState<Record<string, boolean>>({});
  const [addModal, setAddModal] = useState(false);
  const [editDoc, setEditDoc] = useState<{ sectionId: string; doc: DocItem } | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<{ sectionId: string; docId: number } | null>(null);
  const [deleteSection, setDeleteSection] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const toggle = (id: string) => setOpen(p => ({ ...p, [id]: !p[id] }));
  const toggleSub = (id: string) => setOpenSub(p => ({ ...p, [id]: !p[id] }));

  const handleAddDoc = (sectionId: string, sectionTitle: string, docName: string, fileName: string) => {
    const newDoc: DocItem = { id: Date.now(), name: docName, type: "PDF", size: fileName ? "—" : "—" };
    setDocSections?.(prev => {
      const existing = prev.find(s => s.id === sectionId);
      if (existing) return prev.map(s => s.id === sectionId ? { ...s, docs: [...(s.docs || []), newDoc] } : s);
      return [...prev, { id: sectionId, title: sectionTitle, icon: "FileText", docs: [newDoc] }];
    });
    setToast("Документ добавлен!");
  };

  const handleEditDoc = (sectionId: string, doc: DocItem, newName: string) => {
    setDocSections?.(prev => prev.map(s => s.id === sectionId ? { ...s, docs: (s.docs || []).map(d => d.id === doc.id ? { ...d, name: newName } : d) } : s));
    setEditDoc(null);
    setToast("Документ обновлён!");
  };

  const handleDeleteDoc = (sectionId: string, docId: number) => {
    setDocSections?.(prev => prev.map(s => s.id === sectionId ? { ...s, docs: (s.docs || []).filter(d => d.id !== docId) } : s));
    setDeleteDoc(null);
    setToast("Документ удалён!");
  };

  const handleDeleteSection = (sectionId: string) => {
    setDocSections?.(prev => prev.filter(s => s.id !== sectionId));
    setDeleteSection(null);
    setToast("Раздел удалён!");
  };

  const renderDocRow = (doc: DocItem, sectionId: string) => (
    <div key={doc.id} className="flex items-center justify-between py-3 px-4 rounded-xl transition-all group"
      style={{ border: "1px solid #E4E8F0" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,102,255,.3)"; (e.currentTarget as HTMLElement).style.background = "#F8FBFF"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E4E8F0"; (e.currentTarget as HTMLElement).style.background = ""; }}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ fontFamily: "'Inter',sans-serif", background: "rgba(239,68,68,.08)", color: "#ef4444" }}>PDF</div>
        <div className="min-w-0">
          <div style={{ fontWeight: 600, fontSize: ".85rem", color: INK, fontFamily: "'Inter',sans-serif", lineHeight: 1.4 }} className="truncate">{doc.name}</div>
          <div style={{ fontSize: ".72rem", color: MUT, marginTop: 2 }}>{doc.size}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-3 flex-shrink-0">
        {!isAdmin && (
          <button className="flex items-center gap-1.5" style={{ color: B, fontSize: ".8rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
            <Icon name="Download" size={13} /> Скачать
          </button>
        )}
        {isAdmin && (
          <>
            <button onClick={() => setEditDoc({ sectionId, doc })} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Переименовать">
              <Icon name="Pencil" size={13} style={{ color: B }} />
            </button>
            <button onClick={() => setDeleteDoc({ sectionId, docId: doc.id })} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Удалить">
              <Icon name="Trash2" size={13} style={{ color: "#ef4444" }} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      {adminBar}
      <PageHeader label="Документы" title="Документация" sub="Нормативные, технические и корпоративные документы компании." compact={!!adminBar} />
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <button onClick={() => setAddModal(true)} className="btn-primary text-sm"><Icon name="Plus" size={14} /> Добавить документ</button>
            </div>
          )}
          {!user && !isAdmin && (
            <div className="rounded-2xl p-4 mb-8 flex items-center gap-3" style={{ background: "#F7F8FC", border: "1px solid #E4E8F0" }}>
              <Icon name="Lock" size={16} style={{ color: MUT }} />
              <span style={{ fontSize: ".85rem", color: MUT }}>Некоторые документы доступны только авторизованным пользователям.</span>
            </div>
          )}
          <div className="space-y-3">
            {sections.map(section => (
              <div key={section.id} className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
                <button onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-all"
                  style={{ background: open[section.id] ? "#F0F7FF" : "#fff" }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: open[section.id] ? B : "#F7F8FC" }}>
                      <Icon name={section.icon as "HardHat"} size={16} style={{ color: open[section.id] ? "#fff" : MUT }} />
                    </div>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".92rem", color: INK, lineHeight: 1.4 }}>{section.title}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                    {isAdmin && (
                      <button onClick={e => { e.stopPropagation(); setDeleteSection(section.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Удалить раздел">
                        <Icon name="Trash2" size={13} style={{ color: "#ef4444" }} />
                      </button>
                    )}
                    <Icon name={open[section.id] ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: MUT, marginLeft: 4 }} />
                  </div>
                </button>

                {open[section.id] && (
                  <div className="px-5 pb-5" style={{ borderTop: "1px solid #E4E8F0" }}>
                    {section.subsections ? (
                      <div className="pt-4 space-y-3">
                        {section.subsections.map(sub => (
                          <div key={sub.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid #E4E8F0" }}>
                            <button onClick={() => toggleSub(sub.id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-left transition-all"
                              style={{ background: openSub[sub.id] ? "#F7F8FC" : "#fff" }}>
                              <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: ".85rem", color: INK }}>{sub.title}</span>
                              <Icon name={openSub[sub.id] ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: MUT, flexShrink: 0, marginLeft: 12 }} />
                            </button>
                            {openSub[sub.id] && (
                              <div className="px-4 pb-4 space-y-2" style={{ borderTop: "1px solid #E4E8F0", paddingTop: 12 }}>
                                {sub.docs.map(doc => renderDocRow(doc, section.id))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="pt-4 space-y-2">
                        {(section.docs || []).map(doc => renderDocRow(doc, section.id))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {addModal && <AddDocModal onClose={() => setAddModal(false)} docSections={sections} onAdd={handleAddDoc} />}

      {editDoc && (
        <EditDocNameModal
          doc={editDoc.doc}
          onClose={() => setEditDoc(null)}
          onSave={name => handleEditDoc(editDoc.sectionId, editDoc.doc, name)}
        />
      )}

      {deleteDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="Trash2" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить документ?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteDoc(deleteDoc.sectionId, deleteDoc.docId)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center" style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
              <button onClick={() => setDeleteDoc(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-outline flex items-center justify-center">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {deleteSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
              <Icon name="FolderX" size={24} style={{ color: "#ef4444" }} />
            </div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Удалить раздел?</h3>
            <p style={{ fontSize: ".85rem", color: MUT, marginBottom: 20 }}>Все документы в разделе будут удалены. Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteSection(deleteSection)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center" style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Удалить</button>
              <button onClick={() => setDeleteSection(null)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-outline flex items-center justify-center">Отмена</button>
            </div>
          </div>
        </div>
      )}
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
  const [showPrivacyCab, setShowPrivacyCab] = useState(false);
  const [revokeConfirm, setRevokeConfirm] = useState(false);

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

        {/* Блок согласия на ПД */}
        {tab === "profile" && (
          <>
            {showPrivacyCab && <PrivacyPolicyModal onClose={() => setShowPrivacyCab(false)} />}
            <div className="bg-white rounded-2xl p-6 mt-5" style={{ border: "1px solid #E4E8F0" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="ShieldCheck" size={16} style={{ color: user.consentGiven ? "#16a34a" : "#f59e0b" }} />
                    <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".92rem", color: INK }}>Согласие на обработку персональных данных</h3>
                  </div>
                  {user.consentGiven ? (
                    <p style={{ fontSize: ".8rem", color: MUT }}>
                      Дано{user.consentDate ? ` ${user.consentDate}` : ""}. Данные обрабатываются согласно{" "}
                      <button onClick={() => setShowPrivacyCab(true)} style={{ color: B, fontWeight: 600, textDecoration: "underline", fontSize: ".8rem" }}>
                        Политике конфиденциальности
                      </button>
                    </p>
                  ) : (
                    <p style={{ fontSize: ".8rem", color: "#d97706" }}>Согласие не дано или отозвано.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {user.consentGiven ? (
                    <button onClick={() => setRevokeConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: "rgba(239,68,68,.07)", border: "1.5px solid rgba(239,68,68,.25)", color: "#ef4444", fontFamily: "'Inter',sans-serif" }}>
                      <Icon name="ShieldOff" size={14} /> Отозвать согласие
                    </button>
                  ) : (
                    <button onClick={() => setUser({ ...user, consentGiven: true, consentDate: new Date().toLocaleDateString("ru-RU") })}
                      className="flex items-center gap-2 btn-primary text-sm">
                      <Icon name="ShieldCheck" size={14} /> Дать согласие
                    </button>
                  )}
                </div>
              </div>
            </div>
            {revokeConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,15,30,.6)", backdropFilter: "blur(4px)" }}>
                <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,.1)" }}>
                    <Icon name="ShieldOff" size={24} style={{ color: "#ef4444" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: 8 }}>Отозвать согласие?</h3>
                  <p style={{ fontSize: ".84rem", color: MUT, lineHeight: 1.6, marginBottom: 20 }}>
                    После отзыва вы не сможете подавать заявки на тендеры. Ваши данные будут удалены в течение 30 дней в соответствии с 152-ФЗ.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => { setUser({ ...user, consentGiven: false, consentDate: undefined }); setRevokeConfirm(false); }}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white"
                      style={{ background: "#ef4444", fontFamily: "'Inter',sans-serif" }}>Отозвать</button>
                    <button onClick={() => setRevokeConfirm(false)} className="flex-1 py-2.5 rounded-xl font-semibold text-sm btn-outline flex items-center justify-center">Отмена</button>
                  </div>
                </div>
              </div>
            )}
          </>
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
  blocked?: boolean; consentGiven?: boolean; consentDate?: string;
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

  const [phone, setPhone] = useState("");

  const handle = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Введите ФИО";
    if (!login.trim()) errs.login = "Введите логин";
    else if (!/^[a-zA-Z0-9_.-]+$/.test(login)) errs.login = "Логин должен содержать только латинские буквы, цифры и _ . -";
    if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errs.email = "Введите корректный email (пример: user@mail.ru)";
    if (phone && !/^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(phone)) errs.phone = "Введите корректный номер телефона";
    if (!pw.trim()) errs.pw = "Введите пароль";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ id: Date.now(), name, login, email: email || login + "@ao-urst.ru", phone: phone || "—", role: "user", regDate: new Date().toLocaleDateString("ru-RU") });
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
              <input type="email" className="field" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }} placeholder="ivanov@ao-urst.ru"
                style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
              {errors.email && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Телефон</label>
              <input className="field" value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }} placeholder="+7 (___) ___-__-__"
                style={{ borderColor: errors.phone ? "#ef4444" : undefined }} />
              {errors.phone && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{errors.phone}</p>}
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

function AddDocModal({ onClose, onAdd, docSections: docSectionsProp }: {
  onClose: () => void;
  onAdd?: (sectionId: string, sectionTitle: string, docName: string, fileName: string) => void;
  docSections?: DocSection[];
}) {
  const sections = docSectionsProp ?? DOCS_INITIAL;
  const existingSections = sections.filter(s => !s.subsections).map(s => ({ id: s.id, title: s.title }));
  const [useExisting, setUseExisting] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState(existingSections[0]?.id || "");
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
    const sectionId = useExisting ? selectedSectionId : newSection.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const sectionTitle = useExisting ? (existingSections.find(s => s.id === selectedSectionId)?.title || selectedSectionId) : newSection;
    onAdd?.(sectionId, sectionTitle, docName, fileName);
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
                <select className="field" value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)}>
                  {existingSections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
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
    <div style={{ background: "#F7F8FC", minHeight: "100vh" }}>
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
const USERS_INITIAL: AdminUser[] = [
  { id: 1, name: "Иванов Иван Петрович", login: "ivanov", email: "ivanov@ao-urst.ru", phone: "+7 (916) 111-11-11", role: "user", regDate: "10.01.2026", consentGiven: true, consentDate: "10.01.2026" },
  { id: 2, name: "Петрова Мария Сергеевна", login: "petrova", email: "petrova@ao-urst.ru", phone: "+7 (916) 222-22-22", role: "user", regDate: "15.02.2026", consentGiven: true, consentDate: "15.02.2026" },
  { id: 3, name: "Сидоров Алексей Юрьевич", login: "sidorov", email: "sidorov@ao-urst.ru", phone: "+7 (916) 333-33-33", role: "contentadmin", regDate: "20.03.2026", consentGiven: true, consentDate: "20.03.2026" },
  { id: 4, name: "Козлова Анна Дмитриевна", login: "kozlova", email: "kozlova@ao-urst.ru", phone: "+7 (916) 444-44-44", role: "user", regDate: "01.04.2026", consentGiven: false },
  { id: 5, name: "Новиков Дмитрий Игоревич", login: "novikov", email: "novikov@ao-urst.ru", phone: "+7 (916) 555-55-55", role: "user", regDate: "05.04.2026", blocked: true, consentGiven: false },
];

function UsersPage({ onBack, users, setUsers }: { onBack: () => void; users: AdminUser[]; setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>> }) {
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const changeRole = (id: number, role: AdminUser["role"]) => setUsers(p => p.map(u => u.id === id ? { ...u, role } : u));
  const toggleBlock = (id: number) => setUsers(p => p.map(u => u.id === id ? { ...u, blocked: !u.blocked } : u));
  const deleteUser = (id: number) => { setUsers(p => p.filter(u => u.id !== id)); setDeleteId(null); };

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh" }}>
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
            style={{ gridTemplateColumns: "2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr 0.9fr auto", color: MUT, fontFamily: "'Inter',sans-serif", background: "#F7F8FC", borderBottom: "1px solid #E4E8F0" }}>
            <span>ФИО</span><span>Логин</span><span>Email</span><span>Телефон</span><span>Дата регистрации</span><span>Роль</span><span>Согласие ПД</span><span>Действия</span>
          </div>

          {users.map((u, i) => (
            <div key={u.id} className="px-5 py-4 flex flex-col md:grid gap-4 items-center"
              style={{ gridTemplateColumns: "2fr 1.2fr 1.5fr 1.2fr 1fr 0.8fr 0.9fr auto", borderBottom: i < users.length - 1 ? "1px solid #E4E8F0" : "none", opacity: u.blocked ? 0.6 : 1 }}>
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
              {/* Согласие ПД */}
              <div>
                {u.consentGiven ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#16a34a", fontFamily: "'Inter',sans-serif" }}>
                      <Icon name="ShieldCheck" size={12} /> Дано
                    </span>
                    {u.consentDate && <span style={{ fontSize: ".68rem", color: MUT }}>{u.consentDate}</span>}
                  </div>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#ef4444", fontFamily: "'Inter',sans-serif" }}>
                    <Icon name="ShieldOff" size={12} /> Не дано
                  </span>
                )}
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
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center"
                style={{ background: "#F7F8FC", border: "1.5px solid #E4E8F0", color: INK, fontFamily: "'Inter',sans-serif" }}>Отмена</button>
              <button onClick={() => deleteUser(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center"
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

// ─── Admin Cabinet (профиль для супер/контент-адимнов) ────────────────────────
function AdminCabinet({ user, setUser, onBack, onLogout, roleLabel }: {
  user: User; setUser: (u: User) => void; onBack: () => void; onLogout: () => void; roleLabel: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [pwMode, setPwMode] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [saved, setSaved] = useState(false);

  const accentColor = user.role === "superadmin" ? "#f59e0b" : "#3385FF";

  const handleSave = () => {
    setUser({ ...user, name, phone });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePw = () => {
    if (!pw.trim()) { setPwErr("Введите новый пароль"); return; }
    if (pw !== pw2) { setPwErr("Пароли не совпадают"); return; }
    setPwErr("");
    setPwMode(false);
    setPw(""); setPw2("");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.6)" }}>
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Личный кабинет</div>
            <div style={{ fontSize: ".78rem", marginTop: 2, color: accentColor, fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{roleLabel}</div>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm" style={{ color: "#10b981", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>
              <Icon name="CheckCircle" size={15} /> Изменения сохранены
            </span>
          )}
          <button onClick={onLogout} title="Выйти" className="ml-auto p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.5)" }}>
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid #E4E8F0" }}>
          {/* Avatar + name */}
          <div className="flex items-center gap-5 mb-8">
            <div className="flex items-center justify-center text-white rounded-2xl flex-shrink-0"
              style={{ width: 64, height: 64, background: accentColor, fontSize: "1.6rem", fontFamily: "'Inter',sans-serif", fontWeight: 800, borderRadius: 16 }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.15rem", color: INK }}>{user.name}</div>
              <div style={{ fontSize: ".8rem", color: accentColor, fontWeight: 600, fontFamily: "'Inter',sans-serif", marginTop: 2 }}>{roleLabel}</div>
              <div style={{ fontSize: ".78rem", color: MUT, marginTop: 2 }}>{user.email}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Личные данные</h2>
            {!editing
              ? <button onClick={() => setEditing(true)} className="btn-outline text-xs py-2 px-4"><Icon name="Pencil" size={13} /> Редактировать</button>
              : <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-primary text-xs py-2 px-4"><Icon name="Check" size={13} /> Сохранить</button>
                  <button onClick={() => setEditing(false)} className="btn-outline text-xs py-2 px-4">Отмена</button>
                </div>
            }
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Имя и фамилия</label>
              {editing
                ? <input className="field" value={name} onChange={e => setName(e.target.value)} />
                : <div className="px-3 py-2.5 rounded-xl" style={{ background: "#F7F8FC", fontSize: ".88rem", color: INK }}>{name}</div>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Email</label>
              <div className="px-3 py-2.5 rounded-xl flex items-center gap-2" style={{ background: "#F7F8FC", fontSize: ".88rem", color: MUT }}>
                {user.email} <Icon name="Lock" size={12} style={{ color: "#CBD5E1" }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Телефон</label>
              {editing
                ? <input className="field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" />
                : <div className="px-3 py-2.5 rounded-xl" style={{ background: "#F7F8FC", fontSize: ".88rem", color: INK }}>{phone || "—"}</div>}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Роль</label>
              <div className="px-3 py-2.5 rounded-xl" style={{ background: accentColor + "12", fontSize: ".88rem", color: accentColor, fontWeight: 600 }}>{roleLabel}</div>
            </div>
          </div>
        </div>

        {/* Password block */}
        <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid #E4E8F0" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>Безопасность</h2>
            {!pwMode && (
              <button onClick={() => setPwMode(true)} className="btn-outline text-xs py-2 px-4">
                <Icon name="Key" size={13} /> Сменить пароль
              </button>
            )}
          </div>

          {!pwMode ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "#F7F8FC" }}>
              <Icon name="Shield" size={16} style={{ color: "#10b981" }} />
              <span style={{ fontSize: ".85rem", color: MUT }}>Пароль установлен. Последнее изменение — неизвестно.</span>
            </div>
          ) : (
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Новый пароль</label>
                <input type="password" className="field" value={pw} onChange={e => { setPw(e.target.value); setPwErr(""); }} placeholder="Введите новый пароль" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: MUT, fontFamily: "'Inter',sans-serif" }}>Повторите пароль</label>
                <input type="password" className="field" value={pw2} onChange={e => { setPw2(e.target.value); setPwErr(""); }} placeholder="Повторите пароль"
                  style={{ borderColor: pwErr ? "#ef4444" : undefined }} />
                {pwErr && <p style={{ color: "#ef4444", fontSize: ".75rem", marginTop: 4 }}>{pwErr}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={handlePw} className="btn-primary text-sm"><Icon name="Check" size={14} /> Сохранить пароль</button>
                <button onClick={() => { setPwMode(false); setPw(""); setPw2(""); setPwErr(""); }} className="btn-outline text-sm">Отмена</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Superadmin Dashboard ─────────────────────────────────────────────────────
function SuperAdminDashboard({ user, setUser, onLogout, go, cfg, onCfgSave, initialView, onViewChange, sharedNews, setSharedNews, sharedProjects, sharedTenders, setSharedTenders, sharedDocs, setSharedDocs, sharedUsers, setSharedUsers }: {
  user: User; setUser: (u: User) => void; onLogout: () => void; go: (s: Section) => void;
  cfg: SiteConfig; onCfgSave: (c: SiteConfig) => void;
  initialView?: "dashboard" | "cabinet"; onViewChange?: () => void;
  sharedNews?: NewsItem[]; setSharedNews?: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  sharedProjects?: ProjectItem[];
  sharedTenders?: TenderItem[]; setSharedTenders?: React.Dispatch<React.SetStateAction<TenderItem[]>>;
  sharedDocs?: DocSection[]; setSharedDocs?: React.Dispatch<React.SetStateAction<DocSection[]>>;
  sharedUsers?: AdminUser[]; setSharedUsers?: React.Dispatch<React.SetStateAction<AdminUser[]>>;
}) {
  const [view, setView] = useState<"dashboard" | "users" | "settings" | "cabinet">(initialView || "dashboard");
  const [users, setUsers] = useState<AdminUser[]>(sharedUsers ?? USERS_INITIAL);
  const [news, setNews] = useState<NewsItem[]>(sharedNews ?? NEWS_INITIAL);
  const [toast, setToast] = useState("");

  useEffect(() => { if (sharedNews) setNews(sharedNews); }, [sharedNews]);
  const handleSetNews: React.Dispatch<React.SetStateAction<NewsItem[]>> = (action) => {
    setNews(action);
    setSharedNews?.(action);
  };

  useEffect(() => { if (sharedUsers) setUsers(sharedUsers); }, [sharedUsers]);
  const handleSetUsers: React.Dispatch<React.SetStateAction<AdminUser[]>> = (action) => {
    setUsers(action);
    setSharedUsers?.(action);
  };

  useEffect(() => {
    if (initialView && initialView !== "dashboard") {
      setView(initialView);
      onViewChange?.();
    }
  }, [initialView]);
  const [addTender, setAddTender] = useState(false);
  const [addUser, setAddUser] = useState(false);
  const [addDoc, setAddDoc] = useState(false);

  const publishedNews = news.filter(n => !n.draft);
  const draftNews = news.filter(n => n.draft);

  const activeTendersCount = (sharedTenders ?? TENDERS_INITIAL).filter(t => t.status === "active").length;
  const docsArr = sharedDocs ?? DOCS_INITIAL;
  const totalDocs = docsArr.reduce((acc, s) => {
    if (s.docs) return acc + s.docs.length;
    if (s.subsections) return acc + s.subsections.reduce((a, sub) => a + sub.docs.length, 0);
    return acc;
  }, 0);
  const statCards = [
    { icon: "Newspaper", label: "Новости", value: publishedNews.length, sub: `Черновиков: ${draftNews.length}`, color: "#0066FF", onClick: () => go("news") },
    { icon: "HardHat", label: "Проекты", value: (sharedProjects ?? PROJECTS_INITIAL).length, sub: `Всего: ${(sharedProjects ?? PROJECTS_INITIAL).length}`, color: "#8b5cf6", onClick: () => go("projects") },
    { icon: "FileText", label: "Тендеры", value: activeTendersCount, sub: `Активных: ${activeTendersCount}`, color: "#f59e0b", onClick: () => go("tenders") },
    { icon: "Users", label: "Пользователи", value: users.length, sub: `Всего: ${users.length}`, color: "#10b981", onClick: () => setView("users") },
    { icon: "BookOpen", label: "Документы", value: totalDocs, sub: `Разделов: ${docsArr.length}`, color: "#6366f1", onClick: () => go("docs") },
  ];

  const recentNews = [...news]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(n => ({ title: n.title, date: n.date, draft: !!n.draft }));

  const recentUsers = [...users]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)
    .map(u => {
      const shortName = u.name.split(" ").map((p, i) => i === 0 ? p : p.charAt(0) + ".").join(" ");
      return { name: shortName, when: u.regDate, role: u.role };
    });

  const actions = [
    { icon: "FileText", label: "Добавить тендер", onClick: () => setAddTender(true), color: "#f59e0b" },
    { icon: "UserPlus", label: "Добавить пользователя", onClick: () => setAddUser(true), color: "#10b981" },
    { icon: "FilePlus", label: "Добавить документ", onClick: () => setAddDoc(true), color: "#0066FF" },
    { icon: "Settings", label: "Настройки", onClick: () => setView("settings"), color: "#6b7280" },
  ];

  if (view === "users") return <UsersPage onBack={() => setView("dashboard")} users={users} setUsers={handleSetUsers} />;
  if (view === "settings") return <SettingsPage cfg={cfg} onSave={onCfgSave} onBack={() => setView("dashboard")} />;
  if (view === "cabinet") return <AdminCabinet user={user} setUser={setUser} onBack={() => setView("dashboard")} onLogout={onLogout} roleLabel="Суперадминистратор" />;

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh" }}>
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Дашборд АО УРСТ</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Панель суперадминистратора</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("cabinet")} className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all hover:bg-white/10">
              <div style={{ background: "#f59e0b", width: 32, height: 32, borderRadius: 8, fontSize: ".9rem", fontFamily: "'Inter',sans-serif", fontWeight: 800 }}
                className="flex items-center justify-center text-white flex-shrink-0">{user.name.charAt(0)}</div>
              <div className="text-left hidden md:block">
                <div style={{ color: "#fff", fontSize: ".82rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
                <div style={{ fontSize: ".68rem", color: "#f59e0b", fontFamily: "'Inter',sans-serif" }}>Личный кабинет →</div>
              </div>
            </button>
            <button onClick={onLogout} title="Выйти" className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.5)" }}>
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние новости</div>
              <button onClick={() => go("news")} style={{ fontSize: ".72rem", color: B, fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Все →</button>
            </div>
            <div className="space-y-2.5">
              {recentNews.map((n, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.draft ? "#f59e0b" : B, flexShrink: 0 }} />
                  <span style={{ fontSize: ".85rem", color: INK, flex: 1 }} className="truncate">{n.title}</span>
                  {n.draft ? (
                    <span style={{ fontSize: ".7rem", background: "rgba(245,158,11,.1)", color: "#f59e0b", padding: "2px 8px", borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>черновик</span>
                  ) : (
                    <span style={{ fontSize: ".72rem", color: MUT, flexShrink: 0 }}>{n.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние пользователи</div>
              <button onClick={() => setView("users")} style={{ fontSize: ".72rem", color: B, fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Все →</button>
            </div>
            <div className="space-y-2.5">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: ROLE_COLORS[u.role] + "18", flexShrink: 0, fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".78rem", color: ROLE_COLORS[u.role] }}
                    className="flex items-center justify-center">{u.name.charAt(0)}</div>
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
              <button key={i} onClick={a.onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: a.color + "10", border: `1.5px solid ${a.color}30`, fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: a.color }}>
                <Icon name={a.icon as "Plus"} size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {addTender && <AddTenderModal onClose={() => setAddTender(false)} onAdd={t => { setSharedTenders?.(p => [...p, { id: Date.now(), title: t.title, deadline: t.deadline, budget: t.budget, type: "Открытый конкурс", status: "active" }]); setToast("Тендер успешно создан!"); }} />}
      {addUser && <AddUserModal onClose={() => setAddUser(false)} onAdd={u => { setUsers(p => [...p, u]); setToast("Пользователь добавлен!"); }} />}
      {addDoc && <AddDocModal onClose={() => setAddDoc(false)} docSections={docsArr} onAdd={(sectionId, sectionTitle, docName, fileName) => {
        setSharedDocs?.(prev => {
          const existing = prev.find(s => s.id === sectionId);
          const newDoc: DocItem = { id: Date.now(), name: docName, type: "PDF", size: fileName ? "—" : "—" };
          if (existing) return prev.map(s => s.id === sectionId ? { ...s, docs: [...(s.docs || []), newDoc] } : s);
          return [...prev, { id: sectionId, title: sectionTitle, icon: "FileText", docs: [newDoc] }];
        });
        setToast("Документ опубликован!");
      }} />}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ─── ContentAdmin Dashboard ───────────────────────────────────────────────────
function ContentAdminDashboard({ user, setUser, onLogout, initialView, onViewChange, news, setNews, projects, setProjects, go }: {
  user: User; setUser: (u: User) => void; onLogout: () => void;
  initialView?: "dashboard" | "cabinet"; onViewChange?: () => void;
  news: NewsItem[]; setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  projects: ProjectItem[]; setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  go: (s: Section) => void;
}) {
  const [view, setView] = useState<"dashboard" | "cabinet">(initialView || "dashboard");
  const [addNews, setAddNews] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (initialView && initialView !== "dashboard") {
      setView(initialView);
      onViewChange?.();
    }
  }, [initialView]);

  const recentNews = [...news].sort((a, b) => b.id - a.id).slice(0, 5);

  const statCards = [
    { icon: "Newspaper", label: "Новости", value: news.length, sub: `Всего: ${news.length}`, color: "#0066FF", onClick: () => go("news") },
    { icon: "HardHat", label: "Проекты", value: projects.length, sub: `Всего: ${projects.length}`, color: "#8b5cf6", onClick: () => go("projects") },
  ];

  const handleAddNews = (n: NewsItem) => { setNews(p => [n, ...p]); setToast("Новость успешно опубликована!"); };
  const handleAddProject = (p: ProjectItem) => { setProjects(prev => [p, ...prev]); setToast("Проект успешно опубликован!"); };

  if (view === "cabinet") return <AdminCabinet user={user} setUser={setUser} onBack={() => setView("dashboard")} onLogout={onLogout} roleLabel="Контент-администратор" />;

  return (
    <div style={{ background: "#F7F8FC", minHeight: "100vh" }}>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* Top bar */}
      <div style={{ background: INK, borderBottom: "1px solid rgba(255,255,255,.06)" }} className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-.02em" }}>Дашборд АО УРСТ</div>
            <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.4)", marginTop: 2 }}>Панель контент-администратора</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("cabinet")} className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all hover:bg-white/10">
              <div style={{ background: "#3385FF", width: 32, height: 32, borderRadius: 8, fontSize: ".9rem", fontFamily: "'Inter',sans-serif", fontWeight: 800 }}
                className="flex items-center justify-center text-white flex-shrink-0">{user.name.charAt(0)}</div>
              <div className="text-left hidden md:block">
                <div style={{ color: "#fff", fontSize: ".82rem", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>{user.name}</div>
                <div style={{ fontSize: ".68rem", color: "#3385FF", fontFamily: "'Inter',sans-serif" }}>Личный кабинет →</div>
              </div>
            </button>
            <button onClick={onLogout} title="Выйти" className="p-2 rounded-xl hover:bg-white/10 transition-all" style={{ color: "rgba(255,255,255,.5)" }}>
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statCards.map((s, i) => (
            <button key={i} onClick={s.onClick} className="bg-white rounded-2xl p-5 card-lift text-left" style={{ border: "1px solid #E4E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "18", marginBottom: 12 }} className="flex items-center justify-center">
                <Icon name={s.icon as "Users"} size={20} style={{ color: s.color }} />
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: INK, letterSpacing: "-.03em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: ".8rem", fontWeight: 600, color: INK, fontFamily: "'Inter',sans-serif", marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: ".72rem", color: s.color, marginTop: 3 }}>{s.sub}</div>
            </button>
          ))}
        </div>

        {/* News table */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
          <div className="flex items-center justify-between mb-3">
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, letterSpacing: ".04em", textTransform: "uppercase" }}>Последние новости</div>
            <button onClick={() => go("news")} style={{ fontSize: ".72rem", color: B, fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Все →</button>
          </div>
          {recentNews.length === 0
            ? <p style={{ fontSize: ".85rem", color: MUT }}>Новостей пока нет</p>
            : <div className="space-y-3">
                {recentNews.map((n) => (
                  <div key={n.id} className="flex items-center gap-3">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: B, flexShrink: 0 }} />
                    <span style={{ fontSize: ".85rem", color: INK, flex: 1 }} className="truncate">{n.title}</span>
                    <span style={{ fontSize: ".72rem", color: MUT, flexShrink: 0 }}>{n.date}</span>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid #E4E8F0" }}>
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 14, letterSpacing: ".04em", textTransform: "uppercase" }}>Быстрые действия</div>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: "Newspaper", label: "Добавить новость", onClick: () => setAddNews(true), color: "#0066FF" },
              { icon: "HardHat", label: "Добавить проект", onClick: () => setAddProject(true), color: "#8b5cf6" },
            ].map((a, i) => (
              <button key={i} onClick={a.onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                style={{ background: a.color + "10", border: `1.5px solid ${a.color}30`, fontSize: ".82rem", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: a.color }}>
                <Icon name={a.icon as "Plus"} size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {addNews && <AddNewsModal onClose={() => setAddNews(false)} onAdd={handleAddNews} />}
      {addProject && <AddProjectModal onClose={() => setAddProject(false)} onAdd={handleAddProject}
        existingTypes={[...new Set(projects.map(p => p.type))]} />}
    </div>
  );
}

// ─── Search Section ───────────────────────────────────────────────────────────
function SearchSection({ query, user, news, projects, tenders, docSections, go, onLogin }: {
  query: string;
  user: User | null;
  news: NewsItem[];
  projects: ProjectItem[];
  tenders: TenderItem[];
  docSections: DocSection[];
  go: (s: Section) => void;
  onLogin: () => void;
}) {
  const isAuth = !!user;
  const q = query.toLowerCase().trim();

  const matchedNews = news.filter(n => !n.draft && (
    n.title.toLowerCase().includes(q) ||
    n.text.toLowerCase().includes(q) ||
    n.full.toLowerCase().includes(q)
  ));

  const matchedProjects = projects.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.type.toLowerCase().includes(q)
  );

  const matchedTenders = tenders.filter(t =>
    t.title.toLowerCase().includes(q)
  );

  const allDocs: Array<{ name: string; section: string }> = [];
  docSections.forEach(s => {
    if (s.docs) s.docs.forEach(d => allDocs.push({ name: d.name, section: s.title }));
    if (s.subsections) s.subsections.forEach(sub => sub.docs.forEach(d => allDocs.push({ name: d.name, section: sub.title })));
  });
  const matchedDocs = allDocs.filter(d => d.name.toLowerCase().includes(q));

  const hasGuestHidden = !isAuth && (matchedTenders.length > 0 || matchedDocs.length > 0);
  const totalPublic = matchedNews.length + matchedProjects.length;
  const totalAuth = matchedTenders.length + matchedDocs.length;
  const total = isAuth ? totalPublic + totalAuth : totalPublic;

  const sectionHeader = (icon: string, title: string, count: number) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: B + "15" }}>
        <Icon name={icon as "Search"} size={18} style={{ color: B }} />
      </div>
      <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1rem", color: INK }}>{title}</h2>
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: B + "15", color: B, fontFamily: "'Inter',sans-serif" }}>{count}</span>
    </div>
  );

  return (
    <div style={{ background: "#F7F8FC", minHeight: "calc(100vh - 90px)", paddingTop: 90 }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Шапка */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Search" size={22} style={{ color: B }} />
            <h1 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: INK, letterSpacing: "-.02em" }}>
              Результаты поиска
            </h1>
          </div>
          <p style={{ fontSize: ".9rem", color: MUT }}>
            По запросу <strong style={{ color: INK }}>«{query}»</strong>
            {total > 0 ? ` найдено ${total} ${total === 1 ? "результат" : total < 5 ? "результата" : "результатов"}` : " ничего не найдено"}
          </p>
        </div>

        {/* Баннер для гостей если есть скрытые результаты */}
        {hasGuestHidden && (
          <div className="rounded-2xl p-4 mb-8 flex items-center gap-3" style={{ background: "#FFF8ED", border: "1.5px solid #f59e0b30" }}>
            <Icon name="Lock" size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: ".88rem", color: "#92400e", fontWeight: 600, fontFamily: "'Inter',sans-serif" }}>
                Некоторые результаты доступны только после входа в систему
              </span>
              <span style={{ fontSize: ".82rem", color: "#a16207", marginLeft: 6 }}>
                (тендеры и документация)
              </span>
              <button onClick={onLogin} className="ml-3 text-sm font-semibold underline" style={{ color: "#f59e0b", fontFamily: "'Inter',sans-serif" }}>Войти</button>
            </div>
          </div>
        )}

        {total === 0 && !hasGuestHidden && (
          <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid #E4E8F0" }}>
            <Icon name="SearchX" size={40} style={{ color: "#D1D5DB", margin: "0 auto 16px" }} />
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "1.05rem", color: INK, marginBottom: 8 }}>Ничего не найдено</h3>
            <p style={{ fontSize: ".88rem", color: MUT, marginBottom: 20 }}>Попробуйте изменить запрос или перейдите в один из разделов:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(["news", "projects", "tenders", "docs"] as Section[]).map(s => (
                <button key={s} onClick={() => go(s)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: B + "10", border: `1.5px solid ${B}30`, color: B, fontFamily: "'Inter',sans-serif" }}>
                  {s === "news" ? "Новости" : s === "projects" ? "Проекты" : s === "tenders" ? "Тендеры" : "Документация"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-10">
          {/* 📰 Новости */}
          {matchedNews.length > 0 && (
            <div>
              {sectionHeader("Newspaper", "Новости", matchedNews.length)}
              <div className="space-y-3">
                {matchedNews.map(n => (
                  <button key={n.id} onClick={() => go("news")}
                    className="w-full bg-white rounded-2xl p-5 text-left transition-all hover:shadow-md"
                    style={{ border: "1px solid #E4E8F0" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="chip" style={{ fontSize: ".68rem" }}>{n.category}</span>
                      <span style={{ fontSize: ".72rem", color: MUT }}>{n.date}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, marginBottom: 6, lineHeight: 1.4 }}>
                      <SearchHighlight text={n.title} query={q} />
                    </h3>
                    <p style={{ fontSize: ".85rem", color: MUT, lineHeight: 1.6 }} className="line-clamp-2">
                      <SearchHighlight text={n.text} query={q} />
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🏗️ Проекты */}
          {matchedProjects.length > 0 && (
            <div>
              {sectionHeader("HardHat", "Проекты", matchedProjects.length)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedProjects.map(p => (
                  <button key={p.id} onClick={() => go("projects")}
                    className="bg-white rounded-2xl overflow-hidden text-left transition-all hover:shadow-md"
                    style={{ border: "1px solid #E4E8F0" }}>
                    <div className="relative" style={{ height: 120 }}>
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,9,26,.7), transparent)" }} />
                      <span className="absolute bottom-2 left-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: p.status === "Сдан" ? "rgba(34,197,94,.85)" : "rgba(0,102,255,.85)", color: "#fff", fontFamily: "'Inter',sans-serif" }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 4 }}>
                        <SearchHighlight text={p.title} query={q} />
                      </h3>
                      <span style={{ fontSize: ".75rem", color: MUT }}>{p.type}{p.year ? ` · ${p.year}` : ""}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 📋 Тендеры — только авторизованным */}
          {isAuth && matchedTenders.length > 0 && (
            <div>
              {sectionHeader("FileText", "Тендеры", matchedTenders.length)}
              <div className="space-y-3">
                {matchedTenders.map(t => (
                  <button key={t.id} onClick={() => go("tenders")}
                    className="w-full bg-white rounded-2xl p-5 text-left transition-all hover:shadow-md"
                    style={{ border: "1px solid #E4E8F0" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".95rem", color: INK, marginBottom: 4, lineHeight: 1.4 }}>
                          <SearchHighlight text={t.title} query={q} />
                        </h3>
                        <div className="flex gap-3" style={{ fontSize: ".78rem", color: MUT }}>
                          <span>{t.type}</span>
                          <span>{t.budget}</span>
                          <span>до {t.deadline}</span>
                        </div>
                      </div>
                      <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: t.status === "active" ? "rgba(34,197,94,.1)" : "rgba(107,114,128,.1)", color: t.status === "active" ? "#16a34a" : "#6b7280", fontFamily: "'Inter',sans-serif" }}>
                        {t.status === "active" ? "Активен" : "Завершён"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 📁 Документация — только авторизованным */}
          {isAuth && matchedDocs.length > 0 && (
            <div>
              {sectionHeader("BookOpen", "Документация", matchedDocs.length)}
              <div className="space-y-3">
                {matchedDocs.map((d, i) => (
                  <button key={i} onClick={() => go("docs")}
                    className="w-full bg-white rounded-2xl p-5 text-left transition-all hover:shadow-md"
                    style={{ border: "1px solid #E4E8F0" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(239,68,68,.08)", color: "#ef4444", fontFamily: "'Inter',sans-serif" }}>PDF</div>
                      <div>
                        <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: 2 }}>
                          <SearchHighlight text={d.name} query={q} />
                        </h3>
                        <span style={{ fontSize: ".75rem", color: MUT }}>{d.section}</span>
                      </div>
                      <Icon name="ArrowRight" size={14} style={{ color: MUT, marginLeft: "auto" }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchHighlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "#FEF08A", color: INK, borderRadius: 3, padding: "0 2px" }}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ go, cfg }: { go: (s: Section) => void; cfg: SiteConfig }) {
  const labels: Record<Section, string> = { home: "Главная", about: "О компании", projects: "Проекты", news: "Новости", tenders: "Тендеры", docs: "Документация", contacts: "Контакты", cabinet: "Личный кабинет", search: "Поиск" };
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
  const [adminInitialView, setAdminInitialView] = useState<"dashboard" | "cabinet">("dashboard");
  const [news, setNews] = useState<NewsItem[]>(NEWS_INITIAL);
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECTS_INITIAL);
  const [tenders, setTenders] = useState<TenderItem[]>(TENDERS_INITIAL);
  const [docSections, setDocSections] = useState<DocSection[]>(DOCS_INITIAL);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, date: "15 апреля 2026", subject: "Строительный проект", text: "Добрый день! Интересует возможность сотрудничества по строительству объекта в Подмосковье. Прошу предоставить информацию о ваших услугах.", reply: "Добрый день! Спасибо за обращение. Мы готовы рассмотреть ваш проект. Наш менеджер свяжется с вами в течение одного рабочего дня.", replyDate: "16 апреля 2026" },
    { id: 2, date: "10 апреля 2026", subject: "Партнёрство", text: "Здравствуйте, хотели бы обсудить возможность партнёрства в рамках тендера на строительство дороги." },
  ]);
  const [tenderApps, setTenderApps] = useState<TenderApp[]>([
    { id: 1, date: "5 апреля 2026", tenderTitle: "Проектирование объектов инфраструктуры", company: "ООО СтройПроект", inn: "7712345678", status: "review", feedback: "Ваша заявка принята в работу. Ожидайте результатов рассмотрения до 25 апреля 2026." },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>(USERS_INITIAL);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);

  const go = (s: Section) => { setSection(s); setMob(false); };
  const logout = () => { setUser(null); go("home"); };

  const handleSearch = (q: string) => { setSearchQuery(q); setSection("search"); setMob(false); };

  const handleRegister = (u: User) => {
    const newAdminUser: AdminUser = {
      id: Date.now(),
      name: u.name,
      login: u.email.split("@")[0],
      email: u.email,
      phone: u.phone || "—",
      role: "user",
      regDate: new Date().toLocaleDateString("ru-RU"),
      consentGiven: u.consentGiven,
      consentDate: u.consentDate,
    };
    setUsers(prev => [...prev, newAdminUser]);
    setUser(u);
  };

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

  // Суперадмин — дашборд или публичные разделы
  if (user?.role === "superadmin") {
    const adminSections: Section[] = ["news", "projects", "tenders", "docs"];
    const isPublicSection = adminSections.includes(section);
    const goToCabinet = () => { setAdminInitialView("cabinet"); go("home"); };
    const superAdminBar = <AdminBackBar go={go} user={user} onCabinet={goToCabinet} onLogout={logout} />;
    return (
      <div>
        {isPublicSection ? (
          <main>
            {section === "news"     && <NewsSection adminBar={superAdminBar} news={news} />}
            {section === "projects" && <ProjectsSection adminBar={superAdminBar} projects={projects} />}
            {section === "tenders"  && <TendersSection user={user} onAddApp={handleAddApp} go={go} isAdmin adminBar={superAdminBar} tenders={tenders} setTenders={setTenders} />}
            {section === "docs"     && <DocsSection adminBar={superAdminBar} user={user} docSections={docSections} setDocSections={setDocSections} isAdmin />}
          </main>
        ) : (
          <SuperAdminDashboard user={user} setUser={setUser as (u: User) => void} onLogout={logout} go={go} cfg={cfg} onCfgSave={setCfg}
            initialView={adminInitialView} onViewChange={() => setAdminInitialView("dashboard")}
            sharedNews={news} setSharedNews={setNews}
            sharedProjects={projects} sharedTenders={tenders} setSharedTenders={setTenders}
            sharedDocs={docSections} setSharedDocs={setDocSections}
            sharedUsers={users} setSharedUsers={setUsers} />
        )}
      </div>
    );
  }

  // Контент-админ видит дашборд или публичные страницы
  if (user?.role === "contentadmin") {
    const adminSections: Section[] = ["news", "projects"];
    const isPublicSection = adminSections.includes(section);
    const goToCabinet = () => { setAdminInitialView("cabinet"); go("home"); };
    const contentAdminBar = <AdminBackBar go={go} user={user} onCabinet={goToCabinet} onLogout={logout} />;
    if (isPublicSection) return (
      <div>
        {section === "news"     && <NewsSection adminBar={contentAdminBar} news={news} setNews={setNews} isAdmin />}
        {section === "projects" && <ProjectsSection adminBar={contentAdminBar} projects={projects} setProjects={setProjects} isAdmin />}
      </div>
    );
    return (
      <div>
        <ContentAdminDashboard user={user} setUser={setUser as (u: User) => void} onLogout={logout}
          initialView={adminInitialView} onViewChange={() => setAdminInitialView("dashboard")}
          news={news} setNews={setNews} projects={projects} setProjects={setProjects} go={go} />
      </div>
    );
  }

  return (
    <div>
      <Header active={section} go={go} user={user} onLogin={() => setShowLogin(true)} onLogout={logout} mob={mob} setMob={setMob} cfg={cfg} onSearch={handleSearch} />
      <main>
        {section === "home"     && <HomeSection go={go} news={news} />}
        {section === "about"    && <AboutSection />}
        {section === "projects" && <ProjectsSection projects={projects} />}
        {section === "news"     && <NewsSection news={news} />}
        {section === "tenders"  && <TendersSection user={user} onAddApp={handleAddApp} go={go} tenders={tenders} />}
        {section === "docs"     && <DocsSection user={user} docSections={docSections} />}
        {section === "contacts" && <ContactsSection user={user} onLogin={() => setShowLogin(true)} onSend={handleSendMessage} />}
        {section === "cabinet"  && user?.role === "user" && (
          <UserCabinet user={user} setUser={setUser} messages={messages} tenderApps={tenderApps} go={go} />
        )}
        {section === "search" && (
          <SearchSection
            query={searchQuery}
            user={user}
            news={news}
            projects={projects}
            tenders={tenders}
            docSections={docSections}
            go={go}
            onLogin={() => setShowLogin(true)}
          />
        )}
      </main>
      {section !== "cabinet" && section !== "search" && <Footer go={go} cfg={cfg} />}
      {section === "search" && <Footer go={go} cfg={cfg} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={u => { setUser(u); setShowLogin(false); }} onRegister={u => { handleRegister(u); setShowLogin(false); }} />}
    </div>
  );
}