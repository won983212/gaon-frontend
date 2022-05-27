import React, { useCallback, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import useChannel from '@/hooks/useChannel';
import { useNavigate, useParams } from 'react-router';
import loadable from '@loadable/component';
import useConferenceTabIndex from '@/hooks/useConferenceTabIndex';

const TabCodeShare = loadable(() => import('./TabCodeShare'));
const TabBoardShare = loadable(() => import('./TabBoardShare'));

function Conference() {
    const navigate = useNavigate();
    const { workspaceId } = useParams();
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);
    const { data: conferenceTabIndex } = useConferenceTabIndex();

    const onCloseEnterDialog = useCallback(
        (action: Action) => {
            if (action === 'yes') {
                setShowEnterDialog(false);
            } else {
                navigate(`/workspace/${workspaceId}/channel`);
            }
        },
        [navigate, workspaceId]
    );

    if (showEnterDialog) {
        return (
            <Modal isOpen={true} onAction={onCloseEnterDialog} buttons="yesno">
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        );
    }

    let routedTab = <p>Empty</p>;
    switch (conferenceTabIndex) {
        case 0:
            routedTab = <TabCodeShare />;
            break;
        case 1:
            routedTab = <TabBoardShare />;
            break;
    }

    return routedTab;
}

export default Conference;
