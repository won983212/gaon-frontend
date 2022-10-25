import React from 'react';
import styled from 'styled-components';

const TabWrapper = styled.div`
    padding: 0 16px;
    color: var(--text);
`;

const Select = styled.select`
    margin: 0;
    min-width: 0;
    display: block;
    width: 100%;
    padding: 8px 8px;
    font-size: inherit;
    line-height: inherit;
    border: 0;
    border-radius: 4px;
    color: inherit;
    background-color: var(--primary);

    &:focus {
        outline: none;
    }
`;

export interface SettingTabProps {
    allLangs: string[];
    editorLang: string;
    onChangeLang?: (lang: string) => void;
}

export default function SettingTab({
    allLangs,
    editorLang,
    onChangeLang
}: SettingTabProps) {
    return (
        <TabWrapper>
            <p>에디터 언어</p>
            <Select
                defaultValue={editorLang}
                onChange={(e) => {
                    if (onChangeLang != null) {
                        onChangeLang(e.target.value);
                    }
                }}
            >
                {allLangs.map((lang) => {
                    return (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    );
                })}
            </Select>
        </TabWrapper>
    );
}
