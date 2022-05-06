export default function withDefault<
    T extends { defaultProps?: Partial<TDefaults> },
    TDefaults
>(o: T, defaultProps: TDefaults): T & { defaultProps: TDefaults } {
    o.defaultProps = defaultProps;
    return o as any;
}
