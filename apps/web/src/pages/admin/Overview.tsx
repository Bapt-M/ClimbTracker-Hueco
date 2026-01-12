export const Overview = () => {
  return (
    <div className="overview">
      <h2 className="text-xl font-bold text-mono-900 dark:text-white mb-4">
        Dashboard Overview
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Welcome to the Admin Dashboard
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Use the tabs above to manage users, routes, and gym layout settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-mono-200 dark:border-mono-800 rounded-xl">
            <h4 className="font-semibold text-mono-900 dark:text-white mb-2">
              Quick Actions
            </h4>
            <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
              <li>• Manage user roles and permissions</li>
              <li>• Delete inactive users</li>
              <li>• Edit the gym floor plan</li>
              <li>• Monitor database statistics</li>
            </ul>
          </div>

          <div className="p-4 border-2 border-mono-200 dark:border-mono-800 rounded-xl">
            <h4 className="font-semibold text-mono-900 dark:text-white mb-2">
              Recent Updates
            </h4>
            <p className="text-sm text-mono-700 dark:text-mono-300">
              Check the statistics above to see the latest activity on your
              platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
