import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { Props } from './types';

const ExerciseAccordion = ({ exercise }: Props) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMore/>}
    >
      <Typography variant="body2" color="text.primary">
        {exercise.name}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.primary" component="div">
        <List sx={{ bgcolor: 'background.paper' }}>
          {exercise.sets.map((set, index) => (
            <ListItem key={set.id}>
              <ListItemText>
                <Typography variant="body2" color="text.secondary">
                  {`${index + 1}. ${set.weight}кг - ${set.repeats} повторений`}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Typography>
    </AccordionDetails>
  </Accordion>
);

export default ExerciseAccordion;
