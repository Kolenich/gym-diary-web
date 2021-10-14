import { Cancel, Save } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import MainPage from '../MainPage';

const AddWorkout = ({ history }: RouteComponentProps) => (
  <>
    {/* Keep Main page as background */}
    <MainPage/>
    <Dialog open onClose={() => history.push({ pathname: '/workouts' })}>
      <DialogTitle>Дарова</DialogTitle>
      <DialogContent>Хеллоу</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={() => history.push({ pathname: '/workouts' })}
          startIcon={<Save/>}
        >
          Сохранить
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={history.goBack}
          startIcon={<Cancel/>}
        >
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

export default AddWorkout;
