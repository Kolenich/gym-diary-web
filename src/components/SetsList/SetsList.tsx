import { useState, type ChangeEvent, type FC } from 'react';

import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import {
  Chip,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { v4 as uuid } from 'uuid';

import { type ISet } from 'api/workouts';
import { useMobile } from 'hooks/use-mobile';
import { isArrayNonEmpty } from 'utils/is-array-non-empty';

import {
  ADD_SET,
  CANCEL,
  DELETE,
  EDIT,
  ESetsActions,
  KILOS_SHORT,
  NEW,
  NO_SETS,
  REPEATS,
  SAVE,
  SETS,
  WEIGHT,
} from './SetsList.constants';
import { type ISetsProps } from './SetsList.types';

const SetsList: FC<ISetsProps> = ({ sets, onSetChange }) => {
  const isMobile = useMobile();

  const [newSets, setNewSets] = useState<ISet[]>([]);
  const [editingSets, setEditingSets] = useState<ISet[]>([]);

  const renderSet = (set: ISet): JSX.Element => {
    const { id: targetSetId, weight: targetSetWeight, repeats: targetSetRepeats } = set;

    const editedSet = editingSets.find(({ id }) => id === targetSetId);

    const isSetBeingEdited = !!editedSet;

    if (isSetBeingEdited) {
      const { id: editedSetId, weight: editedSetWeight, repeats: editedSetRepeats } = editedSet;

      const handleEditingSetInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setEditingSets(oldEditingSets =>
          oldEditingSets.map(oldEditingSet => {
            const { id } = oldEditingSet;

            const isTargetSet = id === editedSetId;

            if (isTargetSet) {
              return { ...oldEditingSet, [name]: +value };
            }

            return oldEditingSet;
          }),
        );
      };

      const saveSet = (): void => {
        const isEditedSetNew = newSets.map(({ id }) => id).includes(editedSetId);

        if (isEditedSetNew) {
          setNewSets(oldNewSets =>
            oldNewSets.map(oldNewSet => {
              const { id } = oldNewSet;

              if (id === editedSet.id) {
                return { ...oldNewSet, ...editedSet };
              }

              return oldNewSet;
            }),
          );
        } else {
          onSetChange(editedSet, ESetsActions.Update);
        }
        setEditingSets(oldEditingSets => oldEditingSets.filter(({ id }) => id !== editedSetId));
      };

      const cancelSetEditing = (): void => {
        setEditingSets(oldEditingSets => oldEditingSets.filter(({ id }) => id !== editedSetId));
      };

      const isSaveButtonAvailable = editedSetWeight && editedSetRepeats;

      return (
        <>
          <TextField
            variant='standard'
            value={editedSetWeight}
            label={WEIGHT}
            type='number'
            sx={{ mr: 2 }}
            name='weight'
            InputProps={{
              endAdornment: <InputAdornment position='end'>{KILOS_SHORT}</InputAdornment>,
            }}
            onChange={handleEditingSetInputChange}
          />
          <TextField
            variant='standard'
            value={editedSetRepeats}
            label={REPEATS}
            type='number'
            name='repeats'
            onChange={handleEditingSetInputChange}
          />
          <Tooltip title={SAVE}>
            <span>
              <IconButton sx={{ mt: 2 }} disabled={!isSaveButtonAvailable} color='success' onClick={saveSet}>
                <Save />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={CANCEL}>
            <IconButton sx={{ mt: 2 }} color='error' onClick={cancelSetEditing}>
              <Cancel />
            </IconButton>
          </Tooltip>
        </>
      );
    }

    const addSetToEdited = (): void => {
      setEditingSets(oldEditingSets => oldEditingSets.concat(set));
    };

    const deleteSet = (): void => {
      const isTargetSetNew = newSets.map(({ id }) => id).includes(targetSetId);

      if (isTargetSetNew) {
        setNewSets(oldNewSets => oldNewSets.filter(({ id }) => id !== targetSetId));
      } else {
        onSetChange(set, ESetsActions.Delete);
      }
    };

    const setText = `${targetSetWeight} ${KILOS_SHORT} - ${targetSetRepeats}${isMobile ? '' : ' повторений'}`;
    const isNewSet = typeof targetSetId === 'string';

    return (
      <ListItemText>
        <Typography variant='body2' color='text.secondary' component='div'>
          {setText}
          {isNewSet && <Chip label={NEW} color='success' size='small' sx={{ ml: 2 }} />}
          <Tooltip title={EDIT}>
            <IconButton color='info' sx={{ py: 0.5, ml: 1 }} onClick={addSetToEdited}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={DELETE}>
            <IconButton color='error' sx={{ py: 0.5 }} onClick={deleteSet}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Typography>
      </ListItemText>
    );
  };

  const addSet = (): void => {
    setNewSets(oldSets =>
      oldSets.concat({
        id: uuid(),
        weight: 0,
        repeats: 0,
      }),
    );

    if (isMobile) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  const hasSets = isArrayNonEmpty(sets);

  return (
    <List component='div' disablePadding>
      <ListItem>
        <ListItemText sx={{ pl: isMobile ? 0 : 4 }}>
          <Typography variant='body1' color='text.secondary' sx={{ display: 'flex', alignItems: 'center' }}>
            {SETS}
            <Tooltip title={ADD_SET}>
              <IconButton color='primary' onClick={addSet}>
                <Add />
              </IconButton>
            </Tooltip>
          </Typography>
        </ListItemText>
      </ListItem>
      {hasSets ? (
        sets.map(set => (
          <ListItem key={set.id} sx={{ pl: isMobile ? 2 : 8 }}>
            {renderSet(set)}
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText sx={{ pl: isMobile ? 0 : 8 }}>
            <Typography variant='body2' color='text.secondary'>
              {NO_SETS}
            </Typography>
          </ListItemText>
        </ListItem>
      )}
      {newSets.map(newSet => {
        const handleNewSetInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
          const { name, value } = event.target;

          setNewSets(oldNewSets =>
            oldNewSets.map(oldNewSet => {
              const { id } = oldNewSet;
              const isTargetSet = id === newSet.id;

              if (isTargetSet) {
                return { ...oldNewSet, [name]: +value };
              }

              return oldNewSet;
            }),
          );
        };

        const saveSet = (): void => {
          onSetChange(newSet, ESetsActions.Add);
          setNewSets(oldNewSets => oldNewSets.filter(({ id }) => id !== newSet.id));
        };

        const deleteNewSet = (): void => {
          setNewSets(oldNewSets => oldNewSets.filter(({ id }) => id !== newSet.id));
        };

        const { weight, repeats, id } = newSet;

        const isSaveAvailable = weight && repeats;

        return (
          <ListItem key={id} sx={{ pl: isMobile ? 2 : 8 }}>
            <TextField
              variant='standard'
              value={weight}
              label={WEIGHT}
              type='number'
              sx={{ mr: 2 }}
              name='weight'
              InputProps={{
                endAdornment: <InputAdornment position='end'>{KILOS_SHORT}</InputAdornment>,
              }}
              onChange={handleNewSetInputChange}
            />
            <TextField
              variant='standard'
              value={repeats}
              label={REPEATS}
              type='number'
              name='repeats'
              onChange={handleNewSetInputChange}
            />
            <Tooltip title={SAVE}>
              <span>
                <IconButton sx={{ mt: 2 }} disabled={!isSaveAvailable} color='success' onClick={saveSet}>
                  <Save />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={CANCEL}>
              <IconButton sx={{ mt: 2 }} color='error' onClick={deleteNewSet}>
                <Cancel />
              </IconButton>
            </Tooltip>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SetsList;
