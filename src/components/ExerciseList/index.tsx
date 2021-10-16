import { Add, Delete, DirectionsRun, Save } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Exercise } from 'context/types';
import React, { Fragment, useState } from 'react';
import { Props } from './types';

const ExerciseList = ({ exercises, onExerciseChange }: Props) => {
  const [expandedExercises, setExpandedExercises] = useState<number[]>([]);

  const [newExercises, setNewExercises] = useState<Exercise[]>([]);

  return (
    <>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <DirectionsRun sx={{ mr: 0.5 }}/>
        Упражнения
        <Tooltip title="Добавить упражнение">
          <IconButton
            color="primary"
            onClick={() => setNewExercises((oldExercises) => oldExercises.concat({
              name: '',
              sets: [],
            }))}
          >
            <Add/>
          </IconButton>
        </Tooltip>
      </Typography>
      <List>
        {exercises.length ? exercises.map((exercise, exerciseIndex) => (
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
                <ListItem>
                  <ListItemText sx={{ pl: 4 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      Подходы
                      <Tooltip title="Добавить подход">
                        <IconButton color="primary">
                          <Add/>
                        </IconButton>
                      </Tooltip>
                    </Typography>
                  </ListItemText>
                </ListItem>
                {exercise.sets.length ? exercise.sets.map((set, setIndex) => (
                  <ListItem key={set.id} sx={{ pl: 8 }}>
                    <ListItemText>
                      <Typography variant="body2" color="text.secondary">
                        {setIndex + 1}. {set.weight}кг - {set.repeats} повторений
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText sx={{ pl: 8 }}>
                      <Typography variant="body2" color="text.secondary">
                        Подходы не указаны
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </Collapse>
          </Fragment>
        )) : (
          <ListItem>
            <Typography variant="body2" color="text.secondary">
              Упражнения не указаны
            </Typography>
          </ListItem>
        )}
        {newExercises.map((newExercise) => (
          <ListItem key={newExercise.id}>
            <TextField
              label="Название"
              value={newExercise.name}
              variant="standard"
              onChange={(event) => setNewExercises((oldExercises) => oldExercises.map((x) => {
                if (x.id === newExercise.id) {
                  return { ...x, name: event.target.value };
                }
                return x;
              }))}
            />
            <IconButton
              onClick={() => {
                onExerciseChange(newExercise, 'add');
                setNewExercises([]);
              }}
              sx={{ mt: 2 }}
              color="success"
            >
              <Save/>
            </IconButton>
            <IconButton
              onClick={() => setNewExercises((oldExercises) => oldExercises.filter((x) => (
                x.id !== newExercise.id
              )))}
              sx={{ mt: 2 }}
              color="error"
            >
              <Delete/>
            </IconButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExerciseList;
