# Rio AI Studio V0.7 — Core Rebuild

هذه النسخة إعادة بناء فعلية لأساس Rio AI Studio بعد اعتبار V0.6/V0.6.1 نماذج واجهة فقط.

## ما يعمل فعليًا

- واجهة Mobile-first حقيقية مع تخطيط منفصل للشاشات الكبيرة.
- Text → Video عبر fal.ai / Veo 3.1.
- Image → Video عبر fal.ai / Veo 3.1.
- Text → Image عبر fal.ai / FLUX.
- Text → Speech عبر ElevenLabs من خلال fal.ai.
- Speech → Text عبر ElevenLabs Scribe من خلال fal.ai.
- كتابة وترجمة AI عبر OpenRouter router داخل fal.ai.
- تحليل صورة المنتج وبناء حملة عبر Vision + LLM.
- محرر محلي: استيراد فيديو/صورة، نص، فلاتر، مقاسات، صوت، حفظ مشروع، تصدير فيديو WebM/صورة PNG.
- رفع PDF وDOCX وTXT وMD وCSV واستخراج النص من PDF/Word/النصوص، ثم تلخيص/مفاهيم/اختبار/اختبار شامل عبر LLM.
- حفظ المشاريع والملفات محليًا في المتصفح.

## متطلبات Vercel

Environment Variable:

`FAL_KEY`

اختياري:

`RIO_LLM_MODEL` — نموذج OpenRouter الذي يمر عبر fal.

`RIO_VISION_MODEL` — نموذج الرؤية الذي يمر عبر fal.

لا تضع FAL_KEY داخل JavaScript أو GitHub.

## نشر GitHub Pages + Vercel

GitHub Pages يعرض الواجهة فقط. طلبات `/api/*` يتم إرسالها من الواجهة إلى:

`https://rio-ai-studio.vercel.app`

يمكن تغيير العنوان من الإعدادات إذا تغير اسم مشروع Vercel.

## ملاحظة مهمة

الدفع والاشتراكات الحقيقية غير موصولة في V0.7؛ لذلك لا توجد أزرار شراء وهمية. رصيد AI الحالي تجريبي ومحلي فقط.
