export type Language = 'EN' | 'HI';

export interface Translations {
  common: {
    brandName: string;
    brandSuffix: string;
    tagline: string;
    login: string;
    logout: string;
    register: string;
    bookBuddy: string;
    book: string;
    viewDetails: string;
    explore: string;
    exploreMore: string;
    findBuddy: string;
    all: string;
    submit: string;
    cancel: string;
    save: string;
    back: string;
    next: string;
    loading: string;
    success: string;
    error: string;
    perHour: string;
    verified: string;
    trips: string;
    reviews: string;
    rating: string;
    duration: string;
    groupSize: string;
    placesCovered: string;
    included: string;
    notIncluded: string;
    stepOf: string;
  };
  navbar: {
    home: string;
    explore: string;
    findBuddy: string;
    experiences: string;
    packages: string;
    events: string;
    safety: string;
    about: string;
    contact: string;
    dashboard: string;
    switchLanguage: string;
  };
  hero: {
    eyebrow: string;
    headlinePart1: string;
    headlinePart2: string;
    subheadline: string;
    findBuddyBtn: string;
    exploreBtn: string;
    photoCaption: string;
  };
  intro: {
    eyebrow: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
  };
  howItWorks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  destinations: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
    searchPlaceholder: string;
    noDestinationsFound: string;
    resetFilters: string;
    highlightsIncluded: string;
    exploreWithBuddy: string;
    suggestedDuration: string;
    bestTime: string;
    location: string;
    availableExperiences: string;
  };
  buddies: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allGenders: string;
    femaleOnly: string;
    maleOnly: string;
    allLanguages: string;
    noBuddiesFound: string;
    resetFilters: string;
    bookThisBuddy: string;
    yearsExp: string;
    nativeOf: string;
    speaks: string;
    hourlyRate: string;
    halfDayRate: string;
    fullDayRate: string;
    reviewsTitle: string;
    availability: string;
    availableSlots: string;
  };
  experiences: {
    eyebrow: string;
    title: string;
    subtitle: string;
    bookCompanionForExp: string;
    bookExperience: string;
    withVerifiedCompanion: string;
  };
  packages: {
    eyebrow: string;
    title: string;
    subtitle: string;
    mostPopular: string;
    partySize: string;
    honorarium: string;
    bookPackage: string;
  };
  events: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    viewAll: string;
    planMyVisit: string;
    viewDetails: string;
    allCities: string;
    varanasi: string;
    jaipur: string;
    allCategories: string;
    confirmed: string;
    tentative: string;
    datesTBA: string;
    lastVerified: string;
    venue: string;
    dates: string;
    culturalSignificance: string;
    whatToExperience: string;
    importantGuidelines: string;
    findCompanionForEvent: string;
    relatedPackages: string;
    noEventsFound: string;
    resetFilters: string;
    ongoing: string;
    upcoming: string;
    pastArchive: string;
    cancelled: string;
    dateShifted: string;
    officialSource: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    allFaqs: string;
  };
  footer: {
    brandDesc: string;
    exploreTitle: string;
    platformTitle: string;
    connectTitle: string;
    legalTitle: string;
    rights: string;
    privacy: string;
    terms: string;
    cancellation: string;
    safetyTrust: string;
  };
  booking: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
    step7Title: string;
    step7Desc: string;
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    travelDate: string;
    preferredTime: string;
    travelPartySize: string;
    duration: string;
    pickupLocation: string;
    pickupPlaceholder: string;
    specialRequests: string;
    priceSummary: string;
    baseRate: string;
    serviceFee: string;
    totalAmount: string;
    submitRequest: string;
    confirmationTitle: string;
    bookingRef: string;
    status: string;
    trackInDashboard: string;
  };
  auth: {
    welcome: string;
    loginDesc: string;
    emailLabel: string;
    passwordLabel: string;
    forgotPassword: string;
    signInBtn: string;
    demoNote: string;
    noAccount: string;
    registerHere: string;
    joinTitle: string;
    joinDesc: string;
    iAmTraveler: string;
    iAmTravelerDesc: string;
    becomeBuddy: string;
    becomeBuddyDesc: string;
    fullName: string;
    phoneLabel: string;
    createAccountBtn: string;
    haveAccount: string;
  };
  dashboard: {
    overview: string;
    myRequests: string;
    myBookings: string;
    myAssignments: string;
    profile: string;
    settings: string;
    support: string;
    notifications: string;
    history: string;
    availability: string;
    acceptAssignment: string;
    declineAssignment: string;
    manageBookings: string;
    status: string;
    companion: string;
    traveler: string;
    action: string;
  };
}

