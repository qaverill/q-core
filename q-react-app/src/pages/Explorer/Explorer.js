// import React, { Component } from 'react';
// import Artist from './Components/Artist/Artist';
// import Album from './Components/Album/Album';
// import Track from './Components/Track/Track';
// import { getArtist, getAlbum, getTrack, searchSpotify } from '../../utilities/SpotifyAPI/Getters'
// import { getRandomColor } from '../functions';
// import './Explorer.css';
//
// class Explorer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       path: [<p>Search Spotify</p>],
//       pointer: 0
//     };
//     this.goBack = this.goBack.bind(this);
//     this.goForwards = this.goForwards.bind(this);
//   }
//
//   handleEnterKey = (e) => {
//     if (e.key === 'Enter') {
//       this.searchSpotify()
//     }
//   };
//
//   render() {
//     return (
//       <div className="explorer dark">
//         <div className="explorer-top">
//           <img alt="back" src={require('./Images/arrow.png')} className={(this.state.pointer === 0 ? "back unavailable" : "back")} onClick={this.goBack} />
//           <img alt="forwards" src={require('./Images/arrow.png')} className={(this.state.pointer === this.state.path.length - 1 ? "forwards unavailable" : "forwards")} onClick={this.goForwards}/>
//           <input type="text" id="searchBox" className="search" placeholder="Search Spotify..." onKeyPress={this.handleEnterKey}/>
//         </div>
//         <div className="search-results">
//           {this.state.path[this.state.pointer]}
//         </div>
//       </div>
//     );
//   }
//
//   goBack() {
//     if (this.state.pointer > 0) {
//       this.setState({pointer: this.state.pointer - 1});
//     }
//   }
//
//   goForwards() {
//     if (this.state.pointer < this.state.path.length - 1) {
//       this.setState({pointer: this.state.pointer + 1});
//     }
//   }
//
//   searchSpotify() {
//     const searchTerm = document.getElementById('searchBox').value;
//     const _this = this;
//     searchSpotify(searchTerm).then(function(res){
//       _this.addNodeToPath(_this.parseResults(res.data))
//     }).catch(function(e){
//       console.log('ERROR', e);
//     });
//   }
//
//   addNodeToPath(node) {
//     for (let i = this.state.path.length - 1; i > this.state.pointer; i--){
//       this.state.path.pop();
//     }
//     this.state.path.push(node);
//     this.setState({pointer: this.state.pointer + 1});
//   }
//
//   parseResults(results){
//     const artists = this.parseArtistResults(results.artists.items);
//     const albums = this.parseAlbumResults(results.albums.items);
//     const tracks = this.parseTrackResults(results.tracks.items);
//     return (artists.length + albums.length + tracks.length > 0
//       ? [
//         <div className="search-result">
//           <h1 align="center">Artists:</h1>
//           {artists}
//         </div>,
//         <div className="search-result">
//           <h1 align="center">Albums:</h1>
//           {albums}
//         </div>,
//         <div className="search-result">
//           <h1 align="center">Tracks:</h1>
//           {tracks}
//         </div>
//       ]
//       : <h2>No results found for "{this.state.term}"</h2>
//     );
//   }
//
//   getResultsButtonStyle(images){
//     return (images != null && images.length > 0
//       ? { backgroundImage: 'url(' + images[0].url + ')' }
//       : { 'background-color': getRandomColor() }
//     );
//   }
//
//   parseArtistResults(artists){
//     return (artists.length === 0
//       ? <p>No results found for "{document.getElementById('searchBox').value}"</p>
//       : artists.map(artist =>
//         <button onClick={this.addNodeToPath.bind(this, <Artist artist={artist.id} explorer={this}/>)} key={artist.id}
//                 className="search-result light" style={this.getResultsButtonStyle(artist.images)}>
//           <div className="search-result-text">{artist.name}</div>
//         </button>
//       )
//     )
//   }
//
//   parseAlbumResults(albums){
//     return (albums.length === 0
//       ? <p>No results found for "{document.getElementById('searchBox').value}"</p>
//       : albums.map(album =>
//         <button onClick={this.addNodeToPath.bind(this, <Album album={album.id} explorer={this}/>)} key={album.id}
//                 className="search-result light" style={this.getResultsButtonStyle(album.images)}>
//           <div className="search-result-text">{album.name}</div>
//         </button>
//       )
//     );
//   }
//
//   parseTrackResults(tracks){
//     console.log(tracks);
//     return (tracks.length === 0
//       ? <p>No results found for "{document.getElementById('searchBox').value}"</p>
//       : tracks.map(track =>
//         <button onClick={this.addNodeToPath.bind(this, <Track id={track.id} explorer={this}/>)} key={track.id}
//                 className="search-result light" style={this.getResultsButtonStyle(track.album.images)}>
//           <div className="search-result-text">{track.name}</div>
//         </button>
//       )
//     )
//   }
// }
// export default Explorer;