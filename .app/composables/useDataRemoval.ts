export const useDataRemoval = () => {
  const { $pb } = useNuxtApp();
  const { user, role } = useUser();
  const { clearAllCaches } = usePwaCache();
  const { deleteAllMessages } = useMessage();

  const removeAllUserData = async (): Promise<void> => {
    try {
      const userId = user.value?.id;
      if (!userId) {
        throw new Error('No user found');
      }

      // 1. Clear PocketBase collections
      await Promise.all([
        // Delete ALL user sessions (including those with status='deleted')
        (async () => {
          try {
            // Get ALL sessions for the user regardless of status
            const allUserSessions = await $pb.collection('sessions').getFullList({
              filter: `user="${userId}"`,
              // Don't use any status filter - get ALL sessions
              requestKey: null,
            });

            console.log(`Found ${allUserSessions.length} total sessions (including deleted) for user ${userId}:`, allUserSessions);

            // If no sessions found with quoted filter, try unquoted (relation field)
            if (allUserSessions.length === 0) {
              const unquotedSessions = await $pb.collection('sessions').getFullList({
                filter: `user=${userId}`,
                requestKey: null,
              });
              console.log(`Found ${unquotedSessions.length} sessions with unquoted filter`);

              if (unquotedSessions.length === 0) {
                // Last resort: get all sessions and filter locally
                const allSessions = await $pb.collection('sessions').getFullList({ requestKey: null });
                const filteredSessions = allSessions.filter((session: any) =>
                  session.user === userId || session.user?.id === userId,
                );
                console.log(`Found ${filteredSessions.length} sessions after local filtering from ${allSessions.length} total sessions`);

                // Delete the locally filtered sessions
                for (const session of filteredSessions) {
                  console.log(`Deleting session ${session.id} (status: ${session.status})`);
                  await $pb.collection('sessions').delete(session.id);
                }
              }
              else {
                // Delete unquoted filter results
                for (const session of unquotedSessions) {
                  console.log(`Deleting session ${session.id} (status: ${session.status})`);
                  await $pb.collection('sessions').delete(session.id);
                }
              }
            }
            else {
              // Delete all found sessions regardless of their status
              for (const session of allUserSessions) {
                console.log(`Deleting session ${session.id} (status: ${session.status})`);
                await $pb.collection('sessions').delete(session.id);
              }
            }

            console.log(`Successfully processed session deletion for user ${userId}`);
          }
          catch (error) {
            console.error('Error in session deletion process:', error);
            throw error;
          }
        })(),

        // Delete all user messages
        deleteAllMessages(userId),

        // Delete all user reports
        $pb.collection('final_reports').getFullList({ filter: `user="${userId}"` })
          .then(reports => Promise.all(
            reports.map(report => $pb.collection('final_reports').delete(report.id)),
          )).catch(() => {}),

        // Delete all user notifications
        $pb.collection('notifications').getFullList({ filter: `user="${userId}"` })
          .then(notifications => Promise.all(
            notifications.map(notification => $pb.collection('notifications').delete(notification.id)),
          )).catch(() => {}),

        // Delete all session analyses
        $pb.collection('session_analysis_for_system').getFullList({ filter: `user="${userId}"` })
          .then(analyses => Promise.all(
            analyses.map(analysis => $pb.collection('session_analysis_for_system').delete(analysis.id)),
          )).catch(() => {}),

        // Delete summarized messages
        $pb.collection('summerizedMessages').getFullList({ filter: `user="${userId}"` })
          .then(summaries => Promise.all(
            summaries.map(summary => $pb.collection('summerizedMessages').delete(summary.id)),
          )).catch(() => {}),

        // Delete session analysis for patient
        $pb.collection('session_analysis_for_patient').getFullList({ filter: `user="${userId}"` })
          .then(analyses => Promise.all(
            analyses.map(analysis => $pb.collection('session_analysis_for_patient').delete(analysis.id)),
          )).catch(() => {}),

        // Delete session progress
        $pb.collection('session_progress').getFullList({ filter: `user="${userId}"` })
          .then(progress => Promise.all(
            progress.map(p => $pb.collection('session_progress').delete(p.id)),
          )).catch(() => {}),

        // Delete session analysis (generic)
        $pb.collection('session_analysis').getFullList({ filter: `user="${userId}"` })
          .then(analyses => Promise.all(
            analyses.map(analysis => $pb.collection('session_analysis').delete(analysis.id)),
          )).catch(() => {}),
      ]);

      // 2. Clear localStorage data
      if (import.meta.client) {
        const keysToRemove = [
          'user',
          'role',
          'tour_completed',
          'voice',
          'postPreview',
          'chatExpanded',
          'theme',
          'fontSize',
          'pwa-prompt-dismissed',
          'pwa-install-prompted',
          'notification-permission-requested',
        ];

        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
        });

        // Clear all localStorage keys that might contain user data
        Object.keys(localStorage).forEach((key) => {
          if (key.includes('user') || key.includes('session') || key.includes('message')) {
            localStorage.removeItem(key);
          }
        });
      }

      // 3. Clear PWA caches
      await clearAllCaches();

      // 4. Clear cookies
      const authCookie = useCookie('pb_auth');
      authCookie.value = null;

      // Clear any other cookies that might contain user data
      if (import.meta.client) {
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }

      // 5. Clear reactive user state
      user.value = null;
      role.value = null;

      // 6. Disconnect from PocketBase realtime
      $pb.realtime.unsubscribe();

      // 7. Clear service worker registrations and notifications
      if (import.meta.client && 'serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));

        // Clear notification permissions (user will need to re-grant)
        if ('Notification' in window) {
          // Note: Can't programmatically revoke notification permission
          // User would need to manually revoke in browser settings
        }
      }
    }
    catch (error) {
      console.error('Error removing user data:', error);
      throw error;
    }
  };

  const confirmAndRemoveData = async (): Promise<boolean> => {
    // This function will be called from the component that handles the modal
    // The modal logic will be moved to the settings page
    return false; // Placeholder - the actual confirmation will be handled by the modal in settings.vue
  };

  const executeDataRemoval = async (): Promise<boolean> => {
    try {
      await removeAllUserData();

      // Redirect to home page and reload
      await navigateTo('/');
      if (import.meta.client) {
        window.location.reload();
      }

      return true;
    }
    catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  };

  return {
    removeAllUserData,
    confirmAndRemoveData,
    executeDataRemoval,
  };
};
