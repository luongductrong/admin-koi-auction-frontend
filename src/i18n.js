import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en/translation.json";
import viTranslation from "./locales/vi/translation.json";
import jpTranslation from "./locales/jp/translation.json";


i18n
    .use(LanguageDetector) // Sử dụng LanguageDetector để tự động phát hiện ngôn ngữ từ trình duyệt
    .use(initReactI18next) // Kết hợp với react-i18next để sử dụng với React
    .init({
        fallbackLng: "en", // Ngôn ngữ mặc định nếu ngôn ngữ người dùng không có trong danh sách hỗ trợ
        debug: true, // Bật chế độ debug để xem log

        interpolation: {
            escapeValue: false, // Ngăn chặn các vấn đề bảo mật liên quan đến XSS
        },

        resources: {
            en: { translation: enTranslation },
            vi: { translation: viTranslation },
            jp: { translation: jpTranslation },
        },
    });

export default i18n;
