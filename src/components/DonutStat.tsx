import { PieChart, Pie, Cell } from 'recharts';

type DonutStatProps = {
    value: number;
    label: string;
    unit?: string;
    color?: string;
};

const DonutStat = ({ value, label, unit = '', color = '#10B981' }: DonutStatProps) => {
    const data = [
        { name: 'value', value },
        { name: 'rest', value: 100 - Math.min(value, 100) },
    ];

    return (
        <div className="flex flex-col items-center">
            <PieChart width={200} height={200}>
                <Pie
                    data={data}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={0}
                    cornerRadius={50}
                >
                    <Cell fill={color} />
                    <Cell fill="#e5e7eb" />
                </Pie>
            </PieChart>
            <div className="absolute mt-[85px] text-center">
                <div className="text-2xl font-bold">
                    {value}{unit}
                </div>
                <div className="text-sm text-[#333]">
                    {label}
                </div>
            </div>
        </div>
    );
};

export default DonutStat;