import React from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { MenuIconContainer, MenuItemBlock } from './style';

function MenuItem() {
    return (
        <MenuItemBlock>
            <NavLink to="/workspace/channel/1">
                <h2>
                    <MenuIconContainer>
                        <MdOutlineDashboard />
                    </MenuIconContainer>
                    <span>Dashboard</span>
                </h2>
            </NavLink>
        </MenuItemBlock>
    );
}

export default MenuItem;
