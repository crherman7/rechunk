import chalk from 'chalk';

import pak from '../../package.json';

export const LOGO = chalk.green`
              ████████████                   
              ████████████                   
              ██████████████████                
              ████          ████                
              ████          ████                
              ████          ████                
              ████          ████                
              ████          ████                
              ██████████████████                
              ███████████████                   
              ███████████████                   
              ████     ████                     
              ████     ████████                 
              ████        █████                 
              ████        █████       
                          
        Welcome to ReChunk ${chalk.bold.white`v${pak.version}`}
    ${chalk.white.dim`React Native - Remote Chunks - Secure`}
    `;
