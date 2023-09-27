import { Grid } from "@mui/material";
import MovieCard from "../MovieCard";
import React from "react";

interface Media {
  // Define the structure of your 'media' object here
  // For example:
  id: number;
  title: string;
  // Add other properties as needed
}

interface MediaGridProps {
  medias: Media[];
}

const MediaGrid: React.FC<MediaGridProps> = ({ medias }) => {
  return (
    <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
      {medias.map((media, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <MovieCard movie={media} />
        </Grid>
      ))}
    </Grid>
  );
};

export default MediaGrid;
