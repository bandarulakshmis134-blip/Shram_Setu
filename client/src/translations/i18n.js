import i18n from "i18next";

import { initReactI18next } from "react-i18next";

const resources = {

 en:{

  translation:{

   home:"Home",
   dashboard:"Dashboard",
   profile:"Profile",
   messages:"Messages",
   jobs:"Jobs",
   findWorkers:"Find Workers",
   logout:"Logout",
   welcome:"Welcome",
   postJob:"Post Job",
   workerRegister:"Worker Register",
   kaiyoPlaceholder:"Ask KAIYO anything...",
   smartAssistant:"Smart Assistant"

  }

 },

 te:{

  translation:{

   home:"హోమ్",
   dashboard:"డాష్‌బోర్డ్",
   profile:"ప్రొఫైల్",
   messages:"సందేశాలు",
   jobs:"ఉద్యోగాలు",
   findWorkers:"వర్కర్లను కనుగొనండి",
   logout:"లాగౌట్",
   welcome:"స్వాగతం",
   postJob:"ఉద్యోగం పోస్ట్ చేయండి",
   workerRegister:"వర్కర్ నమోదు",
   kaiyoPlaceholder:"KAIYO ని ఏదైనా అడగండి...",
   smartAssistant:"స్మార్ట్ అసిస్టెంట్"

  }

 },

 ta:{

  translation:{

   home:"முகப்பு",
   dashboard:"டாஷ்போர்டு",
   profile:"சுயவிவரம்",
   messages:"செய்திகள்",
   jobs:"வேலைகள்",
   findWorkers:"தொழிலாளர்களைக் கண்டுபிடிக்க",
   logout:"வெளியேறு",
   welcome:"வரவேற்பு",
   postJob:"வேலை இடுகை",
   workerRegister:"தொழிலாளர் பதிவு",
   kaiyoPlaceholder:"KAIYO-ஐ ஏதாவது கேளுங்கள்...",
   smartAssistant:"ஸ்மார்ட் உதவியாளர்"

  }

 },

 kn:{

  translation:{

   home:"ಮುಖಪುಟ",
   dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
   profile:"ಪ್ರೊಫೈಲ್",
   messages:"ಸಂದೇಶಗಳು",
   jobs:"ಉದ್ಯೋಗಗಳು",
   findWorkers:"ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ",
   logout:"ಲಾಗ್ ಔಟ್",
   welcome:"ಸ್ವಾಗತ",
   postJob:"ಉದ್ಯೋಗ ಪೋಸ್ಟ್",
   workerRegister:"ಕಾರ್ಮಿಕ ನೋಂದಣಿ",
   kaiyoPlaceholder:"KAIYO ಅನ್ನು ಏನಾದರೂ ಕೇಳಿ...",
   smartAssistant:"ಸ್ಮಾರ್ಟ್ ಸಹಾಯಕ"

  }

 },

 ml:{

  translation:{

   home:"ഹോം",
   dashboard:"ഡാഷ്ബോർഡ്",
   profile:"പ്രൊഫൈൽ",
   messages:"സന്ദേശങ്ങൾ",
   jobs:"ജോലികൾ",
   findWorkers:"തൊഴിലാളികളെ കണ്ടെത്തുക",
   logout:"ലോഗ്ഔട്ട്",
   welcome:"സ്വാഗതം",
   postJob:"ജോലി പോസ്റ്റ് ചെയ്യുക",
   workerRegister:"വർക്കർ രജിസ്ട്രേഷൻ",
   kaiyoPlaceholder:"KAIYOയോട് എന്തെങ്കിലും ചോദിക്കൂ...",
   smartAssistant:"സ്മാർട്ട് അസിസ്റ്റന്റ്"

  }

 },

 hi:{

  translation:{

   home:"होम",
   dashboard:"डैशबोर्ड",
   profile:"प्रोफ़ाइल",
   messages:"मैसेज",
   jobs:"नौकरियाँ",
   findWorkers:"वर्कर्स खोजें",
   logout:"लॉगआउट",
   welcome:"स्वागत है",
   postJob:"जॉब पोस्ट करें",
   workerRegister:"वर्कर रजिस्टर",
   kaiyoPlaceholder:"KAIYO से कुछ पूछें...",
   smartAssistant:"स्मार्ट असिस्टेंट"

  }

 }

};

const savedLanguage =

 localStorage.getItem("language") || "en";

i18n

.use(initReactI18next)

.init({

 resources,

 lng:savedLanguage,

 fallbackLng:"en",

 interpolation:{

  escapeValue:false

 }

});

export default i18n;