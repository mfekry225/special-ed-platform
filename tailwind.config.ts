import type { Config } from "tailwindcss";

// نظام الألوان الخاص بمنصة "رِفق" — مصمم لتقليل الحمل الحسي
// (مهم جداً للأطفال ذوي طيف التوحد وأولياء أمورهم) مع الحفاظ على
// طابع دافئ وودود يليق ببيئة علاجية/تربوية وليس بيئة "شركة تقنية".
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // الأخضر المزرق (التِرَسي) — اللون الأساسي: هدوء، ثقة، نمو
        rifq: {
          50: "#EEF5F4",
          100: "#D9E9E7",
          200: "#B3D3CF",
          300: "#84B7B1",
          400: "#4F918B",
          500: "#2F6F6B", // اللون الأساسي
          600: "#265A57",
          700: "#1E4644",
          800: "#173736",
          900: "#122A29",
        },
        // العنبري — لون التشجيع والتنبيهات الإيجابية (بديل عن التراكوتا الشائع)
        amber: {
          50: "#FDF6EC",
          100: "#FBEACF",
          400: "#EFB870",
          500: "#E8A24D",
          600: "#C9832F",
        },
        // السَّجعي (أخضر مورّق) — نجاح واكتمال الأهداف
        sage: {
          100: "#E7F0E4",
          400: "#9BBB94",
          500: "#7FA381",
          600: "#5F8362",
        },
        // مرجاني هادئ للتنبيهات/التنازل عن الأهداف — أدفأ من الأحمر الصارخ
        coral: {
          100: "#FBEAE6",
          500: "#D97D6C",
          600: "#B85F4F",
        },
        ink: {
          50: "#FBFAF7", // خلفية دافئة فاتحة
          100: "#F3F1EA",
          400: "#6B7876",
          700: "#2E3A38",
          900: "#1B2624",
        },
        dark: {
          bg: "#0F1B19",
          surface: "#162422",
          border: "#213534",
        },
      },
      fontFamily: {
        // Cairo لعناوين الواجهة العربية بطابع دافئ وودود
        display: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        // Tajawal لنصوص الواجهة (قراءة مريحة على الشاشات الصغيرة)
        body: ["var(--font-tajawal)", "Tahoma", "sans-serif"],
        // Inter للأرقام والبيانات (نِسَب، تواريخ، مقاييس)
        data: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(23, 55, 54, 0.12)",
        card: "0 2px 10px -2px rgba(23, 55, 54, 0.08)",
      },
      keyframes: {
        "ring-progress": {
          from: { strokeDashoffset: "var(--ring-start, 283)" },
          to: { strokeDashoffset: "var(--ring-end, 0)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "ring-progress": "ring-progress 0.9s cubic-bezier(0.4,0,0.2,1) forwards",
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-rtl")],
};

export default config;
