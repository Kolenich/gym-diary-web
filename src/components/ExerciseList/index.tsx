import { DirectionsRun, StarBorder } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Props } from './types';

const ExerciseList = ({ exercises }: Props) => {
  const [expandedExercises, setExpandedExercises] = useState<number[]>([]);

  return (
    <>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <DirectionsRun sx={{ mr: 0.5 }}/>
        Упражнения
      </Typography>
      {exercises.length ? (
        <List>
          {exercises.map((exercise) => (
            <Fragment key={exercise.id}>
              <ListItemButton
                onClick={() => setExpandedExercises((oldExpanded) => {
                  if (oldExpanded.includes(exercise.id!)) {
                    return oldExpanded.filter((x) => x !== exercise.id!);
                  }
                  return oldExpanded.concat(exercise.id!);
                })}
              >
                <ListItemText>
                  <Typography variant="body2">
                    {exercise.name}
                  </Typography>
                </ListItemText>
              </ListItemButton>
              <Collapse in={expandedExercises.includes(exercise.id!)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Starred"/>
                  </ListItemButton>
                </List>
              </Collapse>
            </Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Упражнения не указаны
        </Typography>
      )}
    </>
  );
};

export default ExerciseList;
