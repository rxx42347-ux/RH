# Sentinel V0.2 — Real Browser Security Checks

هذه النسخة تستبدل الفحص التجريبي بفحوصات دفاعية حقيقية ينفذها المتصفح نفسه.

## الفحوصات
- Secure Context / HTTPS
- Web Crypto API
- localStorage
- IndexedDB
- Cookie setting
- Notification permission state بدون طلب الإذن
- Camera permission state عندما يسمح Permissions API
- Microphone permission state عندما يسمح Permissions API
- Geolocation permission state بدون طلب الموقع
- WebAuthn / Passkeys support
- Service Worker support
- Storage quota/usage estimate
- قراءة بعض HTTP security headers من نفس الموقع عند السماح بها

## الخصوصية
لا يتم طلب تشغيل الكاميرا أو الميكروفون أو الموقع، ولا يتم رفع هذه البيانات إلى خادم.
الفحص محدود بما يسمح به المتصفح.

## حدود مهمة
صفحة ويب لا تستطيع كشف Pegasus أو spyware متقدم على الهاتف بشكل موثوق. لذلك لا ندّعي ذلك.
للوصول إلى فحوصات Android الحقيقية نحتاج لاحقًا إلى تطبيق Android/agent أصلي بصلاحيات يوافق عليها المستخدم، مع بقاء الفحوصات دفاعية.
