import Svg, { Circle } from 'react-native-svg';
import React from 'react';
import { Colors } from '../constants/colors';
import { usePlayerContext } from '../store/trackPlayerContext';

interface CircleProps {
    progress: any,
    size: number,
}
const CircularProgress = ({ progress, size }: CircleProps) => {
    const radius = (size - 10) / 2; // Adjust for stroke width
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const { isDarkMode } = usePlayerContext();
    return (
        <Svg height={size} width={size}>
            <Circle
                stroke={isDarkMode ? Colors.white : Colors.gray}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={3}
            />
            <Circle
                stroke={Colors.activeTitle}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={3}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                rotation="-90" // Rotate to start from the top
                originX={size / 2}
                originY={size / 2}
            />
        </Svg>
    );
};

export default CircularProgress;
