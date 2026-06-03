import { adminSignupRoute, authRoute, loginRoute } from "./auth.routes";
import {
  appIndexRoute,
  appRoute,
  documentsRoute,
  sitesRoute,
  usersRoute,
  voiceKnowledgeRoute,
} from "./app.routes";
import { indexRoute } from "./index.route";
import { rootRoute } from "./root.route";

export const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute.addChildren([loginRoute, adminSignupRoute]),
  appRoute.addChildren([
    appIndexRoute,
    usersRoute,
    sitesRoute,
    documentsRoute,
    voiceKnowledgeRoute,
  ]),
]);
