import React, { useCallback } from 'react';
import Modal, { Action } from '@/components/Modal';
import { addAdmin, removeAdmin, useAdminsSWR } from '@/api/user';
import useUser from '@/hooks/useUser';
import styled from 'styled-components';
import useRoom from '@/hooks/useRoom';
import { MdDelete } from 'react-icons/all';
import Input from '@/components/Input';
import Button from '@/components/Button';
import useInput from '@/hooks/useInput';

const AdminList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 8px;
    height: 250px;
    overflow-y: auto;
`;

const AdminListItem = styled.li`
    display: flex;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0 0 2px 2px lightgrey;
    margin-bottom: 8px;
    padding: 8px;

    & .name {
        flex: 1;
    }

    & .delete {
        display: flex;
        justify-content: center;
        border-radius: 50%;
        padding: 4px;
        margin: -4px;

        &:hover {
            background: #efefef;
        }
    }
`;

const ActionBox = styled.div`
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 4px;
`;

const InputUsername = styled(Input)`
    flex: 1;
    height: 30px;
    font-size: 10pt;
    margin-bottom: 0;
    margin-right: 12px;
`;

interface UserPermissionModalProps {
    isOpen: boolean;
    onAction: (action: Action) => void;
}

function UserPermissionModal({ isOpen, onAction }: UserPermissionModalProps) {
    const { identifier } = useUser();
    const { workspaceId } = useRoom();
    const {
        data: admins,
        error,
        mutate
    } = useAdminsSWR(workspaceId, identifier?.token);
    const [toAddAdminName, onChangedAdminName, setToAddAdminName] =
        useInput('');

    const onDeleteAdmin = useCallback(
        (adminId: number) => {
            removeAdmin(workspaceId, adminId, identifier?.id, identifier?.token)
                .then(() => {
                    mutate(admins?.filter((admin) => admin.id !== adminId));
                })
                .catch((err) => {
                    console.error(err);
                    alert(`삭제하지 못했습니다 (${err.response.data})`);
                });
        },
        [admins, identifier?.id, identifier?.token, mutate, workspaceId]
    );

    const onAddAdmin = () => {
        addAdmin(workspaceId, toAddAdminName, identifier?.id, identifier?.token)
            .then((admin) => {
                mutate(admins?.concat(admin.data));
            })
            .catch((err) => {
                console.error(err);
                alert(`추가하지 못했습니다 (${err.response.data})`);
            });
        setToAddAdminName('');
    };

    return (
        <Modal isOpen={isOpen} onAction={onAction}>
            <h3>Admin 목록</h3>
            {!admins ? (
                error ? (
                    <p>불러올 수 없습니다.</p>
                ) : (
                    <p>불러오는 중...</p>
                )
            ) : (
                <div>
                    <AdminList>
                        {admins.map((admin) => (
                            <AdminListItem key={admin.id}>
                                <div className="name">{admin.name}</div>
                                {admin.id !== identifier.id &&
                                    <div
                                        className="delete"
                                        onClick={() => onDeleteAdmin(admin.id)}
                                    >
                                        <MdDelete
                                            color="var(--primary-lighter)"
                                            size="20px"
                                        />
                                    </div>
                                }
                            </AdminListItem>
                        ))}
                    </AdminList>
                    <ActionBox>
                        <InputUsername
                            placeholder="관리자로 추가할 유저 이름"
                            value={toAddAdminName}
                            onChange={onChangedAdminName}
                        />
                        <Button size="small" onClick={onAddAdmin}>
                            추가
                        </Button>
                    </ActionBox>
                </div>
            )}
        </Modal>
    );
}

export default UserPermissionModal;
