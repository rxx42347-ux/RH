# Digital Trust Network V0.1 — Real Web Risk Core

هذه نسخة حقيقية وليست محاكاة.

## ما يعمل
- إدخال URL.
- API خلفي.
- تحقق من الرابط.
- اتصال حقيقي بـ Google Web Risk Lookup API.
- فحص MALWARE / SOCIAL_ENGINEERING / UNWANTED_SOFTWARE.
- شرح النتيجة.

## البنية
GitHub Pages → Cloudflare Worker → Google Web Risk.

لا تضع مفتاح Google داخل `index.html`. أضفه كـ Secret في الـWorker باسم `GOOGLE_WEB_RISK_API_KEY`.

بعد نشر الـWorker، غيّر طلب `/api/check` في `index.html` إلى عنوان الـWorker إذا كان على نطاق مختلف.

Google Web Risk Lookup يدعم URL واحدًا لكل طلب، وتوفر Google حاليًا 100,000 استعلام Lookup مجانًا شهريًا قبل التسعير حسب الاستخدام.
