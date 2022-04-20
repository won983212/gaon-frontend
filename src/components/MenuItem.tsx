import React from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

function MenuItem() {
    return (
        <MenuItemBlock>
            <NavLink to="/workspace/channel/1">
                <h2>
                    <MenuIcon>
                        <MdOutlineDashboard />
                    </MenuIcon>
                    <span>Dashboard</span>
                </h2>
            </NavLink>
        </MenuItemBlock>
    );
}

const MenuItemBlock = styled.div`
    & a {
        padding-left: 10px;
        color: inherit;
        text-decoration: none;
        height: 28px;
        line-height: 28px;
        display: flex;
        align-items: center;
    }

    &.selected {
        color: white;
    }
`;

const MenuIcon = styled.div`
    border: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
`;

export default MenuItem;
