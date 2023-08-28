import type { ChangeEvent, FC, Key, KeyboardEvent } from 'react';
import { Fragment, useState } from 'react';

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

import { v4 as uuid } from 'uuid';

import type { IExercise, ISet } from 'api/workouts';
import { ExerciseName } from 'components/ExerciseList/components/ExerciseName';
import { ESetsActions, SetsList } from 'components/SetsList';
import { isArrayNonEmpty } from 'utils/is-array-non-empty';

import {
  ADD_EXERCISE,
  CANCEL,
  DELETE,
  EDIT,
  EExercisesAction,
  EXERCISES,
  NAME,
  NEW,
  NO_EXERCISES,
  SAVE,
} from './ExerciseList.constants';
import type { IExerciseListProps } from './ExerciseList.types';

const ExerciseList: FC<IExerciseListProps> = ({ exercises, onExerciseChange }) => {
  const [expandedExercises, setExpandedExercises] = useState<Key[]>([]);
  const [editingExercises, setEditingExercises] = useState<IExercise[]>([]);
  const [newExercises, setNewExercises] = useState<IExercise[]>([]);

  /**
   * Common function for saving edited exercise
   * @param {IExercise} exerciseObj - edited exercise
   */
  const saveEditedExercise = (exerciseObj: IExercise): void => {
    const { id: exerciseObjId } = exerciseObj;

    const isNewExercise = newExercises.map(({ id }) => id).includes(exerciseObjId);

    if (isNewExercise) {
      setNewExercises((oldExercises) =>
        oldExercises.map((oldExercise) => {
          const { id } = oldExercise;

          const isTargetExercise = id === exerciseObjId;

          if (isTargetExercise) {
            return { ...oldExercise, ...exerciseObj };
          }

          return oldExercise;
        }),
      );
    } else {
      onExerciseChange(exerciseObj, EExercisesAction.Update);
    }
    setEditingExercises((oldExercises) => oldExercises.filter(({ id }) => id !== exerciseObjId));
  };

  /**
   * Common function for adding new exercise
   * @param {IExercise} exerciseObj - new exercise
   */
  const saveNewExercise = (exerciseObj: IExercise): void => {
    onExerciseChange(exerciseObj, EExercisesAction.Add);
    setNewExercises([]);
  };

  /**
   * Function for rendering current state of exercise, either it is being simply displayed or edited
   * @param {IExercise} exercise - exercise object being displayed or edited
   * @return {JSX.Element}
   */
  const renderExercise = (exercise: IExercise): JSX.Element => {
    const { id: targetExerciseId, name: targetExerciseName } = exercise;
    const editedExercise = editingExercises.find(({ id }) => id === targetExerciseId);

    const isExerciseBeingEdited = !!editedExercise;

    if (isExerciseBeingEdited) {
      const { id: editedExerciseId, name: editedExerciseName } = editedExercise;

      const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
          saveEditedExercise(editedExercise);
        }
      };

      const handleExerciseInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value, name } = event.target;

        setEditingExercises((oldEditingExercises) =>
          oldEditingExercises.map((oldEditingExercise) => {
            const { id } = oldEditingExercise;
            const isTargetExercise = id === editedExerciseId;

            if (isTargetExercise) {
              return { ...oldEditingExercise, [name]: value };
            }

            return oldEditingExercise;
          }),
        );
      };

      const handleSaveClick = (): void => {
        saveEditedExercise(editedExercise);
      };

      const cancelExerciseEdit = (): void => {
        setEditingExercises((oldExercises) => oldExercises.filter(({ id }) => id !== editedExerciseId));
      };

      const isSaveAvailable = !!editedExerciseName;

      return (
        <ListItem>
          <TextField
            label={NAME}
            value={targetExerciseName}
            variant='standard'
            size='small'
            name='name'
            onKeyPress={handleEnterPress}
            onChange={handleExerciseInputChange}
          />
          <Tooltip title={SAVE}>
            <span>
              <IconButton color='success' sx={{ mt: 2 }} disabled={!isSaveAvailable} onClick={handleSaveClick}>
                <Save />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={CANCEL}>
            <IconButton color='error' sx={{ mt: 2 }} onClick={cancelExerciseEdit}>
              <Cancel />
            </IconButton>
          </Tooltip>
        </ListItem>
      );
    }

    const toggleExerciseExpand = (): void => {
      setExpandedExercises((oldExpanded) => {
        const isExpanded = oldExpanded.includes(targetExerciseId);

        if (isExpanded) {
          return oldExpanded.filter((x) => x !== targetExerciseId);
        }

        return oldExpanded.concat(targetExerciseId);
      });
    };

    const editExercise = (): void => {
      setEditingExercises((oldExercises) => oldExercises.concat(exercise));
      setExpandedExercises((oldExercises) => oldExercises.filter((exerciseId) => exerciseId !== targetExerciseId));
    };

    const deleteExercise = (): void => {
      onExerciseChange(exercise, EExercisesAction.Delete);
      setExpandedExercises((oldExercises) => oldExercises.filter((exerciseId) => exerciseId !== targetExerciseId));
    };

    const isNewExercise = typeof targetExerciseId === 'string';

    return (
      <Typography component='div' sx={{ display: 'flex' }}>
        <ListItemButton onClick={toggleExerciseExpand}>
          <ListItemText>
            <Typography variant='body2' component='div'>
              <ExerciseName name={targetExerciseName} />
              {isNewExercise && <Chip label={NEW} color='success' size='small' sx={{ ml: 2 }} />}
            </Typography>
          </ListItemText>
        </ListItemButton>
        <Tooltip title={EDIT}>
          <IconButton color='info' onClick={editExercise}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title={DELETE}>
          <IconButton color='error' onClick={deleteExercise}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Typography>
    );
  };

  const addNewExercise = (): void => {
    setNewExercises((oldExercises) =>
      oldExercises.concat({
        id: uuid(),
        name: '',
        sets: [],
      }),
    );
  };

  const hasExercises = isArrayNonEmpty(exercises);

  return (
    <>
      <Typography variant='h6' color='text.secondary' sx={{ display: 'flex', alignItems: 'center' }}>
        <DirectionsRun sx={{ mr: 0.5 }} />
        {EXERCISES}
        <Tooltip title={ADD_EXERCISE}>
          <IconButton color='primary' onClick={addNewExercise}>
            <Add />
          </IconButton>
        </Tooltip>
      </Typography>
      <List>
        {hasExercises ? (
          exercises.map((exercise) => {
            const { id, sets } = exercise;

            const isExerciseExpanded = expandedExercises.includes(id);

            const handleSetChange = (set: ISet, action: ESetsActions): void => {
              const { id: targetSetId } = set;
              // Defining function, that will manage sets depending on action provided
              let updateSets = (sets: ISet[]): ISet[] => sets;

              switch (action) {
                case ESetsActions.Add:
                  updateSets = (sets: ISet[]): ISet[] => sets.concat(set);
                  break;
                case ESetsActions.Update:
                  updateSets = (sets: ISet[]): ISet[] =>
                    sets.map((prevSet) => {
                      const { id } = prevSet;

                      const isTargetSet = id === targetSetId;

                      if (isTargetSet) {
                        return { ...prevSet, ...set };
                      }

                      return prevSet;
                    });
                  break;
                case ESetsActions.Delete:
                  updateSets = (sets: ISet[]): ISet[] => sets.filter(({ id }) => id !== targetSetId);
                  break;
                default:
                  break;
              }

              onExerciseChange(
                {
                  ...exercise,
                  sets: updateSets(exercise.sets),
                },
                EExercisesAction.Update,
              );
            };

            return (
              <Fragment key={id}>
                {renderExercise(exercise)}
                <Collapse in={isExerciseExpanded} timeout='auto' unmountOnExit>
                  <SetsList sets={sets} onSetChange={handleSetChange} />
                </Collapse>
              </Fragment>
            );
          })
        ) : (
          <ListItem>
            <Typography variant='body2' color='text.secondary'>
              {NO_EXERCISES}
            </Typography>
          </ListItem>
        )}
        {newExercises.map((newExercise) => {
          const { id: newExerciseId, name } = newExercise;

          const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>): void => {
            if (event.key === 'Enter') {
              saveNewExercise(newExercise);
            }
          };

          const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
            const { value } = event.target;

            setNewExercises((oldExercises) =>
              oldExercises.map((oldExercise) => {
                const { id } = oldExercise;

                const isTargetExercise = id === newExerciseId;

                if (isTargetExercise) {
                  return { ...oldExercise, name: value };
                }

                return oldExercise;
              }),
            );
          };

          const save = (): void => {
            saveNewExercise(newExercise);
          };

          const cancelExerciseCreation = (): void => {
            setNewExercises((oldExercises) => oldExercises.filter(({ id }) => id !== newExerciseId));
          };

          const isSaveAvailable = !!name;

          return (
            <ListItem key={newExerciseId}>
              <TextField
                label={NAME}
                value={name}
                variant='standard'
                size='small'
                onKeyPress={handleEnterPress}
                onChange={handleNameChange}
              />
              <Tooltip title={SAVE}>
                <span>
                  <IconButton onClick={save} sx={{ mt: 2 }} disabled={!isSaveAvailable} color='success'>
                    <Save />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={CANCEL}>
                <IconButton onClick={cancelExerciseCreation} sx={{ mt: 2 }} color='error'>
                  <Cancel />
                </IconButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default ExerciseList;
