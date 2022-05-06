import React, { useCallback, useState } from 'react';
import Modal, { Action } from '@/components/Modal';
import useChannel from '@/hooks/useChannel';

function Conference() {
    const { data: channelInfo } = useChannel();
    const [showEnterDialog, setShowEnterDialog] = useState(true);

    const onCloseEnterDialog = useCallback((action: Action) => {
        setShowEnterDialog(false);
    }, []);

    return (
        <div>
            <p>Conference</p>
            <Modal
                isOpen={showEnterDialog}
                onAction={onCloseEnterDialog}
                buttons="yesno"
            >
                {channelInfo?.name} 회의에 참가하시겠습니까?
            </Modal>
        </div>
    );
}

export default Conference;
