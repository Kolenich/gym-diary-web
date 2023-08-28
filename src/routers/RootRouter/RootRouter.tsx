import type { FC } from 'react';

import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { WeeksSchedule } from 'pages/WeeksSchedule';
import { WorkoutDetail } from 'pages/WorkoutDetail';

import { ERoutePaths } from './RootRouter.constants';

const RootRouter: FC = () => (
  <Routes>
    <Route
      path={`${ERoutePaths.Workouts}/${ERoutePaths.WorkoutDetail}`}
      element={<WorkoutDetail />}
    />
    <Route path={ERoutePaths.Workouts} element={<WeeksSchedule />}>
    </Route>
    <Route
      path={ERoutePaths.Home}
      element={<Navigate to={ERoutePaths.Workouts} />}
    />
  </Routes>
);

export default RootRouter;
