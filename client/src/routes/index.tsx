import ScreenLoader from "@/components/layout/screen-loader";
import { CACHE_KEYS, TOKEN_PREFIX } from "@/constants/common";
import AuthLayout from "@/features/auth/layout";
import DashboardLayout from "@/layout/dashboard";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";

// import lazy load pages
//Auth Module
const LoginPage = lazy(() => import("@/features/auth/login"));
const ForgotPassword = lazy(() => import("@/features/auth/forgot-password"));
const ResetPassword = lazy(() => import("@/features/auth/reset-password"));
const UsersPage = lazy(() => import("@/features/auth/users"));
const VerifyEmail = lazy(() => import("@/features/auth/verify-email"));
//Dashboard Pages
const ProfilePage = lazy(() => import("@/features/shared/profile"));
//Governance Module
const DocumentsPage = lazy(() => import("@/features/governance/document"));
const RolesPage = lazy(() => import("@/features/governance/roles"));
const RoleTypesPage = lazy(() => import("@/features/governance/role-types"));
const VendorsPage = lazy(() => import("@/features/governance/vendor"));
const QuestionnairePage = lazy(
  () => import("@/features/governance/questionnaire")
);
const QuestionnaireCreatePage = lazy(
  () => import("@/features/governance/questionnaire/create")
);
const QuestionnaireEditPage = lazy(
  () => import("@/features/governance/questionnaire/edit")
);
const UserIdentityPage = lazy(
  () => import("@/features/governance/user-identity")
);

const TasksPage = lazy(() => import("@/features/governance/tasks"));

const AppRoutes = () => {
  const { setUser } = useAuthStore();

  const { isFetching, data } = useQuery({
    queryKey: [CACHE_KEYS.PROFILE],
    enabled: localStorage.getItem(TOKEN_PREFIX) ? true : false,
    queryFn: authService.getAccount,
  });

  useEffect(() => {
    if (data?.data && "profile" in data?.data) {
      const user = data?.data?.profile;
      setUser(user);
    }
  }, [data?.data]);

  if (isFetching) {
    return <ScreenLoader />;
  }

  return (
    <Suspense fallback={<ScreenLoader />}>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="reset-password/:uid/:token"
            element={<ResetPassword />}
          />
          <Route path="*" element={<LoginPage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DocumentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="role-types" element={<RoleTypesPage />} />
          <Route path="user-identity" element={<UserIdentityPage />} />
          <Route path="governance" element={<VendorsPage />} />
          <Route path="questionnaire" element={<QuestionnairePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route
            path="questionnaire/create"
            element={<QuestionnaireCreatePage />}
          />
          <Route
            path="questionnaire/edit/:id"
            element={<QuestionnaireEditPage />}
          />
          <Route path="*" element={<DocumentsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
