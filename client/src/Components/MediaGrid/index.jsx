import { Grid } from "@mui/material";
import MovieCard from "../MovieCard";

const MediaGrid = ({ medias}) => {
  return (
    <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
      {medias.map((media, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <MovieCard movie={media}/>
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaGrid;