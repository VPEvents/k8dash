import React from 'react';

const LogsSvg = (props: {[key: string]: any}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" {...props}>
        <path d="M149.997 0C67.158 0 .003 67.161.003 149.997S67.158 300 149.997 300s150-67.163 150-150.003S232.837 0 149.997 0zm59.456 220.955c-1.644 0-3.268-.091-4.866-.254-1.46.163-2.944.254-4.448.254h-37.656l40.504-40.87c2.342-2.365 3.079-5.983 1.849-9.137-1.227-3.156-4.165-5.218-7.431-5.218h-19.958v-42.662c0-5.14-4.171-9.311-9.311-9.311h-28.231c-5.14 0-9.311 4.168-9.311 9.311v42.662h-21.576c-4.43 0-8.019 3.737-8.019 8.354 0 2.63 1.162 4.969 2.977 6.5l40.011 40.372H83.794c-21.916 0-39.684-17.771-39.684-39.684 0-18.256 12.327-33.615 29.108-38.245 1.854-15.541 15.058-27.598 31.094-27.598 4.85 0 9.428 1.136 13.526 3.105 7.973-22.188 29.188-38.053 54.118-38.053 29.896 0 54.455 22.821 57.227 51.988 15.779 7.42 26.709 23.454 26.709 42.045-.001 25.649-20.791 46.441-46.439 46.441z"/>
    </svg>
);

export default LogsSvg;