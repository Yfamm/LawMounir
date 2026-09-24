import type { SourceId } from "./sources";

/**
 * The firm's own introduction, from the supplied Arabic document
 * (docs/sources/introduction-ar.md). Arabic is kept as close to the source as
 * possible; English is a faithful translation. Every departure from the
 * source is listed in `edits`, and anything the firm must still confirm is
 * listed in `verify`.
 */

type Sourced = {
  sources: SourceId[];
  /** Changes made to the source wording, and why. */
  edits?: string[];
  /** Statements the firm should confirm before launch. */
  verify?: string[];
};

export const vision = {
  labelEn: "Introduction",
  labelAr: "رؤيتنا",
  /** Short form used as the hero line and its Arabic counterpart. */
  headlineAr: "القانون ليس مجرد نصوص جامدة، بل هو حصن الأمان",
  /** Short form used in the home introduction statement. */
  statementAr: "حصن الأمان الذي يحمي حقوق الأفراد ويدعم نمو الشركات",
  ar: "نحن في مكتب ديوان للمحاماه والأستشارات القانونية، نؤمن بأن القانون ليس مجرد نصوص جامدة، بل هو حصن الأمان الذي يحمي حقوق الأفراد ويدعم نمو الشركات. ومن مكتبنا في كفر الشيخ، نلتزم بتقديم منظومة قانونية متكاملة تقوم على ركيزتين أساسيتين: الخبرة العميقة والنزاهة المطلقة.",
  en: "At DIWAN, we believe the law is not merely rigid text, but a fortress of security that protects the rights of individuals and supports the growth of companies. From our office in Kafr el Sheikh, we are committed to an integrated legal service resting on two pillars: deep expertise and absolute integrity.",
  sources: ["introDoc", "facebook"],
  edits: [
    "[ضع اسم المكتب] replaced with the public-page name; the template's trailing 'للمحاماة والاستشارات القانونية' is not repeated after it.",
    "Removed 'منذ تأسيس مكتبنا في قلب العاصمة المصرية' (Cairo is not supported by the sources); the sentence now refers to Kafr el Sheikh. No founding date added.",
  ],
} satisfies Sourced & Record<string, unknown>;

export const whoWeAre = {
  labelEn: "Who We Are",
  labelAr: "من نحن؟",
  ar: "مكتب ديوان للمحاماه والأستشارات القانونية هو مؤسسة قانونية مصرية، تضم مستشارين ومحامين متخصصين في فروع القانون المصري والدولي. نعمل على تقديم حلول قانونية مبتكرة وفعالة تتناسب مع التطورات التشريعية والاقتصادية الحديثة في مصر، سواء في مجالات الشركات والاستثمار، أو المعاملات المدنية والعقارية، وقضايا الأحوال الشخصية.",
  en: [
    "DIWAN is an Egyptian law and legal consultancy firm, bringing together counsel and lawyers specialized in branches of Egyptian and international law.",
    "We work to provide innovative, effective legal solutions suited to Egypt's latest legislative and economic developments — in companies and investment, civil and real-estate transactions, and personal status cases.",
  ],
  sources: ["introDoc"],
  edits: [
    "'رائدة' (leading) removed from the live text pending the firm's explicit confirmation.",
    "'نخبة من' (a select group of) removed for the same reason.",
    "'نتميز بالقدرة على تقديم' softened to 'نعمل على تقديم'.",
  ],
  verify: ["Specialization in international law ('والدولي')", "Confirm the firm is content with the softened wording or wants 'رائدة' / 'نخبة' restored."],
} satisfies Sourced & Record<string, unknown>;

export const values = {
  labelEn: "Our Values",
  labelAr: "قيمنا الأساسية",
  headingAr: "لماذا يختارنا عملاؤنا؟",
  items: [
    {
      numeral: "I",
      titleEn: "Professionalism & Specialization",
      titleAr: "الاحترافية والتخصص",
      textEn:
        "No generic solutions: the office is organized into specialized sections across the different branches of law, for precise legal analysis.",
      textAr:
        "لا نعتمد على الحلول العامة، بل يضم مكتبنا أقساماً متخصصة في فروع القانون المختلفة لضمان أدق التحليلات القضائية.",
    },
    {
      numeral: "II",
      titleEn: "Absolute Confidentiality",
      titleAr: "السرية المطلقة",
      textEn:
        "Our clients' privacy, their data and their cases come first, held to the highest standards of security and professional confidentiality.",
      textAr: "نضع خصوصية عملائنا وبياناتهم وقضاياهم في مقدمة أولوياتنا، ونلتزم بأعلى معايير الأمان والسرية المهنية.",
    },
    {
      numeral: "III",
      titleEn: "Constant Communication",
      titleAr: "التواصل المستمر",
      textEn:
        "The client is a partner in success, so we keep them informed of every development in their cases and their legal position, through our digital and direct channels.",
      textAr:
        "نؤمن بأن العميل شريك في النجاح، لذلك نحرص على إبقائه على اطلاع دائم ومستمر بكافة مستجدات قضاياه وموقفها القانوني عبر قنواتنا الرقمية والمباشرة.",
    },
    {
      numeral: "IV",
      titleEn: "Speed & Delivery",
      titleAr: "السرعة والإنجاز",
      textEn:
        "In business, time is the most important investment — so administrative procedures, company formation and contract drafting are completed efficiently and promptly.",
      textAr:
        "في عالم المال والأعمال، الوقت هو الاستثمار الأهم؛ لذا نحرص على إنهاء الإجراءات الإدارية، وتأسيس الشركات، وصياغة العقود بكفاءة وسرعة.",
    },
  ],
  sources: ["introDoc"],
  edits: [
    "Value I: 'يترأسها خبراء' (headed by experts) omitted pending confirmation of the team.",
    "Value IV: 'نتميز بـ ... في أسرع وقت ممكن وبأعلى كفاءة' rendered as 'بكفاءة وسرعة' — no measurable claim.",
  ],
} satisfies Sourced & Record<string, unknown>;

export const mission = {
  labelEn: "Mission",
  labelAr: "رسالتنا",
  ar: "أن نكون شريكاً قانونياً موثوقاً لكل مستثمر، وصاحب شركة، ومواطن يبحث عن الأمان القانوني في مصر، من خلال تبسيط الإجراءات، وتقديم استشارات واضحة، والدفاع المخلص عن الحقوق أمام كافة الجهات القضائية والإدارية.",
  en: "To be a trusted legal partner for every investor, company owner and citizen seeking legal security in Egypt — by simplifying procedures, offering clear advice, and faithfully defending rights before all judicial and administrative bodies.",
  sources: ["introDoc"],
  edits: ["'الشريك القانوني الموثوق والأول' changed to 'شريكاً قانونياً موثوقاً' so an aspiration is not read as a ranking."],
} satisfies Sourced & Record<string, unknown>;
