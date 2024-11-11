import React from 'react';
import { Box, Button, CircularProgress, Grid } from "@mui/material";

const FormLayout = ({ onSubmit, onCancel, loading, children }) => {
  return (
    <Box paddingTop={5}>
      <form onSubmit={onSubmit}>
        <Grid
          container
          spacing={2}
          bgcolor="white"
          borderRadius="15px"
          padding="20px"
        >
          {children}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              className="me-3 w100"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="w100"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} /> : "Save"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FormLayout;