import { useEffect } from 'react';

import { useAppInfo, useNotification } from '@strapi/helper-plugin';

const useReleaseNotification = () => {
  const { latestStrapiReleaseTag, shouldUpdateStrapi } = useAppInfo();
  const toggleNotification = useNotification();

  useEffect(() => {
    const showUpdateNotif = !JSON.parse(localStorage.getItem('STRAPI_UPDATE_NOTIF'));

    if (shouldUpdateStrapi && showUpdateNotif) {
      toggleNotification({
        type: 'info',
        message: { id: 'notification.version.update.message' },
        link: {
          url: `https://github.com/strapi/strapi/releases/tag/${latestStrapiReleaseTag}`,
          label: {
            id: 'global.see-more',
          },
        },
        blockTransition: true,
        onClose: () => localStorage.setItem('STRAPI_UPDATE_NOTIF', true),
      });
    }
  }, [latestStrapiReleaseTag, shouldUpdateStrapi, toggleNotification]);

  return null;
};

export default useReleaseNotification;
