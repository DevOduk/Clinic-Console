export const formatedValue = (value: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
    });

    return `${formatter.format(value)}`;
};