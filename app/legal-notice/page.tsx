import { PolicyPage } from "@/components/PolicyPage";
import { storeSettings } from "@/content/store-settings";
export const metadata = {title:"Legal Notice"};
export default function Page(){return <PolicyPage title="Legal Notice" sections={[["Operator",storeSettings.businessName || "Legal operator details must be completed before launch."],["Business address",storeSettings.businessAddress || "Business correspondence address must be completed before launch."],["Registration country",storeSettings.businessCountry || "The legal operator country must be confirmed before launch. A US warehouse does not determine the seller’s country."]]}/>;}
