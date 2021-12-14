import './DriftCard.scss';

import * as AppActions from '../../AppActions';
import * as ActionTypes from '../../AppConstants';
import { getDate } from './utils';

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ExpandableCardTemplate } from '../../PresentationalComponents/Template/ExpandableCardTemplate';
import { TemplateCardBody, TemplateCardHeader } from '../../PresentationalComponents/Template/TemplateCard';
import { Flex, FlexItem } from '@patternfly/react-core/dist/esm/layouts';
import { DriftDropDown } from './DriftDropDown';
import messages from '../../Messages';
import SortUpIcon from '@patternfly/react-icons/dist/esm/icons/sort-up-icon';
import {
    TextContent,
    Divider,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListCell,
    DataListItemCells,
    DataListWrapModifier,
    Button,
    TextVariants,
    Text,
    Bullseye,
    Spinner
} from '@patternfly/react-core';
import { DriftEmptyState } from './DriftEmptyState';
import { useDispatch } from 'react-redux';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/RouterParams';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

const DriftCard = () => {

    const intl = useIntl();
    const dispatch = useDispatch();
    const [activeDrift, setActiveDrift] = useState({
        id: 'days-7',
        description: intl.formatMessage(messages.driftDropDown7days),
        startDate: getDate(7),
        endDate: getDate(0)
    });
    const driftEvents = useSelector(({ DashboardStore }) => DashboardStore.driftEvents);
    const driftEventFetchStatus = useSelector(({ DashboardStore }) => DashboardStore.driftEventFetchStatus);

    const fetchDriftData = useCallback((dropDownItem) => {
        dispatch(AppActions.fetchDrift({
            appIds: ActionTypes.DRIFT_EVENTS_APP_ID,
            startDate: dropDownItem.startDate,
            endDate: dropDownItem.endDate,
            includePayload: true
        }));
        setActiveDrift(dropDownItem);
    }, [dispatch]);

    useEffect(() => {
        fetchDriftData(activeDrift);
    }, [fetchDriftData, activeDrift.id]);

    return (
        <ExpandableCardTemplate
            className='insd-m-toggle-right-on-md '
            appName='Drift'
            title={intl.formatMessage(messages.driftCardAppName)}
            body={
                <React.Fragment>
                    {driftEventFetchStatus === 'pending' ?
                        (
                            <React.Fragment>
                                <Flex>
                                    <FlexItem>
                                        <TemplateCardHeader
                                            title={intl.formatMessage(messages.driftCardTitle)}
                                        />
                                    </FlexItem>
                                    <FlexItem
                                        className='ins-c-drift__drop_down'
                                        align={{ default: 'alignRight' }}>
                                        <DriftDropDown fetchDriftData={fetchDriftData} selectedFilter={activeDrift} />
                                    </FlexItem>
                                </Flex>
                                <Bullseye>
                                    <Spinner className='ins-c-drift__drift_spinner' />
                                </Bullseye>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Flex>
                                    <FlexItem>
                                        <TemplateCardHeader
                                            title={intl.formatMessage(messages.driftCardTitle)}
                                        />
                                    </FlexItem>
                                    <FlexItem
                                        className='ins-c-drift__drop_down'
                                        align={{ default: 'alignRight' }}>
                                        <DriftDropDown fetchDriftData={fetchDriftData} selectedFilter={activeDrift} />
                                    </FlexItem>
                                </Flex>
                                {driftEvents.baselineDetail?.length > 0 ?
                                    (<TemplateCardBody>
                                        <Flex
                                            direction={{ default: 'column' }}
                                            alignItems={{ default: 'alignItemsCenter' }}>
                                            <FlexItem>
                                                <Flex
                                                    alignItems={{ default: 'alignItemsFlexCenter' }}
                                                    justifyContent={{ default: 'justifyContentCenter' }}>
                                                    <span className='pf-u-font-size-2xl pf-u-text-align-center pf-u-font-weight-normal'>
                                                        {driftEvents.numEvents}
                                                    </span>
                                                </Flex>
                                                <TextContent
                                                    className='insd-c-width-limiter pf-u-text-align-center'>
                                                    <p className='pf-u-font-size-sm'>
                                                        {intl.formatMessage(messages.driftNumberOfEvents)}
                                                    </p>
                                                </TextContent>
                                            </FlexItem>
                                            <Button
                                                variant="secondary"
                                                component='a'
                                                className='ins-c-drift__investigate_button'
                                                href={ActionTypes.DRIFT_URL}
                                                target='_blank'>
                                                {intl.formatMessage(messages.driftInventigateButtton)}
                                            </Button>
                                        </Flex>
                                        <Divider />
                                        <TextContent
                                            className='insd-c-width-limiter ins-c-drift__top_5'>
                                            <p className='pf-u-font-size-sm'>
                                                {intl.formatMessage(messages.driftTop5)}
                                            </p>
                                        </TextContent>
                                        <DataList className='insd-m-no-padding insd-m-no-top-border insd-m-no-bottom-border' isCompact>
                                            {driftEvents.baselineDetail.slice(0, ActionTypes.TOP_BASELINES).map((baseline, index) =>
                                                <DataListItem key={index}>
                                                    <DataListItemRow>
                                                        <DataListItemCells
                                                            dataListCells={[
                                                                <React.Fragment key={index}>
                                                                    <DataListCell key={index} wrapModifier={DataListWrapModifier.truncate}>
                                                                        <Text
                                                                            component={TextVariants.a}
                                                                            href={`${ActionTypes.DRIFT_BASELINES_URL}/${baseline.baselineId}`}
                                                                            target='_blank'>
                                                                            {baseline.baselineName}
                                                                        </Text>
                                                                    </DataListCell>
                                                                    <DataListCell key={index} className='ins-c-drift__data_list_cell_system_len'>
                                                                        <span className='pf-u-font-weight-normal ins-c-drift__system_len'>
                                                                            <SortUpIcon  color='black'/>
                                                                            {intl.formatMessage(messages.driftSystems,
                                                                                { systems: baseline.systems.length })}
                                                                        </span>
                                                                    </DataListCell>
                                                                    <DataListCell key={index} className='ins-c-drift__data_list_cell_compare'>
                                                                        <Text
                                                                            component={TextVariants.a}
                                                                            href={`${ActionTypes.DRIFT_COMPARE_URL}=${baseline.baselineId}`}
                                                                            className='ins-c-drift__text_compare'
                                                                            target='_blank'>
                                                                            {intl.formatMessage(messages.driftCompare)}
                                                                        </Text>
                                                                    </DataListCell>
                                                                </React.Fragment>
                                                            ]}
                                                        />
                                                    </DataListItemRow>
                                                </DataListItem>
                                            )}
                                        </DataList>
                                    </TemplateCardBody>)
                                    : (<DriftEmptyState />)
                                }
                            </React.Fragment>
                        )}
                </React.Fragment>
            }
        />
    );
};

DriftCard.propTypes = {
    fetchDrift: PropTypes.func,
    driftEvents: PropTypes.object,
    driftEventFetchStatus: PropTypes.string,
    intl: PropTypes.any
};

export default routerParams(DriftCard);
