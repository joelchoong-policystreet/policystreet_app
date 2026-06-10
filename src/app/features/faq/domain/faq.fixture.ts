export type FaqItem = {
  id: string;
  question: string;
  paragraphs: readonly string[];
};

/** In-app FAQ copy — Figma 3120:2864 accordion list. */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'who-is-policystreet',
    question: 'Who is PolicyStreet? What company is this?',
    paragraphs: [
      'PolicyStreet is an InsurTech (Insurance Technology) company that offers customizable insurance solutions to both consumers and businesses.',
      'For example, we offer Car Insurance online, Damage Protection for Shopee customers, on-the-road protection for FoodPanda riders, e-hailing protection for Grab Drivers, and many more.',
    ],
  },
  {
    id: 'company-licensed',
    question: 'Is your company legit / licensed?',
    paragraphs: [
      'Yes. PolicyStreet operates as a registered business in Malaysia and partners with licensed insurers to provide motor and protection products.',
      'All policies issued through PolicyStreet are underwritten by our insurer partners and are subject to the terms and conditions set out in your policy documents.',
    ],
  },
  {
    id: 'company-location',
    question: 'Where is your company located?',
    paragraphs: [
      'PolicyStreet Malaysia is located at Menara Suezcap 1, KL Gateway, No. 2 Jalan Kerinchi, Gerbang Kerinchi Lestari, 59200 Kuala Lumpur, Malaysia.',
    ],
  },
  {
    id: 'underwriter',
    question: 'Which insurer underwrites the car insurance and protection packages?',
    paragraphs: [
      'Car insurance and protection packages available on PolicyStreet are underwritten by our licensed insurer partners. The insurer for your policy is shown during quotation and on your policy schedule before you complete payment.',
    ],
  },
  {
    id: 'cheapest-insurance',
    question: 'How can I find the cheapest car insurance Malaysia?',
    paragraphs: [
      'Compare quotes on PolicyStreet by entering your vehicle and driver details. Premiums vary based on factors such as vehicle make and model, sum insured, NCD, and optional add-ons.',
      'Review the coverage and benefits included in each quote — not just the price — so you choose a plan that fits your needs and budget.',
    ],
  },
  {
    id: 'road-tax-online',
    question: 'Can I renew my road tax online?',
    paragraphs: [
      'Yes. Where available, you can renew your road tax online through PolicyStreet when you purchase or renew your car insurance, subject to eligibility and JPJ requirements.',
      'Digital road tax is delivered to the email address provided during purchase. Physical road tax delivery is handled by our road tax partner where applicable.',
    ],
  },
  {
    id: 'payment-secure',
    question: 'Is online payment secure?',
    paragraphs: [
      'Yes. Payments on PolicyStreet are processed through secure payment channels. Your card and transaction details are handled in line with industry security standards.',
      'You will receive a payment confirmation once your transaction is successful.',
    ],
  },
  {
    id: 'policy-issuance',
    question: 'How long does it take to get my policy?',
    paragraphs: [
      'If purchased during working hours, you will typically receive your car insurance policy and/or road tax within one (1) working day.',
      'Purchases made outside working hours are processed by the next working day.',
    ],
  },
  {
    id: 'choose-coverage',
    question: 'Can I choose my insurance coverage?',
    paragraphs: [
      'Yes. During quotation you can review available coverage options and add-ons before confirming your purchase.',
      'Your final premium and policy wording reflect the plan and optional benefits you select at checkout.',
    ],
  },
];

export const FAQ_EXTERNAL_PAGE_URL = 'https://www.policystreet.com/faq';
