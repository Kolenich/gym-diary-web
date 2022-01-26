import { Add, Cancel, Delete, DirectionsRun, Edit, Save } from '@mui/icons-material';
import {
  Chip,
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
import { SetsList } from 'components';
import { Context } from 'context';
import { Exercise, Set } from 'context/types';
import React, { Fragment, ReactText, useCallback, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Props } from './types';

const ExerciseList = ({ exercises, onExerciseChange }: Props) => {
  const { isMobile } = useContext(Context);

  const [expandedExercises, setExpandedExercises] = useState<ReactText[]>([]);
  const [editingExercises, setEditingExercises] = useState<Exercise[]>([]);
  const [newExercises, setNewExercises] = useState<Exercise[]>([]);

  /**
   * Callback for updating set in exercise
   * @type {(exercise: Exercise) => (set: Set, action: ("add" | "delete" | "update")) => void}
   */
  const handleSetChange = useCallback((exercise: Exercise) => (set: Set, action: 'add' | 'delete' | 'update') => {
    // Defining function, that will manage sets depending on action provided
    let updateSets = (sets: Set[]) => sets;

    switch (action) {
      case 'add':
        updateSets = (sets: Set[]) => sets.concat(set);
        break;
      case 'update':
        updateSets = (sets: Set[]) => sets.map((x) => {
          if (x.id === set.id) {
            return { ...x, ...set };
          }
          return x;
        });
        break;
      case 'delete':
        updateSets = (sets: Set[]) => sets.filter((x) => x.id !== set.id);
        break;
      default:
        break;
    }

    onExerciseChange({ ...exercise, sets: updateSets(exercise.sets) }, 'update');
  }, [onExerciseChange]);

  /**
   * Common function for saving edited exercise
   * @param {Exercise} exerciseObj - edited exercise
   */
  const saveEditedExercise = (exerciseObj: Exercise) => {
    if (newExercises.map(({ id }) => id).includes(exerciseObj.id)) {
      setNewExercises((oldExercises) => oldExercises.map((x) => {
        if (x.id === exerciseObj.id) {
          return { ...x, ...exerciseObj };
        }
        return x;
      }));
    } else {
      onExerciseChange(exerciseObj, 'update');
    }
    setEditingExercises((oldExercises) => oldExercises.filter((x) => (
      x.id !== exerciseObj.id
    )));
  };

  /**
   * Common function for adding new exercise
   * @param {Exercise} exerciseObj - new exercise
   */
  const saveNewExercise = (exerciseObj: Exercise) => {
    onExerciseChange(exerciseObj, 'add');
    setNewExercises([]);
  };

  const renderExerciseName = (exercise: Exercise) => (
    isMobile && exercise.name.length > 8 ? (
      <Tooltip title={exercise.name}>
        <span>{exercise.name.substr(0, 8)}...</span>
      </Tooltip>
    ) : exercise.name
  );

  /**
   * Function for rendering current state of exercise, either it is being simply displayed or edited
   * @param {Exercise} exercise - exercise object being displayed or edited
   * @return {JSX.Element}
   */
  const renderExercise = (exercise: Exercise) => {
    const editedExercise = editingExercises.find((x) => x.id === exercise.id);

    if (editedExercise) {
      return (
        <ListItem>
          <TextField
            label="Название"
            value={editedExercise.name}
            variant="standard"
            size="small"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                saveEditedExercise(editedExercise);
              }
            }}
            onChange={(event) => setEditingExercises((oldExercises) => oldExercises.map((x) => {
              if (x.id === editedExercise.id) {
                return { ...x, name: event.target.value };
              }
              return x;
            }))}
          />
          <Tooltip title="Сохранить">
            <span>
              <IconButton
                color="success"
                sx={{ mt: 2 }}
                disabled={!editedExercise.name}
                onClick={() => saveEditedExercise(editedExercise)}
              >
                <Save/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Отменить">
            <IconButton
              color="error"
              sx={{ mt: 2 }}
              onClick={() => setEditingExercises((oldExercises) => (
                oldExercises.filter((x) => (
                  x.id !== editedExercise.id
                ))
              ))}
            >
              <Cancel/>
            </IconButton>
          </Tooltip>
        </ListItem>
      );
    }

    return (
      <Typography component="div" sx={{ display: 'flex' }}>
        <ListItemButton
          onClick={() => setExpandedExercises((oldExpanded) => {
            if (oldExpanded.includes(exercise.id)) {
              return oldExpanded.filter((x) => x !== exercise.id);
            }
            return oldExpanded.concat(exercise.id);
          })}
        >
          <ListItemText>
            <Typography variant="body2" component="div">
              {renderExerciseName(exercise)}
              {typeof exercise.id === 'string' && (
                <Chip label="Новое" color="success" size="small" sx={{ ml: 2 }}/>
              )}
            </Typography>
          </ListItemText>
        </ListItemButton>
        <Tooltip title="Редактировать">
          <IconButton
            color="info"
            onClick={() => {
              setEditingExercises((oldExercises) => oldExercises.concat(exercise));
              setExpandedExercises((oldExercises) => oldExercises.filter((x) => (
                x !== exercise.id
              )));
            }}
          >
            <Edit/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton
            color="error"
            onClick={() => {
              onExerciseChange(exercise, 'delete');
              setExpandedExercises((oldExercises) => oldExercises.filter((x) => (
                x !== exercise.id
              )));
            }}
          >
            <Delete/>
          </IconButton>
        </Tooltip>
      </Typography>
    );
  };

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
              id: uuid(),
              name: '',
              sets: [],
            }))}
          >
            <Add/>
          </IconButton>
        </Tooltip>
      </Typography>
      <List>
        {exercises.length ? exercises.map((exercise) => (
          <Fragment key={exercise.id}>
            {renderExercise(exercise)}
            <Collapse in={expandedExercises.includes(exercise.id)} timeout="auto" unmountOnExit>
              <SetsList
                sets={exercise.sets}
                onSetChange={handleSetChange(exercise)}
              />
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
              size="small"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  saveNewExercise(newExercise);
                }
              }}
              onChange={(event) => setNewExercises((oldExercises) => oldExercises.map((x) => {
                if (x.id === newExercise.id) {
                  return { ...x, name: event.target.value };
                }
                return x;
              }))}
            />
            <Tooltip title="Сохранить">
              <span>
                <IconButton
                  onClick={() => saveNewExercise(newExercise)}
                  sx={{ mt: 2 }}
                  disabled={!newExercise.name}
                  color="success"
                >
                  <Save/>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Отменить">
              <IconButton
                onClick={() => setNewExercises((oldExercises) => oldExercises.filter((x) => (
                  x.id !== newExercise.id
                )))}
                sx={{ mt: 2 }}
                color="error"
              >
                <Cancel/>
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ExerciseList;
