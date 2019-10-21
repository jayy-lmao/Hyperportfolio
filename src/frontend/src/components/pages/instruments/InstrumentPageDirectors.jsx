import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

/**
 * Displays a list of major company directors and their details for a given instrument
 * @param {Object} props
 * @return {ReactElement} markup
 */
const InstrumentPageDirectors = (props) => {
  const { activeIndex, handleClick, assetProfile } = props;
  return (
    <Accordion>
      <Accordion.Title active={activeIndex === 0} index={0} onClick={handleClick}>
        <Icon name="dropdown" />
        Company Directors
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        {assetProfile.companyOfficers
          && assetProfile.companyOfficers.map(officer => (
            <div key={officer.name}>
              <b>{officer.name}</b>
              <br />
              {officer.title && (
                <p>
                  {' '}
                  <i>{officer.title}</i>
                  <br />
                </p>
              )}
              Age
              {' '}
              {officer.age}
              <br />
              Pay:
              {' '}
              {officer.totalPay && officer.totalPay.fmt}
            </div>
          ))}
      </Accordion.Content>
    </Accordion>
  );
};

export default InstrumentPageDirectors;
