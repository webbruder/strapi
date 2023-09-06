import { getFetchClient } from '@strapi/helper-plugin';
import { createRoot } from 'react-dom/client';

import { Components, Fields, Middlewares, Reducers } from './core/apis';
import appReducers from './reducers';
import StrapiApp from './StrapiApp';

const renderAdmin = async ({ plugins }) => {
  window.strapi = {
    backendURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    isEE: false,
    telemetryDisabled: process.env.STRAPI_TELEMETRY_DISABLED ?? false,
    features: {
      SSO: 'sso',
      AUDIT_LOGS: 'audit-logs',
      REVIEW_WORKFLOWS: 'review-workflows',
    },
    projectType: 'Community',
  };

  const library = {
    components: Components(),
    fields: Fields(),
  };
  const middlewares = Middlewares();
  const reducers = Reducers({ appReducers });

  const MOUNT_NODE = document.getElementById('app');

  const { get } = getFetchClient();

  try {
    const {
      data: {
        data: { isEE, features },
      },
    } = await get('/admin/project-type');

    window.strapi.isEE = isEE;
    window.strapi.features = {
      ...window.strapi.features,
      isEnabled: (featureName) => features.some((feature) => feature.name === featureName),
    };

    window.strapi.projectType = isEE ? 'Enterprise' : 'Community';
  } catch (err) {
    console.error(err);
  }

  const app = StrapiApp({
    appPlugins: plugins,
    library,
    middlewares,
    reducers,
  });

  await app.bootstrapAdmin();
  await app.initialize();
  await app.bootstrap();

  await app.loadTrads();

  const root = createRoot(MOUNT_NODE);

  root.render(app.render());
};

export { renderAdmin };
