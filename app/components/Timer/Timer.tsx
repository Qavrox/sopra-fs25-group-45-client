import React, { useEffect, useState } from 'react';

interface TimerProps {
    initialTime: number;
    onTimeUp: () => void;
    isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isRunning }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0.01) {  
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                const newTime = prevTime - 0.01;  
                setProgress((newTime / initialTime) * 100);
                return newTime;
            });
        }, 10);  

        return () => clearInterval(interval);
    }, [isRunning, onTimeUp, initialTime]);

    return (

            <div style={{ 
                width: '100%',
                height: '20px',
                backgroundColor: '#333',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '2px solid #666'
            }}>
                <div 
                    style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: progress <= 25 ? '#ff4444' : '#00ff00',
                        transition: 'width 0.01s linear, background-color 0.3s'  
                    }}
                />
            </div>
    );
};

export default Timer;