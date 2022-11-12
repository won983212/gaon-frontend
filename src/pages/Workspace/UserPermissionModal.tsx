import React from 'react';
import Modal, { Action } from '@/components/Modal';
import { useAdminsSWR } from '@/api/user';
import useUser from '@/hooks/useUser';
import styled from 'styled-components';

export const AdminList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

export const AdminListItem = styled.li`
    border-radius: 4px;
    box-shadow: 0 0 2px 2px lightgrey;
    margin-bottom: 8px;
    padding: 8px;
`;

interface UserPermissionModalProps {
    isOpen: boolean;
    onAction: (action: Action) => void;
}

function UserPermissionModal({ isOpen, onAction }: UserPermissionModalProps) {
    const { identifier } = useUser();
    const { data: admins, error } = useAdminsSWR(identifier?.token);

    return (
        <Modal isOpen={isOpen} onAction={onAction}>
            <p>hello</p>
            {!admins ? (
                error ? (
                    <p>불러올 수 없습니다.</p>
                ) : (
                    <p>불러오는 중...</p>
                )
            ) : (
                <AdminList>
                    {admins.map((admin) => (
                        <AdminListItem key={admin.id}>
                            {admin.name}
                        </AdminListItem>
                    ))}
                </AdminList>
            )}
        </Modal>
    );
}

export default UserPermissionModal;
