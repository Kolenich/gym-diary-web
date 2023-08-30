import { Navigate, createBrowserRouter } from 'react-router-dom';

import { WeeksSchedule } from 'pages/WeeksSchedule';
import { WorkoutDetail } from 'pages/WorkoutDetail';

import { ERoutePaths } from './RootRouter.constants';

const RootRouter = createBrowserRouter([
  {
    path: ERoutePaths.Home,
    children: [
      {
        index: true,
        element: <Navigate to={ERoutePaths.Workouts} />,
      },
      {
        path: ERoutePaths.Workouts,
        children: [
          {
            index: true,
            element: <WeeksSchedule />,
          },
          {
            path: ERoutePaths.WorkoutDetail,
            element: <WorkoutDetail />,
          },
        ],
      },
    ],
  },
]);

export default RootRouter;
