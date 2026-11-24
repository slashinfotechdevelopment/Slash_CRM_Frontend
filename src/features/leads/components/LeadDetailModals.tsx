import React from 'react';
import { LeadEditQualifyModals, LeadEditQualifyModalsProps } from './LeadEditQualifyModals';
import { LeadLifecycleModals, LeadLifecycleModalsProps } from './LeadLifecycleModals';
import { LeadActivityModals, LeadActivityModalsProps } from './LeadActivityModals';

export type LeadDetailModalsProps = LeadEditQualifyModalsProps &
  LeadLifecycleModalsProps &
  LeadActivityModalsProps;

export const LeadDetailModals: React.FC<LeadDetailModalsProps> = (props) => {
  return (
    <>
      <LeadEditQualifyModals {...props} />
      <LeadLifecycleModals {...props} />
      <LeadActivityModals {...props} />
    </>
  );
};
