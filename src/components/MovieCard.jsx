import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, Rating, Dialog, DialogTitle, DialogContent} from '@mui/material'
import React, {useState, useEffect} from 'react'
import StarIcon from '@mui/icons-material/Star';
import MovieDetailsArea from './MovieDetailsArea';

export default function MovieCard(props) {

  const {poster_path, title, release_date, genre_ids, vote_average, id, original_title, vote_count } = props.movie
  const {size} = props
  const imageUrl = "https://image.tmdb.org/t/p/w500/"+poster_path
  const releaseYear = release_date!== undefined? release_date.substring(0,4) :"N/A"

  const [genres, setGenres] = useState([])
  const [open, setOpen] = useState(false)
  const [scroll] = React.useState('paper');

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US')
    .then(response => response.json())
    .then(data => {
      data.genres.map(genre =>{
        if(genre_ids.includes(genre.id) && !genres.includes(genre.name )){
          setGenres(genres => [...genres, genre.name])
        }
      })
    })
  }, [genres, genre_ids])



  return (
    <>
    <Grid item xs={size}>
      <Card onClick={()=>setOpen(true)} sx={{m:1}}>
        <CardActionArea>
          {poster_path!=null &&
            <CardMedia component="img" image={imageUrl}>
            </CardMedia>
          }
          {poster_path==null &&
            <CardMedia component="img" src="/movierama/images/Poster_not_available.jpg" alt="imageNotAvailable">
            </CardMedia>
          }
          <CardContent>
            <Typography noWrap variant='h5'>{title}</Typography>
            <Typography noWrap color="text.secondary" variant='subtitle1'>{"Original title: " + original_title}</Typography>
            {releaseYear === "" &&
              <Typography noWrap color="text.secondary" variant='subtitle1'>{"Release year: N/A"}</Typography>
            }
            {releaseYear !== "" &&
              <Typography noWrap color="text.secondary" variant='subtitle1'>{releaseYear}</Typography>
            }
            <Grid container>
              <Grid item xs={8}>
                {genre_ids.length>0 &&
                  <Typography noWrap color="text.secondary" variant='subtitle2'>
                  {genres.map(genreName=>{
                    return genreName===genres.at(-1)? " "+genreName : " "+genreName+","
                  })}
                </Typography>
                }
                {genre_ids.length===0 &&
                  <Typography noWrap color="text.secondary" variant='subtitle2'>
                    Genre: N/A
                  </Typography>
                }
                
              </Grid>
                <Grid item xs={4}>
                  {vote_count>0 &&
                    <Typography noWrap sx={{ display:'flex', justifyContent: "flex-end"}} color="text.secondary" variant='subtitle2'>{vote_average.toString().substring(0,3)+"/10"}<StarIcon fontSize="small"/></Typography>
                  }
                </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
    <Dialog maxWidth="xl" open={open} onClose={() => setOpen(false)}>
    <DialogTitle>
      {title}
    </DialogTitle>
    <DialogContent dividers={scroll === 'paper'}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={3}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12}>
                {poster_path!=null &&
                  <img style={{"marginBottom":"10px"}} width="300px" height="400px" src={imageUrl} alt='moviePoster'/>
                }
                {poster_path==null &&
                  <img style={{"marginBottom":"10px"}} width="300px" height="400px" src="/movierama/images/Poster_not_available.jpg" alt='moviePoster'/>
                }
              </Grid>
              <Grid item xs={12}>
                {release_date === '' &&
                  <Typography noWrap color="text.secondary" variant='subtitle1'>Release year: N/A</Typography>
                }
                {release_date !== '' &&
                  <Typography noWrap color="text.secondary" variant='subtitle1'>Release year: {releaseYear}</Typography>
                }
              </Grid>
              <Grid item xs={12}>
                {genre_ids.length>0 &&
                  <Typography color="text.secondary" variant='subtitle2'>
                    {genres.length===1?"Genre:":"Genres:"} 
                      {genres.map((genreName, index)=>{
                        return genreName===genres.at(-1)? " "+genreName : " "+genreName+","
                      })}
                  </Typography>
                }
                {genre_ids.length===0 &&
                  <Typography color="text.secondary" variant='subtitle2'>
                    Genre: N/A
                  </Typography>
                }
              </Grid>
              <Grid item xs={12}>
                {vote_count !== 0 &&
                  <Rating value={vote_average/2} precision={0.2} readOnly size='large' />
                }
              </Grid>
              <Grid item xs={12}>
                <Typography>Id: {id}</Typography>
              </Grid>

            </Grid>
          </Grid>
          <Grid item xs={9}>
            <DialogContent id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
              <MovieDetailsArea movie={props.movie}/>
            </DialogContent>
          </Grid>
        </Grid>
      
    </DialogContent>

  </Dialog>
  </>
    
  )
}
