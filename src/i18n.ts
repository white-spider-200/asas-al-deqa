import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { serviceContentEn, serviceContentAr } from './i18n/serviceContent';

const resources = {
  en: {
    translation: {
      ...serviceContentEn,
      nav: {
        home: 'Home',
        services: 'Services',
        about: 'About',
        contact: 'Contact',
        institutional: 'Institutional',
        wealth: 'Wealth',
        blog: 'Blog'
      },
      nav_labels: {
        navigation: 'Navigation',
        heritage: 'Asas Al-Deqa Heritage',
        arabic: 'Arabic Version',
        english: 'English Version'
      },
      seo: {
        home_title: 'Asas Al-Deqa | Tax & Accounting Consultancy in Amman, Jordan',
        home_desc: 'Tax compliance, accounting services, and business consulting in Amman, Jordan. Precision in detail, excellence in action since 2014.',
        about_title: 'About Us | Asas Al-Deqa Tax & Accounting Jordan',
        about_desc: 'Since 2014, Asas Al-Deqa has delivered professional tax and accounting consultancy for SMEs and growing businesses across Jordan.',
        services_title: 'Tax & Accounting Services in Jordan | Asas Al-Deqa',
        services_desc: 'Tax compliance, accounting, tax management, litigation support, and ERP solutions for SMEs in Amman and across Jordan.',
        contact_title: 'Contact Asas Al-Deqa | Tax Consultants Amman',
        contact_desc: 'Book a consultation with Asas Al-Deqa in Khalda, Amman. Professional tax and accounting advisory for your business.',
        wealth_title: 'Wealth Management | Strategic Financial Advisory',
        wealth_desc: 'Bespoke wealth preservation blueprints and strategic financial architecture for high-net-worth individuals.',
        institutional_title: 'Institutional Services | Corporate Advisory',
        institutional_desc: 'Complex structural advisory and institutional financial solutions for large-scale operations.',
        insights_title: 'Tax & Accounting Insights Jordan | Asas Al-Deqa',
        insights_desc: 'Practical guidance on Jordan tax regulations, accounting practices, and business compliance from Asas Al-Deqa.'
      },
      hero: {
        title: {
          main: 'Precision in Detail,',
          accent: 'Excellence in Action.'
        },
        subtitle: 'Tax & Accounting Consultants.',
        description: 'Professional business solutions and consulting helping companies grow with confidence and efficiency.',
        brand_badge: 'Asas Al-Deqa · Tax & Accounting',
        cta_contact: 'Book a Consultation Now',
        cta_services: 'Our Services'
      },
      home: {
        legacy_title: {
          main: 'A Legacy of',
          accent: 'Professional Integrity.'
        },
        legacy_desc: 'Since 2014, Asas Al-Deqa has been managed by highly qualified practitioners who strive to provide the best tax and accounting consultancy services across Jordan.',
        stats: {
          experience: 'Years Experience',
          clients: 'Clients Served',
          services: 'Business Services',
          support: 'Specialized Support',
          support_label: 'and Consultancy'
        },
        services_title: {
          main: 'Integrated Business',
          accent: 'Solutions',
          suffix: 'With Global Standards'
        },
        services: {
          view_details: 'View Details',
          formation: {
            title: 'Company Formation',
            desc: 'Comprehensive solutions to start your business in the local market with full compliance.'
          },
          management: {
            title: 'Management Consulting',
            desc: 'Develop business strategies and improve operational efficiency for sustainable growth.'
          },
          tax: {
            title: 'Accounting & Tax Services',
            desc: 'Precise financial management and professional tax compliance protecting your business.'
          },
          development: {
            title: 'Business Development',
            desc: 'Explore growth opportunities and expand business scope via innovative solutions.'
          }
        },
        why: {
          label: 'Why Asas Al-Deqa?',
          title: {
            p1: 'We provide you with the',
            accent: 'Ideal Environment',
            p2: 'for your business growth'
          },
          items: {
            precision: 'Precision in Detail',
            precision_desc: 'We believe success lies in attending to every financial and administrative detail.',
            custom: 'Customized Solutions',
            custom_desc: 'No canned solutions; we design strategies suited to your business size and goals.',
            expertise: 'Business Services Expertise',
            expertise_desc: 'A dedicated team of experts guide you toward the best outcomes.',
            integrity: 'Commitment & Professionalism',
            integrity_desc: 'We respect deadlines and commit to the highest standards of integrity.'
          }
        }
      },
      about: {
        title: {
          main: 'Commitment to Detail.',
          accent: 'Integrity in Action.'
        },
        subtitle: 'Since 2014, Asas Al-Deqa has been serving a wide range of national clients and individuals with excellence in tax and accounting consultancy services across Jordan.',
        managed_by: {
          main: 'Managed by',
          accent: 'Practitioners.'
        },
        history_p1: 'Asas Al-Deqa was established in 2014, managed by highly qualified practitioners who strive to provide the best tax and accounting consultancy services.',
        history_p2: 'We serve a wide range of national clients from industries such as manufacturing, financial, trading, and telecommunication. We focus on small and medium enterprises (SMEs), bringing them on better footings and into new growth potentials.',
        vision: {
          title: 'Peace of Mind',
          accent: 'for Our Clients.',
          desc: 'To be highly respected business in the field, where clients come for the peace of mind that their interests are being cared for by a team that enjoys working with them and with one another.'
        },
        mission: {
          title: 'Exceeding',
          accent: 'Client Needs.',
          desc: 'To provide businesses, entrepreneurs and individuals with highest quality accounting, auditing, tax planning and business consulting services delivered in a timely, efficient, and innovative manner.'
        },
        why_title: 'The Core Pillars',
        why_subtitle: 'Four principles we commit to in every service we provide.',
        pillars: {
          commitment: 'Commitment & Integrity',
          commitment_desc: 'We deliver what we promise and gain trust through our actions.',
          legality: 'Legality & Capability',
          legality_desc: 'Possess technical skills and consulting licenses to provide suitable solutions.',
          quality: 'Quality & Flexibility',
          quality_desc: 'Adapting quickly to client needs with high-quality deliverables on time.',
          confidentiality: 'Confidentiality',
          confidentiality_desc: 'Strict respecting of information acquired because of professional relationships.'
        },
        stats: {
          location_main: 'Jordan',
          location_label: 'Main scope of business',
        },
        sectors: {
          manufacturing: 'Manufacturing',
          financial: 'Financial Services',
          trading: 'Trading',
          telecom: 'Telecommunications'
        },
        strengths_title: 'How We Serve You',
        strengths_subtitle: 'Practice strengths rooted in Jordan market expertise — not stock portraits.',
        strengths: {
          tax: {
            title: 'Jordan Tax Expertise',
            desc: 'Practical guidance on income tax, sales tax, and compliance filings aligned with local regulations.'
          },
          accounting: {
            title: 'Accounting Clarity',
            desc: 'Bookkeeping, statements, and financial reporting that give owners a clear view of the business.'
          },
          sme: {
            title: 'Built for SMEs',
            desc: 'Solutions sized for manufacturing, trading, financial services, and telecom clients across Jordan.'
          },
          trusted: {
            title: 'Confidential Engagement',
            desc: 'Professional relationships handled with integrity, deadlines respected, and client information protected.'
          }
        }
      },
      contact: {
        hero_title: {
          main: 'Start Your Journey',
          accent: 'with Asas Al-Diqqa'
        },
        hero_subtitle: 'Share your needs, and our team will contact you to provide the most suitable solution for your business.',
        info_title: 'Engagement Portal',
        info_desc: 'Our executive team is available for discovery sessions centered on precision.',
        location: 'Location',
        location_val: 'Jordan - Amman - Khalda - Al-Assaf Traffic Lights - Beit Al Omor Complex, First Floor',
        phone: 'Direct Line',
        phone_val: '+962797006750',
        email: 'Email Address',
        email_val: 'info@adfta.com',
        hours: 'Office Hours',
        hours_val: 'Sat - Thu: 9:00 AM - 6:00 PM\nFriday: Closed',
        confidentiality: 'Your data and consultation are handled with complete institutional confidentiality.',
        form_title: 'Contact Request',
        form_subtitle: 'Complete the form below, and we will get back to you shortly.',
        label_name: 'Full Name',
        placeholder_name: 'ESTEEMED CLIENT',
        label_email: 'Email Address',
        placeholder_email: 'OFFICE@COMPANY.COM',
        label_subject: 'Consultation Type',
        label_message: 'Brief Requirements',
        placeholder_message: 'DESCRIBE YOUR OBJECTIVES...',
        button_send: 'Send Contact Request',
        sending: 'Sending...',
        success: 'Your message has been sent. We will get back to you shortly.',
        error: 'Something went wrong. Please try again or email us directly at info@adfta.com.',
        trust: {
          privacy: 'Information Secrecy',
          response: '24h Response',
          custom: 'Custom Consultation'
        }
      },
      common: {
        dir: 'ltr'
      },
      services: {
        title: {
          main: 'Business',
          accent: 'Solutions.'
        },
        subtitle: 'A comprehensive suite of tax and accounting consultancy services engineered for SMEs and growing businesses.',
        items: {
          tax_compliance: 'Tax Compliance',
          tax_compliance_desc: 'Ensuring your company\'s declaration and payment of monthly and annual Tax Returns are in accordance with applicable regulations.',
          accounting: 'Accounting Services',
          accounting_desc: 'From creating accounting charts to bookkeeping and internal financial statements, we develop your full financial position image.',
          tax_management: 'Tax Management',
          tax_management_desc: 'Health checks to limit the risk of inaccuracies or compliance failure and mitigate the risk of future tax penalties.',
          tax_litigation: 'Tax Litigation',
          tax_litigation_desc: 'Assistance through tax audits, objections, and appeals to ensure faster processes and the best possible outcomes.',
          documentation: 'Documentation Service',
          documentation_desc: 'Managing and processing all necessary filings of your accounting and tax related papers, properly classified and reserved.',
          inventory: 'Inventory Management',
          inventory_desc: 'Effective inventory control for retail and wholesale businesses, managing sales, returns, receipts, and theft protection.',
          erp: 'ERP Solutions',
          erp_desc: 'Integrated software solutions to manage all back-office and front-office activities, automating and growing your business.'
        },
        cta_title: 'Ready to secure your business growth?',
        cta_desc: 'Talk with our team about tax compliance, accounting, and the next step for your business in Jordan.',
        cta_button: 'Book Consultation'
      },
      footer: {
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        desc: 'Delivering bespoke financial architecture and strategic advisory across the MENA region since 2014.',
        rights: '© 2024 ASAS AL-DEQA. ALL RIGHTS RESERVED.',
        tagline: 'TAX & ACCOUNTING CONSULTANCY.'
      }
    }
  },
  ar: {
    translation: {
      ...serviceContentAr,
      nav: {
        home: 'الرئيسية',
        services: 'الخدمات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        institutional: 'مؤسسي',
        wealth: 'ثروات',
        blog: 'المدونة'
      },
      nav_labels: {
        navigation: 'التنقل',
        heritage: 'إرث أساس الدقة',
        arabic: 'النسخة العربية',
        english: 'النسخة الإنجليزية'
      },
      seo: {
        home_title: 'أساس الدقة | استشارات ضريبية ومحاسبية في عمّان، الأردن',
        home_desc: 'امتثال ضريبي، خدمات محاسبية، واستشارات أعمال في عمّان والأردن منذ 2014. الدقة في التفاصيل والتميز في العمل.',
        about_title: 'من نحن | أساس الدقة للاستشارات الضريبية والمحاسبية',
        about_desc: 'منذ 2014 نقدّم استشارات ضريبية ومحاسبية احترافية للشركات الصغيرة والمتوسطة في الأردن.',
        services_title: 'خدمات ضريبية ومحاسبية في الأردن | أساس الدقة',
        services_desc: 'امتثال ضريبي، محاسبة، إدارة ضرائب، تقاضي ضريبي، وحلول ERP للشركات في عمّان والأردن.',
        contact_title: 'اتصل بأساس الدقة | مستشارون ضريبيون في عمّان',
        contact_desc: 'احجز استشارة مع أساس الدقة في خلدا، عمّان. استشارات ضريبية ومحاسبية احترافية لأعمالك.',
        wealth_title: 'إدارة الثروات | استشارات مالية استراتيجية',
        wealth_desc: 'مخططات مخصصة للحفاظ على الثروة وهندسة مالية استراتيجية للأفراد ذوي الملاءة المالية العالية.',
        institutional_title: 'الخدمات المؤسسية | استشارات الشركات',
        institutional_desc: 'استشارات هيكلية معقدة وحلول مالية مؤسسية للعمليات واسعة النطاق.',
        insights_title: 'رؤى ضريبية ومحاسبية في الأردن | أساس الدقة',
        insights_desc: 'إرشادات عملية حول الأنظمة الضريبية والممارسات المحاسبية والامتثال من أساس الدقة.'
      },
      hero: {
        title: {
          main: 'الدقة في التفاصيل،',
          accent: 'التميز في العمل.'
        },
        subtitle: 'مستشارو الضرائب والمحاسبة.',
        description: 'حلول أعمال واستشارات احترافية تساعد الشركات على النمو بثقة وكفاءة.',
        brand_badge: 'أساس الدقة · استشارات ضريبية ومحاسبية',
        cta_contact: 'احجز استشارة الآن',
        cta_services: 'خدماتنا'
      },
      home: {
        legacy_title: {
          main: 'إرث من',
          accent: 'النزاهة المهنية.'
        },
        legacy_desc: 'منذ عام 2014، تميزت أساس الدقة في تقديم أفضل الاستشارات الضريبية والمحاسبية في جميع أنحاء الأردن.',
        stats: {
          experience: 'من الخبرة',
          clients: 'عميل مستفيد',
          services: 'حلول أعمال',
          support: 'دعم',
          support_label: 'واستشارات متخصصة'
        },
        services_title: {
          main: 'حلول أعمال متكاملة',
          accent: 'بمعايير عالمية',
          suffix: ''
        },
        services: {
          view_details: 'عرض التفاصيل',
          formation: {
            title: 'تأسيس الشركات',
            desc: 'حلول شاملة لبدء أعمالك في السوق المحلي مع الامتثال لكافة المتطلبات القانونية والإدارية.'
          },
          management: {
            title: 'الاستشارات الإدارية',
            desc: 'تطوير استراتيجيات العمل وتحسين الكفاءة التشغيلية لضمان نمو مستدام ومنافسة قوية.'
          },
          tax: {
            title: 'خدمات المحاسبة والضرائب',
            desc: 'إدارة مالية دقيقة وامتثال ضريبي احترافي يحمي أعمالك ويضمن شفافية كاملة.'
          },
          development: {
            title: 'تطوير الأعمال',
            desc: 'استكشاف فرص النمو وتوسيع نطاق الأعمال عبر حلول ابتكارية ورؤى سوقية متقدمة.'
          }
        },
        why: {
          label: 'لماذا أساس الدقة؟',
          title: {
            p1: 'نحن نوفر لك',
            accent: 'البيئة المثالية',
            p2: 'لنمو أعمالك'
          },
          items: {
            precision: 'دقة في التفاصيل',
            precision_desc: 'نؤمن أن النجاح يكمن في الاهتمام بكل تفصيلة مالية وإدارية.',
            custom: 'حلول مخصصة لكل عميل',
            custom_desc: 'لا توجد حلول معلبة، نصمم استراتيجيات تناسب حجم وأهداف عملك.',
            expertise: 'خبرة في خدمات الأعمال',
            expertise_desc: 'فريق من الخبراء مكرس لخدمتك وتوجيهك نحو الأفضل.',
            integrity: 'التزام واحترافية',
            integrity_desc: 'نحترم المواعيد ونلتزم بأعلى معايير النزاهة المهنية.'
          }
        }
      },
      about: {
        title: {
          main: 'الالتزام بالتفاصيل.',
          accent: 'النزاهة في العمل.'
        },
        subtitle: 'منذ عام 2014، تخدم أساس الدقة مجموعة واسعة من العملاء الوطنيين والأفراد بتميز في الاستشارات الضريبية والمحاسبية عبر الأردن.',
        managed_by: {
          main: 'تأسست عام',
          accent: '2014'
        },
        history_p1: 'تأسست أساس الدقة في عام 2014، ونسعى لتقديم أفضل الاستشارات الضريبية والمحاسبية.',
        history_p2: 'نحن نخدم مجموعة واسعة من العملاء الوطنيين من صناعات مثل التصنيع والتمويل والتجارة والاتصالات. نحن نركز على الشركات الصغيرة والمتوسطة (SMEs)، وننقلها إلى ركائز أفضل وإمكانات نمو جديدة.',
        vision: {
          title: 'راحة البال',
          accent: 'لعملائنا.',
          desc: 'أن نكون عملاً يحظى باحترام كبير في هذا المجال، حيث يأتي العملاء لراحة البال بأن مصالحهم تحظى برعاية فريق يستمتع بالعمل معهم ومع بعضهم البعض.'
        },
        mission: {
          title: 'تجاوز',
          accent: 'احتياجات العملاء.',
          desc: 'تزويد الشركات والرواد والأفراد بأعلى جودة من خدمات المحاسبة والتدقيق والتخطيط الضريبي والاستشارات التجارية المقدمة في الوقت المناسب وبكفاءة ومبتكرة.'
        },
        why_title: 'الركائز الأساسية',
        why_subtitle: 'أربعة مبادئ نلتزم بها في كل خدمة نقدمها.',
        pillars: {
          commitment: 'الالتزام والنزاهة',
          commitment_desc: 'نحن نفي بما نعد به ونكتسب الثقة من خلال أفعالنا.',
          legality: 'القانونية والقدرة',
          legality_desc: 'امتلاك المهارات الفنية وتراخيص الاستشارة لتقديم الحلول المناسبة.',
          quality: 'الجودة والمرونة',
          quality_desc: 'التكيف السريع مع احتياجات العملاء وتقديم مخرجات عالية الجودة في الوقت المحدد.',
          confidentiality: 'السرية',
          confidentiality_desc: 'الاحترام الصارم للمعلومات المكتسبة بسبب العلاقات المهنية.'
        },
        stats: {
          location_main: 'الأردن',
          location_label: 'نطاق العمل الرئيسي',
        },
        sectors: {
          manufacturing: 'التصنيع',
          financial: 'الخدمات المالية',
          trading: 'التجارة',
          telecom: 'الاتصالات'
        },
        strengths_title: 'كيف نخدمك',
        strengths_subtitle: 'نقاط قوة مهنية مبنية على خبرة السوق الأردني — دون صور فريق وهمية.',
        strengths: {
          tax: {
            title: 'خبرة ضريبية أردنية',
            desc: 'إرشاد عملي في ضريبة الدخل والمبيعات والامتثال وفق الأنظمة المحلية.'
          },
          accounting: {
            title: 'وضوح محاسبي',
            desc: 'مسك دفاتر وبيانات مالية تعطي أصحاب الأعمال صورة واضحة عن أوضاعهم.'
          },
          sme: {
            title: 'مصمّمون للشركات الصغيرة والمتوسطة',
            desc: 'حلول تناسب عملاء التصنيع والتجارة والخدمات المالية والاتصالات في الأردن.'
          },
          trusted: {
            title: 'تعاقد بسرية ونزاهة',
            desc: 'علاقات مهنية قائمة على الالتزام بالمواعيد وحماية معلومات العملاء.'
          }
        }
      },
      contact: {
        hero_title: {
          main: 'ابدأ رحلتك مع',
          accent: 'أساس الدقة'
        },
        hero_subtitle: 'شاركنا احتياجك، وسيتواصل معك فريقنا لتقديم الحل الأنسب لأعمالك.',
        info_title: 'بوابة التواصل',
        info_desc: 'فريقنا التنفيذي متاح لجلسات الاستكشاف الأولية التي تركز على الدقة.',
        location: 'الموقع',
        location_val: 'الأردن - عمان - خلدا - إشارات العساف - مجمع بيت العمر، الطابق الأول',
        phone: 'الهاتف المباشر',
        phone_val: '+962797006750',
        email: 'البريد الإلكتروني',
        email_val: 'info@adfta.com',
        hours: 'ساعات العمل',
        hours_val: 'السبت - الخميس: 9:00 ص - 6:00 م\nالجمعة: مغلق',
        confidentiality: 'يتم التعامل مع بياناتك واستشارتك بسرية مؤسسية تامة.',
        form_title: 'طلب تواصل',
        form_subtitle: 'أكمل النموذج أدناه، وسنعود إليك في أقرب وقت.',
        label_name: 'الاسم الكامل',
        placeholder_name: 'العميل الموقر',
        label_email: 'البريد الإلكتروني',
        placeholder_email: 'OFFICE@COMPANY.COM',
        label_subject: 'نوع الاستشارة',
        label_message: 'متطلبات موجزة',
        placeholder_message: 'صف أهدافك...',
        button_send: 'إرسال طلب التواصل',
        sending: 'جاري الإرسال...',
        success: 'تم إرسال رسالتك بنجاح. سنعود إليك في أقرب وقت.',
        error: 'حدث خطأ. يرجى المحاولة مرة أخرى أو مراسلتنا مباشرة على info@adfta.com.',
        trust: {
          privacy: 'سرية المعلومات',
          response: 'استجابة خلال 24 ساعة',
          custom: 'استشارة مخصصة'
        }
      },
      common: {
        dir: 'rtl'
      },
      services: {
        title: {
          main: 'حلول',
          accent: 'متكاملة'
        },
        subtitle: 'مجموعة شاملة من الاستشارات الضريبية والمحاسبية المصممة للشركات الصغيرة والمتوسطة والشركات النامية.',
        items: {
          tax_compliance: 'الامتثال الضريبي',
          tax_compliance_desc: 'ضمان تقديم ودفع الإقرارات الضريبية الشهرية والسنوية لشركتك وفقاً للأنظمة المعمول بها.',
          accounting: 'المحاسبية',
          accounting_desc: 'من إنشاء المخططات المحاسبية إلى مسك الدفاتر والبيانات المالية الداخلية، نطور صورة كاملة لمركزك المالي.',
          tax_management: 'إدارة الضرائب',
          tax_management_desc: 'فحوصات صحية للحد من مخاطر عدم الدقة أو فشل الامتثال وتخفيف مخاطر الغرامات الضريبية المستقبلية.',
          tax_litigation: 'التقاضي الضريبي',
          tax_litigation_desc: 'المساعدة من خلال التدقيق الضريبي والاعتراضات والطعون لضمان عمليات أسرع وأفضل النتائج الممكنة.',
          documentation: 'خدمة التوثيق',
          documentation_desc: 'إدارة ومعالجة جميع الملفات اللازمة لأوراقك ومستنداتك المتعلقة بالمحاسبة والضرائب، وتصنيفها وحفظها بشكل صحيح.',
          inventory: 'إدارة المخزون',
          inventory_desc: 'رقابة فعالة على المخزون لأعمال التجزئة والجملة، وإدارة المبيعات والمرتجع والاستلام وحماية السرقة.',
          erp: 'حلول ERP',
          erp_desc: 'حلول برمجية متكاملة لإدارة جميع أنشطة المكتب الخلفي والأمامي، وأتمتة وتنمية أعمالك.'
        },
        cta_title: 'هل أنت مستعد لتأمين نمو عملك؟',
        cta_desc: 'تحدث مع فريقنا حول الامتثال الضريبي والمحاسبة والخطوة التالية لأعمالك في الأردن.',
        cta_button: 'احجز استشارة'
      },
      footer: {
        legal: 'القانونية',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        desc: 'تقديم هندسة مالية واستشارات استراتيجية مخصصة عبر منطقة الشرق الأوسط وشمال أفريقيا منذ عام 2014.',
        rights: '© 2024 أساس الدقة. جميع الحقوق محفوظة.',
        tagline: 'استشارات ضريبية ومحاسبية.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
