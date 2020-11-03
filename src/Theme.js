import {createMuiTheme} from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
          light: '#484848',
          main: '#212121',
          dark: '#000000',
          contrastText: '#000000',
        },
        secondary: {
          light: '#5f5fc4',
          main: '#283593',
          dark: '#001064',
          contrastText: '#ffffff',
        },
      },
      typography: {
        useNextVariants: true,
        fontFamily: '"Times New Roman", Arial, Helvetica, sans-serif',
     },
})

export default theme;