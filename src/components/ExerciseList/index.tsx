import { DirectionsRun } from '@mui/icons-material';
import { Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Props } from './types';

const ExerciseList = ({ exercises }: Props) => {
  const [expandedExercises, setExpandedExercises] = useState<number[]>([]);
  console.log(expandedExercises);

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
          {exercises.map((exercise, exerciseIndex) => (
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
                    {exerciseIndex + 1}. {exercise.name}
                  </Typography>
                </ListItemText>
              </ListItemButton>
              <Collapse in={expandedExercises.includes(exercise.id!)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {exercise.sets.length ? exercise.sets.map((set, setIndex) => (
                    <ListItem key={set.id} sx={{ pl: 4 }}>
                      <ListItemText>
                        <Typography variant="body2" color="text.secondary">
                          {setIndex + 1}. {set.weight}кг - {set.repeats} повторений
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  )) : (
                    <ListItem>
                      <ListItemText sx={{ pl: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Подходы не указаны
                        </Typography>
                      </ListItemText>
                    </ListItem>
                  )}
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
