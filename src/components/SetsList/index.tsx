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
import { Set } from 'context/types';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Props } from './types';

const SetsList = ({ sets, onSetChange }: Props) => {
  const [newSets, setNewSets] = useState<Set[]>([]);
  const [editingSets, setEditingSets] = useState<Set[]>([]);

  /**
   * Function for rendering current state of set, either it is being simply displayed or edited
   * @param {Set} set - set object
   * @return {JSX.Element}
   */
  const renderSet = (set: Set) => {
    const editedSet = editingSets.find((x) => x.id === set.id);

    if (editedSet) {
      return (
        <>
          <TextField
            variant="standard"
            value={editedSet.weight}
            label="Вес"
            type="number"
            sx={{ mr: 2 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">кг.</InputAdornment>,
            }}
            onChange={(event) => setEditingSets((oldSets) => oldSets.map((x) => {
              if (x.id === editedSet.id) {
                return { ...x, weight: +event.target.value };
              }
              return x;
            }))}
          />
          <TextField
            variant="standard"
            value={editedSet.repeats}
            label="Повторения"
            type="number"
            onChange={(event) => setEditingSets((oldSets) => oldSets.map((x) => {
              if (x.id === editedSet.id) {
                return { ...x, repeats: +event.target.value };
              }
              return x;
            }))}
          />
          <Tooltip title="Сохранить">
            <span>
              <IconButton
                sx={{ mt: 2 }}
                disabled={!(editedSet.weight && editedSet.repeats)}
                color="success"
                onClick={() => {
                  if (newSets.map(({ id }) => id).includes(editedSet.id)) {
                    setNewSets((oldSets) => oldSets.map((x) => {
                      if (x.id === editedSet.id) {
                        return { ...x, ...editedSet };
                      }
                      return x;
                    }));
                  } else {
                    onSetChange(editedSet, 'update');
                  }
                  setEditingSets((oldSets) => oldSets.filter((x) => x.id !== editedSet.id));
                }}
              >
                <Save/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Отменить">
            <IconButton
              sx={{ mt: 2 }}
              color="error"
              onClick={() => setEditingSets((oldSets) => oldSets.filter((x) => (
                x.id !== editedSet.id
              )))}
            >
              <Cancel/>
            </IconButton>
          </Tooltip>
        </>
      );
    }

    return (
      <>
        <ListItemText>
          <Typography
            variant="body2"
            color="text.secondary"
            component="div"
          >
            {set.weight} кг. - {set.repeats} повторений
            {typeof set.id === 'string' && (
              <Chip label="Новый подход" color="success" size="small" sx={{ ml: 2 }}/>
            )}
            <Tooltip title="Редактировать">
              <IconButton
                color="info"
                sx={{ py: 0.5, ml: 1 }}
                onClick={() => setEditingSets((oldSets) => oldSets.concat(set))}
              >
                <Edit/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton
                color="error"
                sx={{ py: 0.5 }}
                onClick={() => {
                  if (newSets.map(({ id }) => id).includes(set.id)) {
                    setNewSets((oldSets) => oldSets.filter((x) => (
                      x.id !== set.id
                    )));
                  } else {
                    onSetChange(set, 'delete');
                  }
                }}
              >
                <Delete/>
              </IconButton>
            </Tooltip>
          </Typography>
        </ListItemText>
      </>
    );
  };

  return (
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
              <IconButton
                color="primary"
                onClick={() => setNewSets((oldSets) => oldSets.concat({
                  id: uuid(),
                  weight: 0,
                  repeats: 0,
                }))}
              >
                <Add/>
              </IconButton>
            </Tooltip>
          </Typography>
        </ListItemText>
      </ListItem>
      {sets.length ? sets.map((set) => (
        <ListItem key={set.id} sx={{ pl: 8 }}>
          {renderSet(set)}
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
      {newSets.map((newSet) => (
        <ListItem key={newSet.id} sx={{ pl: 8 }}>
          <TextField
            variant="standard"
            value={newSet.weight}
            label="Вес"
            type="number"
            sx={{ mr: 2 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">кг.</InputAdornment>,
            }}
            onChange={(event) => setNewSets((oldSets) => oldSets.map((x) => {
              if (x.id === newSet.id) {
                return { ...x, weight: +event.target.value };
              }
              return x;
            }))}
          />
          <TextField
            variant="standard"
            value={newSet.repeats}
            label="Повторения"
            type="number"
            onChange={(event) => setNewSets((oldSets) => oldSets.map((x) => {
              if (x.id === newSet.id) {
                return { ...x, repeats: +event.target.value };
              }
              return x;
            }))}
          />
          <Tooltip title="Сохранить">
            <span>
              <IconButton
                sx={{ mt: 2 }}
                disabled={!(newSet.weight && newSet.repeats)}
                color="success"
                onClick={() => {
                  onSetChange(newSet, 'add');
                  setNewSets((oldSets) => oldSets.filter((x) => x.id !== newSet.id));
                }}
              >
                <Save/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Отменить">
            <IconButton
              sx={{ mt: 2 }}
              color="error"
              onClick={() => setNewSets((oldSets) => oldSets.filter((x) => (
                x.id !== newSet.id
              )))}
            >
              <Cancel/>
            </IconButton>
          </Tooltip>
        </ListItem>
      ))}
    </List>
  );
};

export default SetsList;
