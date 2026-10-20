export const resourceLinks = [
  {
    label: "Book Dialysis Abroad",
    to: "/book-dialysis-abroad",
    description: "Plan treatment overseas with clinic matching and booking support.",
    eyebrow: "International care",
    title: "Book dialysis abroad with confidence",
    intro:
      "Find dialysis clinics before you travel, understand appointment requirements, and keep your treatment schedule protected while you are away from home.",
    highlights: [
      "Compare destination clinics and treatment availability.",
      "Prepare medical documents before contacting a clinic.",
      "Coordinate preferred dates around your travel itinerary.",
    ],
  },
  {
    label: "Holiday Destinations",
    to: "/holiday-destinations",
    description: "Explore travel-ready places with access to dialysis support.",
    eyebrow: "Destination planning",
    title: "Holiday destinations for dialysis travellers",
    intro:
      "Choose destinations with the right balance of relaxation, access, and healthcare planning so your holiday starts with fewer unknowns.",
    highlights: [
      "Review destination suitability before booking flights.",
      "Think through transport, accommodation, and clinic distance.",
      "Prioritise locations where treatment planning is straightforward.",
    ],
  },
  {
    label: "Travel Insurance",
    to: "/travel-insurance",
    description: "Understand cover questions for dialysis and kidney care trips.",
    eyebrow: "Before you go",
    title: "Travel insurance for dialysis patients",
    intro:
      "Know what to ask insurers before your trip, including medical declarations, treatment-related exclusions, and emergency cover.",
    highlights: [
      "Declare kidney disease and dialysis needs clearly.",
      "Check emergency care and trip disruption terms.",
      "Keep policy documents accessible while travelling.",
    ],
  },
  {
    label: "Cruise Dialysis",
    to: "/cruise-dialysis",
    description: "Plan cruise holidays with dialysis-friendly preparation.",
    eyebrow: "Cruise planning",
    title: "Cruise dialysis planning made clearer",
    intro:
      "Understand how dialysis planning works around cruise itineraries, onboard options, port access, and medical documentation.",
    highlights: [
      "Check whether dialysis is onboard or arranged near ports.",
      "Confirm schedules before paying final cruise balances.",
      "Carry treatment records and emergency contact details.",
    ],
  },
  {
    label: "Dialysis at Sea",
    to: "/dialysis-at-sea",
    description: "Guidance for treatment schedules during sea travel.",
    eyebrow: "At sea",
    title: "Dialysis at sea without guesswork",
    intro:
      "Plan sea travel around safe dialysis access, realistic schedules, and clinical requirements before your journey begins.",
    highlights: [
      "Map treatment days against sea days and port days.",
      "Confirm who provides clinical oversight during travel.",
      "Prepare backup plans for delays or itinerary changes.",
    ],
  },
  {
    label: "Patient Guides",
    to: "/patient-guides",
    description: "Practical checklists for dialysis patients and families.",
    eyebrow: "Patient support",
    title: "Patient guides for smoother care",
    intro:
      "Use practical guides to prepare for appointments, travel, documentation, and the everyday decisions that come with dialysis care.",
    highlights: [
      "Know what information clinics usually ask for.",
      "Prepare questions before choosing a treatment location.",
      "Keep family members aligned on travel and care plans.",
    ],
  },
  {
    label: "Benefits & Financial Help",
    to: "/benefits-financial-help",
    description: "Find support topics for costs, benefits, and care funding.",
    eyebrow: "Financial support",
    title: "Benefits and financial help",
    intro:
      "Understand the kinds of financial support dialysis patients may need to explore, from travel costs to treatment-related assistance.",
    highlights: [
      "List expected treatment, travel, and accommodation costs.",
      "Ask clinics and insurers about payment timing.",
      "Explore local benefit and charity support where available.",
    ],
  },
  {
    label: "Kidney Diet",
    to: "/kidney-diet",
    description: "Diet planning reminders for travel and everyday kidney care.",
    eyebrow: "Food and wellbeing",
    title: "Kidney diet guidance for everyday life and travel",
    intro:
      "Plan meals and travel food choices around your clinician's advice, fluid limits, and destination-specific routines.",
    highlights: [
      "Follow your renal team's potassium, phosphate, and fluid guidance.",
      "Plan safe snacks for travel days.",
      "Ask hotels or cruise teams about dietary requirements early.",
    ],
  },
  {
    label: "Travel Tips",
    to: "/travel-tips",
    description: "Smart preparation for flights, documents, and appointments.",
    eyebrow: "Travel smarter",
    title: "Travel tips for dialysis patients",
    intro:
      "Reduce stress before departure with simple preparation around records, prescriptions, transfers, and clinic communication.",
    highlights: [
      "Carry recent medical summaries and medication lists.",
      "Leave extra time between travel and treatment appointments.",
      "Save clinic, insurer, and emergency contacts offline.",
    ],
  },
  {
    label: "FAQs",
    to: "/faqs",
    description: "Answers to common dialysis booking and travel questions.",
    eyebrow: "Quick answers",
    title: "Frequently asked questions",
    intro:
      "Get quick answers to common questions about booking dialysis, preparing for travel, and choosing suitable clinics.",
    highlights: [
      "Learn what details are usually needed for a booking.",
      "Understand when to start arranging treatment.",
      "Find out what to confirm before travel is finalised.",
    ],
  },
] as const;

export type ResourceSlug = (typeof resourceLinks)[number]["to"];
