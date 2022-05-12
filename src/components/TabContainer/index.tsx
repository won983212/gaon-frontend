import React, { useCallback, useState } from 'react';
import { TabHeaderItem, TabHeaders } from '@/components/TabContainer/style';

interface TabContainerProps {
    tabNames: string[];
    children: React.ReactNode | React.ReactNode[];
}

export default function TabContainer({
    tabNames,
    children
}: TabContainerProps) {
    const [selected, setSelected] = useState(0);
    let childrenArray: React.ReactNode[];

    if (!Array.isArray(children)) {
        childrenArray = [children];
    } else {
        childrenArray = children;
    }

    if (tabNames.length !== childrenArray.length) {
        throw new Error('tabNames.length !== children.length');
    }

    const onClickTab = useCallback(
        (index: number) => {
            setSelected(index);
        },
        [setSelected]
    );

    return (
        <div>
            <TabHeaders>
                {tabNames.map((value, idx) => (
                    <TabHeaderItem
                        key={idx}
                        onClick={() => onClickTab(idx)}
                        isSelected={idx === selected}
                    >
                        {value}
                    </TabHeaderItem>
                ))}
            </TabHeaders>
            <div>{childrenArray[selected]}</div>
        </div>
    );
}
