import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import ProfileSidebar from "./components/profile-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import PersonalInformation from "./components/personal-information";
import AccountInformation from "./components/account-information";
import SecurityInformation from "./components/security-information";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("account");
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-full flex-col bg-background md:flex-row">
      <ProfileSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 p-4 md:p-6">
        {isMobile && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setSidebarOpen(true)}
            className="mr-auto mb-4"
          >
            <Menu />
          </Button>
        )}

        <div className="mx-auto max-w-3xl">
          {activeSection === "account" && <AccountInformation />}
          {activeSection === "personal" && <PersonalInformation />}
          {activeSection === "password" && <SecurityInformation />}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
