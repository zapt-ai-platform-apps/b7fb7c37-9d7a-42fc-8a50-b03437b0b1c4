# راديو عربي احترافي

هذا التطبيق هو راديو عربي احترافي يتيح للمستخدمين الاستماع إلى العديد من محطات الراديو العربية من مختلف البلدان.

## الميزات

- **عرض قائمة الدول العربية**: يحتوي التطبيق على قائمة شاملة بالدول العربية التي يمكن للمستخدمين الاختيار منها.
- **عرض محطات الراديو لكل دولة**: عند اختيار دولة، يتم عرض قائمة بمحطات الراديو المتاحة لتلك الدولة.
- **البحث عن محطات الراديو**: يمكن للمستخدمين البحث عن محطات الراديو باستخدام مربع البحث للعثور بسهولة على المحطة التي يرغبون في الاستماع إليها.
- **تشغيل محطات الراديو**: بمجرد اختيار محطة راديو، يمكن للمستخدمين تشغيلها والاستماع إليها مباشرة من خلال التطبيق.
- **واجهة مستخدم سهلة الاستخدام**: يتميز التطبيق بواجهة مستخدم بسيطة وسهلة الاستخدام مع تصميم متجاوب يعمل بشكل جيد على جميع الأجهزة.

## رحلات المستخدم

### 1. اختيار دولة والاستماع إلى محطة راديو

- **الخطوة 1**: فتح التطبيق.
- **الخطوة 2**: رؤية قائمة الدول العربية المتاحة.
- **الخطوة 3**: التمرير عبر القائمة ومعاينة أسماء الدول.
- **الخطوة 4**: النقر على الدولة المرغوبة.
- **الخطوة 5**: تظهر قائمة بمحطات الراديو المتاحة لتلك الدولة.
- **الخطوة 6**: التمرير عبر قائمة المحطات والنقر على المحطة المرغوبة.
- **الخطوة 7**: تظهر تفاصيل المحطة مع مشغل الصوت.
- **الخطوة 8**: يبدأ تشغيل محطة الراديو المختارة ويمكن للمستخدمين التحكم في التشغيل.

### 2. البحث عن محطة راديو في دولة محددة

- **الخطوة 1**: فتح التطبيق.
- **الخطوة 2**: اختيار دولة من القائمة.
- **الخطوة 3**: استخدام مربع البحث في الجزء العلوي من قائمة المحطات.
- **الخطوة 4**: إدخال اسم المحطة أو جزء منه.
- **الخطوة 5**: يتم تحديث القائمة تلقائيًا لعرض المحطات التي تطابق البحث.
- **الخطوة 6**: النقر على المحطة المرغوبة وتشغيلها كما هو موضح في الرحلة السابقة.

## الخدمات الخارجية

- **Radio Browser API**: يستخدم التطبيق واجهة برمجة التطبيقات Radio Browser للحصول على قائمة الدول العربية ومحطات الراديو لكل دولة. هذه الواجهة هي خدمة مجانية تتيح الوصول إلى محطات الراديو من جميع أنحاء العالم.

## الملاحظات

- التطبيق مجاني تمامًا للاستخدام.
- لا يتطلب التطبيق تسجيل دخول أو إنشاء حساب.
- تم تصميم التطبيق ليكون سريعًا وبسيطًا لمساعدة المستخدمين على الوصول السريع إلى محطات الراديو المفضلة لديهم.

## كيفية التشغيل

- قم بتثبيت التبعيات باستخدام `npm install`.
- ابدأ التطبيق في وضع التطوير باستخدام `npm run dev`.
- قم ببناء التطبيق للإنتاج باستخدام `npm run build`.

## ملاحظة حول استخدام البيانات

- عند استخدام التطبيق، سيتم استهلاك بيانات الإنترنت بسبب بث محطات الراديو.
- تأكد من أنك متصل بشبكة Wi-Fi لتجنب استخدام بيانات الهاتف المحمول الزائدة.

## التقنيات المستخدمة

- **SolidJS**: إطار عمل المستخدم لبناء واجهات مستخدم سريعة.
- **Tailwind CSS**: إطار عمل تصميم لمساعدة في تصميم واجهة المستخدم بسرعة.
- **Vite**: أداة بناء سريعة للتطوير.
- **Sentry**: لمراقبة الأخطاء والأداء.
- **Progressier**: لإضافة وظائف PWA (تطبيقات الويب التقدمية).

## المتغيرات البيئية

تحتاج إلى إنشاء ملف `.env` في جذر المشروع يحتوي على المتغيرات التالية:

- `VITE_PUBLIC_SENTRY_DSN`: مفتاح DSN لخدمة Sentry.
- `VITE_PUBLIC_APP_ENV`: بيئة التطبيق (مثل `production`).
- `VITE_PUBLIC_APP_ID`: معرف التطبيق المستخدم من قبل Progressier.