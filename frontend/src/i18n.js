import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: {
        translation: {
            "welcome": "Bienvenue chez Rimy",
            "shop_now": "Acheter maintenant",
            "categories": "Catégories",
            "best_sellers": "Meilleures ventes",
            "sold_out": "Rupture de stock",
            "add_to_cart": "Commander sur WhatsApp",
            "lang_toggle": "العربية",
            "admin_panel": "Administration",
            "all": "Tous",
            "contact_us": "Contactez-nous",
            "latest_events": "Événements récents",
        }
    },
    ar: {
        translation: {
            "welcome": "مرحباً بكم في ريمي",
            "shop_now": "تسوق الآن",
            "categories": "الفئات",
            "best_sellers": "الأكثر مبيعاً",
            "sold_out": "نفذت الكمية",
            "add_to_cart": "اطلب عبر واتساب",
            "lang_toggle": "Français",
            "admin_panel": "لوحة التحكم",
            "all": "الكل",
            "contact_us": "اتصل بنا",
            "latest_events": "أحدث الفعاليات",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
