import Monitoring from "./widgets/Monitoring";
import QuickActions from "./widgets/QuickActions";
import OverView from "./widgets/overView";
import WelcomeHeader from "./widgets/welcomeHeader";

export default function Dashboard() {

  return (
    <div className="w-full h-full p-6 bg-gray-100 dark:bg-neutral-900 space-y-4 ">

      <WelcomeHeader />
      <OverView />

      {/* Monitoring */}
      <div className="flex items-start justify-between gap-2 w-full ">
        <Monitoring className="w-3/4!" />
        <QuickActions className="w-1/4" />
      </div>
    </div>
  );
}