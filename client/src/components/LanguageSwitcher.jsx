import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {

 const { i18n } = useTranslation();

 const changeLanguage = (lang)=>{

  i18n.changeLanguage(lang);

  localStorage.setItem(

   "language",

   lang

  );

 };

 return (

  <select

   value={i18n.language}

   onChange={(e)=>

    changeLanguage(e.target.value)

   }

   className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"

  >

   <option value="en">

    English

   </option>

   <option value="te">

    తెలుగు

   </option>

   <option value="ta">

    தமிழ்

   </option>

   <option value="kn">

    ಕನ್ನಡ

   </option>

   <option value="ml">

    മലയാളം

   </option>

   <option value="hi">

    हिन्दी

   </option>

  </select>

 );

};

export default LanguageSwitcher;