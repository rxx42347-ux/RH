# CHANGELOG — V0.5.2

## إصلاح النشر والبنية

### تم إصلاح
- إزالة `functions` التي كانت تشير إلى ملفات JavaScript في الجذر مع `runtime: nodejs24.x`.
- إزالة سبب خطأ Vercel الخاص بـ **Function runtimes must have a valid version**.
- استخدام `builds` مع `@vercel/node` للوظائف الثلاث في الجذر.
- تثبيت Node.js `24.x` من `package.json`.

### تم تعديل
- `vercel.json`
- `package.json`
- `app.js`
- `ai.js`
- `status.js`
- `health.js`
- `README.md`

### تم إصلاح JavaScript
- إصلاح النصوص متعددة الأسطر في رسائل الخطأ والمساعدة.
- تحسين استعادة ملفات الصوت المحلية.
- حفظ نوع ملفات النتائج الناتجة من AI.
- تحسين حالة الوسائط داخل المحرر.

## V0.5.2 لا تعني أن كل خدمات المنتج أصبحت مكتملة
توليد AI يعتمد على `FAL_KEY` ومزود fal.ai. الدفع والحسابات السحابية ليست مربوطة بعد.
