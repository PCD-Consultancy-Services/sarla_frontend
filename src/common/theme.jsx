import { createTheme } from '@mui/material/styles';
import { Colors } from './colors';


const theme = createTheme({
  palette: {
    primary: {
      main: Colors.primary,
    },
    grey: {
      main: Colors.grey,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '22px',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color) !important',
          },
        },
        notchedOutline: {
          borderRadius: '22px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '22px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '22px',
          },
          '& .Mui-focused': {
            color: 'var(--primary-color) !important',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary-color) !important',
          },
        },
      },
    },
    // MuiPaper: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: '22px',
    //     },
    //   },
    // },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '& .MuiDataGrid-withBorderColor': {
            border: 'none',
          },
          '& .MuiDataGrid-cell:hover, .MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:hover, .MuiDataGrid-row.Mui-selected:hover, .MuiDataGrid-row.Mui-selected, .MuiDataGrid-row.Mui-hovered': {
            backgroundColor: 'transparent !important',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        grey: {
          backgroundColor: 'var(--grey-color)',
          color: 'var(--primary-color)',
        },
        root: {
          borderRadius: "22px"
        }
      },
    },
  },
});

export default theme;
