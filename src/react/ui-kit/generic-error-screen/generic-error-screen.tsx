import { Grid2 as Grid, Typography } from '@mui/material';

export function GenericErrorScreen({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid
        size={{ xs: 12, md: 8, lg: 6 }}
        display="flex"
        flexDirection="column"
        textAlign="center"
        gap={2}
      >
        <Typography variant="h1">{title}</Typography>
        <Typography variant="body1" color="error">
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
}