export const translations: Record<Language, Translations> = {
  EN: {
    common: {
      brandName: 'TravelOn',
      brandSuffix: 'Buddies',
      tagline: 'Varanasi & Sacred India Companions',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      bookBuddy: 'Book a Buddy',
      book: 'Book',
      viewDetails: 'View Details',
      explore: 'Explore',
      exploreMore: 'Explore More',
      findBuddy: 'Find Your Travel Buddy',
      all: 'All',
      submit: 'Submit Request',
      cancel: 'Cancel',
      save: 'Save Changes',
      back: 'Back',
      next: 'Next Step',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      perHour: 'per hour',
      verified: 'Verified Buddy',
      trips: 'trips',
      reviews: 'reviews',
      rating: 'Rating',
      duration: 'Duration',
      groupSize: 'Party Size',
      placesCovered: 'Places Covered',
      included: 'Included',
      notIncluded: 'Payable at actuals',
      stepOf: 'Step',
    },
    navbar: {
      home: 'Home',
      explore: 'Explore Banaras',
      findBuddy: 'Find a Buddy',
      experiences: 'Experiences',
      packages: 'Packages',
      events: 'Festivals & Events',
      safety: 'Safety & Trust',
      about: 'About',
      contact: 'Contact',
      dashboard: 'Dashboard',
      switchLanguage: 'हिंदी',
    },
    hero: {
      eyebrow: 'Varanasi & Sacred India Companions',
      headlinePart1: 'Travel Safely.',
      headlinePart2: 'Explore Freely.',
      subheadline: 'Every journey feels better with someone by your side. Discover trusted travel companions and explore the world with confidence.',
      findBuddyBtn: 'Find Your Travel Buddy',
      exploreBtn: 'Explore More',
      photoCaption: 'Dashashwamedh Ghat, Varanasi',
    },
    intro: {
      eyebrow: 'The TravelOnBuddy Experience',
      titlePart1: 'More than a destination.',
      titlePart2: 'It’s an experience.',
      description: 'Varanasi is ancient, intense, and deeply layered. You don’t just visit monuments; you walk through three millennia of living philosophy, morning ragas, sacred ghats, and hidden weaver gallis. A friendly local buddy walks beside you at your own pace—sharing stories, steering clear of tourist traps, and bringing Kashi to life.',
      pillar1Title: 'Authentic Exploration',
      pillar1Desc: 'Quiet morning boat rides, tucked-away shrines, and centuries-old culinary secrets without commercial commission stops.',
      pillar2Title: 'Friendly Local Buddies',
      pillar2Desc: 'Educated students, historians, and cultured residents who love their hometown and welcome you like family.',
      pillar3Title: 'Personalized Pacing',
      pillar3Desc: 'Travel at your own cadence. Stop for photography, elder rest, or hot kulhad chai whenever you choose.',
    },
    howItWorks: {
      eyebrow: 'Intuitive Process',
      title: 'Simple Steps. Better Journeys.',
      subtitle: 'A seamless, transparent way to connect with verified local companions.',
      step1Title: 'Choose Your Destination',
      step1Desc: 'Browse sacred ghats, ancient corridors, silk weaving looms, or mouth-watering culinary gallis across Banaras.',
      step2Title: 'Find Your Ideal Buddy',
      step2Desc: 'Filter companions by language, university background, ratings, and shared personal passions.',
      step3Title: 'Plan Your Day',
      step3Desc: 'Confirm exact dates, preferred morning or sunset hours, group count, and custom stops with honest pricing.',
      step4Title: 'Explore Together',
      step4Desc: 'Meet your verified companion at your designated landmark and immerse yourself in Kashi safely.',
    },
    destinations: {
      eyebrow: 'Curated Destinations',
      title: 'Explore Somewhere Beautiful.',
      subtitle: 'Discover destinations worth experiencing, with a companion who makes the journey special.',
      viewAll: 'View all destinations',
      searchPlaceholder: 'Search ghats, temples, foods or heritage...',
      noDestinationsFound: 'No destinations found matching your criteria.',
      resetFilters: 'Reset Filters',
      highlightsIncluded: 'Highlights included:',
      exploreWithBuddy: 'Explore with a Buddy',
      suggestedDuration: 'Suggested Duration',
      bestTime: 'Best Time to Visit',
      location: 'Location',
      availableExperiences: 'Available Experiences',
    },
    buddies: {
      eyebrow: 'Verified Local Companions',
      title: 'Meet Our Travel Buddies.',
      subtitle: 'Every buddy on our platform is a thoroughly verified, cultured local resident who has grown up along the sacred ghats and alleys of Kashi. Choose the right companion for your pace, language, and interests.',
      searchPlaceholder: 'Search companion by name, language, or specialty...',
      allGenders: 'All Genders',
      femaleOnly: 'Female Companions Only',
      maleOnly: 'Male Companions Only',
      allLanguages: 'All Languages',
      noBuddiesFound: 'No buddies match your search criteria.',
      resetFilters: 'Reset Filters',
      bookThisBuddy: 'Book This Buddy',
      yearsExp: 'years experience',
      nativeOf: 'Native of',
      speaks: 'Speaks',
      hourlyRate: 'Hourly Rate',
      halfDayRate: 'Half-Day Rate',
      fullDayRate: 'Full-Day Rate',
      reviewsTitle: 'Traveler Reviews & Feedback',
      availability: 'Availability & Slots',
      availableSlots: 'Available Time Slots',
    },
    experiences: {
      eyebrow: 'Handcrafted Immersions',
      title: 'Unique Experiences.',
      subtitle: 'Carefully timed routes led by companions who understand the subtleties of sacred river rituals, food traditions, and alleyway secrets.',
      bookCompanionForExp: 'Book Companion for this Experience',
      bookExperience: 'Book Experience',
      withVerifiedCompanion: 'With verified companion',
    },
    packages: {
      eyebrow: 'Clear & Transparent',
      title: 'Travel Packages.',
      subtitle: 'Simple, honest pricing. Transparent companion honorariums with zero hidden commissions.',
      mostPopular: 'Most Popular',
      partySize: 'Party Size',
      honorarium: 'companion honorarium',
      bookPackage: 'Book Package',
    },
    events: {
      eyebrow: 'Cultural Calendar & Festivals',
      title: 'Upcoming Festivals & Events',
      subtitle: 'Experience the celebrations, traditions and culture of every city.',
      description: 'Discover what’s happening in your destination and plan your journey around the celebrations.',
      viewAll: 'Explore All Festivals & Events',
      planMyVisit: 'Plan My Visit',
      viewDetails: 'View Details',
      allCities: 'All Cities',
      varanasi: 'Varanasi (Banaras)',
      jaipur: 'Jaipur',
      allCategories: 'All Categories',
      confirmed: 'Confirmed',
      tentative: 'Tentative',
      datesTBA: 'Dates To Be Announced',
      lastVerified: 'Last Verified',
      venue: 'Venue',
      dates: 'Dates',
      culturalSignificance: 'Cultural Significance',
      whatToExperience: 'What Visitors Can Experience',
      importantGuidelines: 'Important Visitor Guidelines',
      findCompanionForEvent: 'Find a Buddy for this Festival',
      relatedPackages: 'Suggested Travel Packages',
      noEventsFound: 'No upcoming festivals found matching your criteria',
      resetFilters: 'Reset Filters',
      ongoing: 'Ongoing Today',
      upcoming: 'Upcoming',
      pastArchive: 'Past Events Archive',
      cancelled: 'Cancelled',
      dateShifted: 'Dates Rescheduled by Authority',
      officialSource: 'Official Tourism Source',
    },
    testimonials: {
      eyebrow: 'Verified Stories',
      title: 'Real journeys. Real words.',
      subtitle: 'Read how fellow travelers experienced Varanasi through the guidance of trusted local companions.',
    },
    faq: {
      eyebrow: 'Questions & Answers',
      title: 'Frequently Asked Questions.',
      subtitle: 'Everything you need to know about our companion discovery, verified safety standards, transparent pricing, and effortless booking.',
      allFaqs: 'All Questions',
    },
    footer: {
      brandDesc: 'Experience the ancient rhythms, ghats, and spiritual alleyways of Varanasi alongside cultured, verified local companions.',
      exploreTitle: 'Explore Banaras',
      platformTitle: 'Platform',
      connectTitle: 'Connect',
      legalTitle: 'Legal & Policies',
      rights: 'TravelOnBuddy. All rights reserved. Made with devotion in Kashi.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cancellation: 'Cancellation Policy',
      safetyTrust: 'Safety & Trust',
    },
    booking: {
      title: 'Request Your Travel Buddy.',
      subtitle: 'Experience Kashi with peace of mind. Confirm dates, party size, and itinerary to initiate your personalized companion match.',
      step1Title: 'Selected Travel Companion',
      step1Desc: 'Review your selected local Varanasi buddy and their verified credentials.',
      step2Title: 'Travel Dates & Schedule',
      step2Desc: 'When would you like to explore Varanasi together?',
      step3Title: 'Select Duration Tier',
      step3Desc: 'Choose how long you would like your companion accompanied.',
      step4Title: 'Party Size & Guests',
      step4Desc: 'How many travelers will be accompanying you on this tour?',
      step5Title: 'Ghats & Preferred Highlights',
      step5Desc: 'Select specific places you wish to visit with your companion.',
      step6Title: 'Pickup Point & Preferences',
      step6Desc: 'Provide your hotel or rendezvous landmark in Varanasi.',
      step7Title: 'Review & Price Breakdown',
      step7Desc: 'Review verified pricing before sending your request to operations.',
      travelerName: 'Full Legal Name',
      travelerEmail: 'Email Address',
      travelerPhone: 'Mobile / WhatsApp Number',
      travelDate: 'Tour Date',
      preferredTime: 'Starting Time',
      travelPartySize: 'Number of Travelers',
      duration: 'Duration Tier',
      pickupLocation: 'Varanasi Meeting / Pickup Location',
      pickupPlaceholder: 'e.g. Hotel Taj Ganges, Assi Ghat steps, or Godowlia Crossing',
      specialRequests: 'Special Requests / Dietary / Elder notes',
      priceSummary: 'Verified Price Breakdown',
      baseRate: 'Companion Base Honorarium',
      serviceFee: 'Platform Coordination & Safety Fee',
      totalAmount: 'Total Estimated Amount',
      submitRequest: 'Submit Booking Request',
      confirmationTitle: 'Booking Request Submitted Successfully!',
      bookingRef: 'Booking Reference Number',
      status: 'Current Status',
      trackInDashboard: 'Track in Traveler Dashboard',
    },
    auth: {
      welcome: 'Welcome to TravelOnBuddy',
      loginDesc: 'Access your traveler requests, companion assignments, or management console.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      forgotPassword: 'Forgot?',
      signInBtn: 'Sign In to Your Account',
      demoNote: 'Demonstration Mode Active: Test with traveler@example.com, anand.shukla@buddy.com, or admin@travelonbuddy.com.',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      joinTitle: 'Join TravelOnBuddy',
      joinDesc: 'Whether you want to explore Varanasi or become an ambassador for your city.',
      iAmTraveler: 'I am a Traveler',
      iAmTravelerDesc: 'Looking for a verified Varanasi companion',
      becomeBuddy: 'Become a Buddy',
      becomeBuddyDesc: 'Local Varanasi host, scholar or storyteller',
      fullName: 'Full Legal Name',
      phoneLabel: 'Mobile Number',
      createAccountBtn: 'Create Account',
      haveAccount: 'Already have an account?',
    },
    dashboard: {
      overview: 'Overview',
      myRequests: 'My Travel Requests',
      myBookings: 'My Bookings',
      myAssignments: 'Assigned Tours',
      profile: 'Profile Details',
      settings: 'Settings',
      support: 'Helpdesk Support',
      notifications: 'Notifications',
      history: 'Trip History',
      availability: 'Manage Calendar',
      acceptAssignment: 'Accept Assignment',
      declineAssignment: 'Decline',
      manageBookings: 'Manage',
      status: 'Status',
      companion: 'Companion',
      traveler: 'Traveler',
      action: 'Action',
    },
  },
  HI: {
    common: {
      brandName: 'TravelOn',
      brandSuffix: 'Buddies',
      tagline: 'वाराणसी एवं पवित्र भारत के स्थानीय साथी',
      login: 'लॉग इन',
      logout: 'लॉग आउट',
      register: 'पंजीकरण',
      bookBuddy: 'ट्रैवल बडी बुक करें',
      book: 'बुक करें',
      viewDetails: 'विवरण देखें',
      explore: 'एक्सप्लोर करें',
      exploreMore: 'और जानें',
      findBuddy: 'अपना ट्रैवल बडी खोजें',
      all: 'सभी',
      submit: 'अनुरोध भेजें',
      cancel: 'रद्द करें',
      save: 'परिवर्तन सहेजें',
      back: 'पीछे',
      next: 'अगला चरण',
      loading: 'लोड हो रहा है...',
      success: 'सफल',
      error: 'त्रुटि',
      perHour: 'प्रति घंटा',
      verified: 'सत्यापित बडी',
      trips: 'यात्राएं',
      reviews: 'समीक्षाएं',
      rating: 'रेटिंग',
      duration: 'अवधि',
      groupSize: 'यात्रियों की संख्या',
      placesCovered: 'शामिल स्थल',
      included: 'शामिल',
      notIncluded: 'वास्तविक खर्च पर देय',
      stepOf: 'चरण',
    },
    navbar: {
      home: 'होम',
      explore: 'बनारस एक्सप्लोर करें',
      findBuddy: 'ट्रैवल बडी खोजें',
      experiences: 'अनुभव',
      packages: 'टूर पैकेज',
      events: 'त्योहार एवं उत्सव',
      safety: 'सुरक्षा एवं विश्वास',
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      dashboard: 'डैशबोर्ड',
      switchLanguage: 'English',
    },
    hero: {
      eyebrow: 'वाराणसी एवं पवित्र भारत के स्थानीय साथी',
      headlinePart1: 'सुरक्षित यात्रा।',
      headlinePart2: 'खुली खोज।',
      subheadline: 'जब कोई अपना साथ हो, तो हर सफर खूबसूरत बन जाता है। विश्वसनीय स्थानीय साथियों के साथ काशी को पूरे सुकून और विश्वास से अनुभव करें।',
      findBuddyBtn: 'अपना ट्रैवल बडी खोजें',
      exploreBtn: 'बनारस एक्सप्लोर करें',
      photoCaption: 'दशाश्वमेध घाट, वाराणसी',
    },
    intro: {
      eyebrow: 'TravelOnBuddy का अनोखा अनुभव',
      titlePart1: 'केवल एक गंतव्य नहीं।',
      titlePart2: 'एक जीवंत अनुभव है।',
      description: 'वाराणसी प्राचीन, गहरा और आध्यात्मिक है। यहाँ आप सिर्फ स्मारक नहीं देखते; आप तीन सहस्राब्दियों के जीवित दर्शन, सुबह के राग, पवित्र घाटों और बुनकरों की गलियों को महसूस करते हैं। एक स्थानीय साथी आपके साथ चलता है—कहानियाँ सुनाता है, बिचौलियों से बचाता है और काशी को जीवंत करता है।',
      pillar1Title: 'सच्चा व प्रमाणिक अनुभव',
      pillar1Desc: 'सुबह की शांत नौका यात्रा, प्राचीन छिपे हुए मंदिर और सदियों पुराने खान-पान के स्वाद, बिना किसी व्यावसायिक कमीशन के।',
      pillar2Title: 'सभ्य स्थानीय साथी',
      pillar2Desc: 'शिक्षित छात्र, इतिहासकार और सुसंस्कृत स्थानीय नागरिक जो अपने शहर से प्रेम करते हैं और आपका परिवार की तरह स्वागत करते हैं।',
      pillar3Title: 'अपनी गति से घूमें',
      pillar3Desc: 'अपनी सुविधानुसार यात्रा करें। जब चाहें फोटोग्राफी के लिए रुकें, बुजुर्गों को विश्राम दें या गर्म कुल्हड़ चाय का आनंद लें।',
    },
    howItWorks: {
      eyebrow: 'सहज प्रक्रिया',
      title: 'आसान चरण। बेहतर यात्राएँ।',
      subtitle: 'सत्यापित स्थानीय साथियों से जुड़ने का पारदर्शी और सुरक्षित माध्यम।',
      step1Title: 'अपना पसंदीदा स्थान चुनें',
      step1Desc: 'पवित्र घाटों, प्राचीन मंदिरों, रेशमी साड़ियों की गलियों या स्वादिष्ट बनारसी व्यंजनों में से चुनें।',
      step2Title: 'अपना साथी चुनें',
      step2Desc: 'भाषा, विश्वविद्यालय पृष्ठभूमि, रेटिंग और अपनी व्यक्तिगत रुचि के अनुसार साथी चुनें।',
      step3Title: 'दिन की योजना बनाएं',
      step3Desc: 'तारीख, सुबह या शाम का समय, यात्रियों की संख्या और पारदर्शी दरों के साथ यात्रा तय करें।',
      step4Title: 'साथ मिलकर घूमें',
      step4Desc: 'तय स्थान पर अपने सत्यापित साथी से मिलें और सुरक्षित रूप से काशी की आत्मा को महसूस करें।',
    },
    destinations: {
      eyebrow: 'प्रमुख गंतव्य',
      title: 'खूबसूरत बनारस की यात्रा।',
      subtitle: 'ऐसे दर्शनीय स्थलों को खोजें जो एक स्थानीय साथी के साथ और भी यादगार बन जाते हैं।',
      viewAll: 'सभी गंतव्य देखें',
      searchPlaceholder: 'घाट, मंदिर, खान-पान या धरोहर खोजें...',
      noDestinationsFound: 'आपके खोज अनुसार कोई स्थल नहीं मिला।',
      resetFilters: 'फ़िल्टर रीसेट करें',
      highlightsIncluded: 'प्रमुख आकर्षण:',
      exploreWithBuddy: 'बडी के साथ घूमें',
      suggestedDuration: 'सुझाई गई अवधि',
      bestTime: 'भ्रमण का सर्वोत्तम समय',
      location: 'स्थान',
      availableExperiences: 'उपलब्ध अनुभव',
    },
    buddies: {
      eyebrow: 'सत्यापित स्थानीय साथी',
      title: 'हमारे ट्रैवल बडीज़ से मिलें।',
      subtitle: 'हमारे सभी साथी पूरी तरह से सत्यापित, सुसंस्कृत स्थानीय निवासी हैं जो काशी के घाटों और गलियों में पले-बढ़े हैं। अपनी भाषा, गति और रुचि के अनुसार सही साथी चुनें।',
      searchPlaceholder: 'नाम, भाषा या विशेषज्ञता से खोजें...',
      allGenders: 'सभी साथी',
      femaleOnly: 'केवल महिला साथी',
      maleOnly: 'केवल पुरुष साथी',
      allLanguages: 'सभी भाषाएँ',
      noBuddiesFound: 'आपकी खोज के अनुसार कोई साथी उपलब्ध नहीं है।',
      resetFilters: 'फ़िल्टर रीसेट करें',
      bookThisBuddy: 'यह बडी बुक करें',
      yearsExp: 'वर्षों का अनुभव',
      nativeOf: 'मूल निवासी',
      speaks: 'भाषाएँ',
      hourlyRate: 'प्रति घंटा दर',
      halfDayRate: 'आधे दिन की दर',
      fullDayRate: 'पूरे दिन की दर',
      reviewsTitle: 'यात्रियों की समीक्षाएं एवं अनुभव',
      availability: 'उपलब्धता एवं समय',
      availableSlots: 'उपलब्ध समय स्लॉट',
    },
    experiences: {
      eyebrow: 'हस्तनिर्मित अनुभव',
      title: 'अनोखे बनारसी अनुभव।',
      subtitle: 'पवित्र गंगा आरती, सुबह की नौका यात्रा और गुप्त गलियों के रहस्यों को जानने वाले साथियों के साथ समय बिताएँ।',
      bookCompanionForExp: 'इस अनुभव के लिए साथी बुक करें',
      bookExperience: 'अनुभव बुक करें',
      withVerifiedCompanion: 'सत्यापित साथी के साथ',
    },
    packages: {
      eyebrow: 'स्पष्ट एवं पारदर्शी',
      title: 'यात्रा पैकेज।',
      subtitle: 'सरल, ईमानदार मूल्य। बिना किसी छिपे कमीशन के केवल साथी का पारिश्रमिक।',
      mostPopular: 'सर्वाधिक लोकप्रिय',
      partySize: 'यात्रियों की संख्या',
      honorarium: 'साथी का पारिश्रमिक',
      bookPackage: 'पैकेज बुक करें',
    },
    events: {
      eyebrow: 'सांस्कृतिक कैलेंडर एवं उत्सव',
      title: 'आगामी प्रमुख त्योहार एवं उत्सव',
      subtitle: 'हर शहर के उत्सवों, परंपराओं और गौरवशाली संस्कृति का प्रत्यक्ष अनुभव करें।',
      description: 'जानें कि आपके पसंदीदा गंतव्य में कौन से उत्सव हो रहे हैं और अपनी यात्रा को इन्हीं पावन तिथियों के अनुसार बनाएं।',
      viewAll: 'सभी त्योहार एवं उत्सव देखें',
      planMyVisit: 'यात्रा प्लान करें',
      viewDetails: 'विस्तृत विवरण देखें',
      allCities: 'सभी शहर',
      varanasi: 'वाराणसी (बनारस)',
      jaipur: 'जयपुर',
      allCategories: 'सभी श्रेणियां',
      confirmed: 'तिथि पुष्ट (Confirmed)',
      tentative: 'संभावित तिथि (Tentative)',
      datesTBA: 'तिथि शीघ्र घोषित होगी',
      lastVerified: 'अंतिम सत्यापन',
      venue: 'स्थान एवं स्थल',
      dates: 'तिथियां',
      culturalSignificance: 'सांस्कृतिक एवं धार्मिक महत्व',
      whatToExperience: 'यात्री क्या अनुभव करेंगे',
      importantGuidelines: 'यात्रियों हेतु आवश्यक निर्देश',
      findCompanionForEvent: 'इस उत्सव के लिए स्थानीय बडी खोजें',
      relatedPackages: 'अनुशंसित यात्रा पैकेज',
      noEventsFound: 'चयनित प्राथमिकताओं के अनुसार कोई आगामी उत्सव उपलब्ध नहीं है',
      resetFilters: 'फ़िल्टर रीसेट करें',
      ongoing: 'आज जारी (Ongoing)',
      upcoming: 'आगामी (Upcoming)',
      pastArchive: 'पुराने उत्सवों का अभिलेखागार (Past Archive)',
      cancelled: 'रद्द (Cancelled)',
      dateShifted: 'प्रशासन द्वारा तिथियों में संशोधन',
      officialSource: 'आधिकारिक पर्यटन स्रोत',
    },
    testimonials: {
      eyebrow: 'सत्यापित कहानियाँ',
      title: 'सच्ची यात्राएँ। सच्चे शब्द।',
      subtitle: 'पढ़ें कि कैसे साथी यात्रियों ने स्थानीय मित्रों के साथ वाराणसी का अविस्मरणीय अनुभव किया।',
    },
    faq: {
      eyebrow: 'प्रश्न एवं उत्तर',
      title: 'अक्सर पूछे जाने वाले प्रश्न।',
      subtitle: 'हमारे साथी चयन, सुरक्षा मानकों, पारदर्शी दरों और बुकिंग प्रक्रिया के बारे में सब कुछ जानें।',
      allFaqs: 'सभी प्रश्न',
    },
    footer: {
      brandDesc: 'संस्कृत एवं सुसंस्कृत स्थानीय साथियों के साथ वाराणसी के प्राचीन घाटों और आध्यात्मिक गलियों को करीब से महसूस करें।',
      exploreTitle: 'बनारस एक्सप्लोर करें',
      platformTitle: 'प्लेटफॉर्म',
      connectTitle: 'जुड़ें',
      legalTitle: 'नीति एवं नियम',
      rights: 'TravelOnBuddy. सर्वाधिकार सुरक्षित। काशी में श्रद्धापूर्वक निर्मित।',
      privacy: 'गोपनीयता नीति',
      terms: 'नियम एवं शर्तें',
      cancellation: 'रद्दीकरण नीति',
      safetyTrust: 'सुरक्षा एवं विश्वास',
    },
    booking: {
      title: 'अपना ट्रैवल बडी बुक करें।',
      subtitle: 'काशी को पूरे सुकून से अनुभव करें। अपनी तारीख, समूह का आकार और कार्यक्रम चुनकर व्यक्तिगत साथी का अनुरोध भेजें।',
      step1Title: 'चयनित स्थानीय साथी',
      step1Desc: 'अपने चयनित वाराणसी साथी और उनके सत्यापित क्रेडेंशियल्स की समीक्षा करें।',
      step2Title: 'यात्रा की तारीख एवं समय',
      step2Desc: 'आप किस दिन और समय पर बनारस घूमना चाहते हैं?',
      step3Title: 'अवधि चुनें',
      step3Desc: 'तय करें कि आप अपने साथी का साथ कितने समय के लिए चाहते हैं।',
      step4Title: 'यात्रियों की संख्या',
      step4Desc: 'इस यात्रा में आपके साथ कुल कितने सदस्य होंगे?',
      step5Title: 'घाट एवं पसंदीदा आकर्षण',
      step5Desc: 'वे स्थल चुनें जिन्हें आप अपने साथी के साथ देखना चाहते हैं।',
      step6Title: 'मिलने का स्थान (पिकअप)',
      step6Desc: 'वाराणसी में अपने होटल या मिलने का प्रमुख लैंडमार्क दर्ज करें।',
      step7Title: 'समीक्षा एवं कुल शुल्क',
      step7Desc: 'अनुरोध भेजने से पहले पारदर्शी शुल्क विवरण की समीक्षा करें।',
      travelerName: 'पूरा कानूनी नाम',
      travelerEmail: 'ईमेल पता',
      travelerPhone: 'मोबाइल / व्हाट्सएप नंबर',
      travelDate: 'यात्रा की तारीख',
      preferredTime: 'शुरुआती समय',
      travelPartySize: 'यात्रियों की कुल संख्या',
      duration: 'अवधि श्रेणी',
      pickupLocation: 'वाराणसी में मिलने का स्थान',
      pickupPlaceholder: 'जैसे होटल, अस्सी घाट या गोदौलिया चौराहा',
      specialRequests: 'विशेष अनुरोध / खान-पान / बुजुर्ग सहायता',
      priceSummary: 'पारदर्शी शुल्क विवरण',
      baseRate: 'साथी का मूल मानदेय',
      serviceFee: 'प्लेटफॉर्म समन्वय एवं सुरक्षा शुल्क',
      totalAmount: 'कुल अनुमानित राशि',
      submitRequest: 'बुकिंग अनुरोध जमा करें',
      confirmationTitle: 'बुकिंग अनुरोध सफलतापूर्वक जमा हो गया!',
      bookingRef: 'बुकिंग संदर्भ संख्या',
      status: 'वर्तमान स्थिति',
      trackInDashboard: 'यात्री डैशबोर्ड में ट्रैक करें',
    },
    auth: {
      welcome: 'TravelOnBuddy में आपका स्वागत है',
      loginDesc: 'अपने यात्रा अनुरोधों, साथी आवंटन या प्रबंधन कंसोल तक पहुँचें।',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      forgotPassword: 'भूल गए?',
      signInBtn: 'अपने खाते में प्रवेश करें',
      demoNote: 'परीक्षण मोड सक्रिय: traveler@example.com, anand.shukla@buddy.com, या admin@travelonbuddy.com से लॉगिन करें।',
      noAccount: 'क्या आपके पास खाता नहीं है?',
      registerHere: 'यहाँ पंजीकरण करें',
      joinTitle: 'TravelOnBuddy से जुड़ें',
      joinDesc: 'चाहे आप वाराणसी घूमना चाहते हों या अपने शहर के सांस्कृतिक दूत बनना चाहते हों।',
      iAmTraveler: 'मैं एक यात्री हूँ',
      iAmTravelerDesc: 'सत्यापित वाराणसी स्थानीय साथी की तलाश में',
      becomeBuddy: 'लोकल बडी बनें',
      becomeBuddyDesc: 'वाराणसी के स्थानीय मार्गदर्शक, छात्र या कथावाचक',
      fullName: 'पूरा नाम',
      phoneLabel: 'मोबाइल नंबर',
      createAccountBtn: 'खाता बनाएं',
      haveAccount: 'पहले से खाता है?',
    },
    dashboard: {
      overview: 'अवलोकन',
      myRequests: 'मेरे यात्रा अनुरोध',
      myBookings: 'मेरी बुकिंग्स',
      myAssignments: 'आवंटित यात्राएं',
      profile: 'प्रोफ़ाइल विवरण',
      settings: 'सेटिंग्स',
      support: 'हेल्पडेस्क सहायता',
      notifications: 'सूचनाएं',
      history: 'यात्रा इतिहास',
      availability: 'कैलेंडर प्रबंधन',
      acceptAssignment: 'स्वीकार करें',
      declineAssignment: 'अस्वीकार करें',
      manageBookings: 'प्रबंधन',
      status: 'स्थिति',
      companion: 'साथी',
      traveler: 'यात्री',
      action: 'कार्रवाई',
    },
  },
};
