import { Unit } from './types';

export const UNITS: Unit[] = [
  {
    id: 'unit-1',
    title: 'مكونات الحاسب',
    description: 'تعرف على الأجزاء التي يتكون منها جهاز الحاسب وكيف تعمل معاً.',
    icon: 'Monitor',
    lessons: [
      {
        id: 'l1-1',
        title: 'ما هو الحاسب؟',
        content: 'الحاسب هو جهاز إلكتروني يمكنه استقبال البيانات ومعالجتها وتخزينها وإخراجها.',
        imageUrl: 'https://picsum.photos/seed/computer1/800/400',
        example: 'مثلما يستخدم الإنسان عقله للتفكير، يستخدم الحاسب المعالج (CPU) لمعالجة المعلومات.',
        activities: [
          {
            id: 'a1-1-1',
            type: 'mcq',
            question: 'أي من التالي يعتبر جهازاً إلكترونياً يعالج البيانات؟',
            choices: [
              { id: 'c1', text: 'الكتاب', isCorrect: false },
              { id: 'c2', text: 'الحاسب', isCorrect: true },
              { id: 'c3', text: 'القلم', isCorrect: false },
            ]
          }
        ]
      },
      {
        id: 'l1-2',
        title: 'الأجهزة والبرمجيات',
        content: 'ينقسم الحاسب إلى قسمين: الأجهزة (المكونات المادية) والبرمجيات (البرامج والتطبيقات).',
        imageUrl: 'https://picsum.photos/seed/hardware/800/400',
        example: 'الأجهزة هي مثل جسم الإنسان، والبرمجيات هي مثل الأفكار والذكاء.',
        activities: [
          {
            id: 'a1-2-1',
            type: 'mcq',
            question: 'ماذا نطلق على البرامج والتطبيقات في الحاسب؟',
            choices: [
              { id: 'c1', text: 'الأجهزة', isCorrect: false },
              { id: 'c2', text: 'البرمجيات', isCorrect: true },
              { id: 'c3', text: 'الشاشة', isCorrect: false },
            ]
          }
        ]
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        type: 'mcq',
        question: 'أي من هذه المكونات يعتبر من "الأجهزة"؟',
        choices: [
          { id: 'c1', text: 'لعبة ماين كرافت', isCorrect: false },
          { id: 'c2', text: 'لوحة المفاتيح', isCorrect: true },
          { id: 'c3', text: 'متصفح الإنترنت', isCorrect: false },
        ]
      }
    ]
  },
  {
    id: 'unit-2',
    title: 'الإنترنت',
    description: 'رحلة في عالم الشبكة العالمية وكيف نتواصل مع الآخرين.',
    icon: 'Globe',
    lessons: [
      {
        id: 'l2-1',
        title: 'ما هو الإنترنت؟',
        content: 'الإنترنت هو شبكة عالمية تربط ملايين الحواسيب حول العالم ببعضها البعض.',
        imageUrl: 'https://picsum.photos/seed/internet/800/400',
        example: 'تخيل الإنترنت كأنه مكتبة ضخمة جداً يمكنك الوصول إليها من منزلك.',
        activities: [
          {
            id: 'a2-1-1',
            type: 'mcq',
            question: 'الإنترنت يربط الحواسيب ببعضها حول العالم. هل هذا صحيح؟',
            choices: [
              { id: 'c1', text: 'نعم، صحيح', isCorrect: true },
              { id: 'c2', text: 'لا، خطأ', isCorrect: false },
            ]
          }
        ]
      }
    ],
    quiz: []
  },
  {
    id: 'unit-3',
    title: 'السلامة الرقمية',
    description: 'تعلم كيف تحمي نفسك ومعلوماتك أثناء استخدام الإنترنت.',
    icon: 'ShieldCheck',
    lessons: [
      {
        id: 'l3-1',
        title: 'كلمة المرور القوية',
        content: 'كلمة المرور هي مفتاح حسابك، يجب أن تكون قوية وصعبة التخمين.',
        imageUrl: 'https://picsum.photos/seed/safety/800/400',
        example: 'كلمة المرور القوية تحتوي على حروف وأرقام ورموز مثل (A#123s).',
        activities: [
          {
            id: 'a3-1-1',
            type: 'mcq',
            question: 'أي من كلمات المرور التالية تعتبر الأقوى؟',
            choices: [
              { id: 'c1', text: '123456', isCorrect: false },
              { id: 'c2', text: 'password', isCorrect: false },
              { id: 'c3', text: 'S@fety#2024', isCorrect: true },
            ]
          }
        ]
      }
    ],
    quiz: []
  }
];
