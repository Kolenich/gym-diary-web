import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ERoutePaths } from 'constants/routes';
import { WorkoutCreate } from 'pages/WorkoutCreate';
import { WorkoutDetail } from 'pages/WorkoutDetail';
import { WorkoutSchedule } from 'pages/WorkoutSchedule';

const RootRouter = createBrowserRouter([
  {
    path: ERoutePaths.Home,
    children: [
      {
        index: true,
        element: <Navigate to={ERoutePaths.WorkoutsSchedule} />,
      },
      {
        path: ERoutePaths.WorkoutsSchedule,
        children: [
          {
            index: true,
            element: <WorkoutSchedule />,
          },
          {
            path: ERoutePaths.WorkoutDetail,
            element: <WorkoutDetail />,
          },
          {
            path: ERoutePaths.WorkoutCreate,
            element: <WorkoutCreate />,
          },
        ],
      },
    ],
  },
]);

export default RootRouter;
