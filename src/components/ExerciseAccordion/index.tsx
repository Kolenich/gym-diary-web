import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
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
      <Typography variant="body2" color="text.secondary">
        {exercise.sets.map((set) => `${set.weight}кг. - ${set.repeats}`)}
      </Typography>
    </AccordionDetails>
  </Accordion>
);

export default ExerciseAccordion;
